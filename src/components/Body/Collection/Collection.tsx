import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import file from 'bootstrap-icons/icons/file.svg';
import files from 'bootstrap-icons/icons/files.svg';
import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate, useParams } from 'react-router-dom';

import { createSubcollection, deleteCollection, renameCollection } from '../../../data/mutations';
import { fetchChildren, fetchCollection } from '../../../data/queries';
import { ChildKind } from '../../../data/types';
import { auth } from '../../../ts/firebase';
import { ConfirmModal, InputModal } from '../../Modals';
import './Collection.scss';

function Collection(): JSX.Element {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const params = useParams();
  const queryClient = useQueryClient();

  const {
    isLoading: isCollectionLoading,
    isError: isCollectionError,
    isFetching: isCollectionFetching,
    data: collection,
  } = useQuery(['collection', params.collectionId], () => fetchCollection(params.collectionId!), {
    enabled: !!user && !!params.collectionId,
  });

  const {
    isLoading: areChildrenLoading,
    isError: areChildrenError,
    isFetching: areChildrenFetching,
    data: children,
  } = useQuery(['children', params.collectionId], () => fetchChildren(user?.uid!, params.collectionId!), {
    enabled: !!user && !!params.collectionId,
  });

  const [subcollectionOpen, setSubcollectionOpen] = useState<boolean>(false);
  const [renameCollectionOpen, setRenameCollectionOpen] = useState<boolean>(false);
  const [deleteCollectionOpen, setDeleteCollectionOpen] = useState<boolean>(false);

  const addSubcollectionMutation = useMutation(
    (subcollectionName: string) =>
      createSubcollection(subcollectionName, { id: params.collectionId!, name: collection?.name! }, user?.uid!),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['children']);
        setSubcollectionOpen(false);
      },
    }
  );

  const renameCollectionMutation = useMutation(
    (newCollectionName: string) => renameCollection(newCollectionName, user?.uid!, params.collectionId!),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['collection']);
        setRenameCollectionOpen(false);
      },
    }
  );

  const deleteCollectionMutation = useMutation(() => deleteCollection(user?.uid!, params.collectionId!), {
    onSuccess: () => {
      navigate('/');
    },
  });

  return (
    <>
      <div className="Collection">
        <div className="entries">
          {isCollectionLoading || areChildrenLoading ? (
            <div className="text">Loading...</div>
          ) : isCollectionError ? (
            <div className="text">Collection doesn't exist!</div>
          ) : areChildrenError ? (
            <div className="text">Error fetching children!</div>
          ) : children.length === 0 ? (
            <div className="text">No entries, link one!</div>
          ) : (
            children.map((link) => (
              <div
                className="entry-preview"
                key={link.child_id}
                onClick={() => {
                  switch (link.child_kind) {
                    case ChildKind.Collection:
                      navigate(`/collection/${link.child_id}`);
                      break;
                    case ChildKind.Deck:
                      navigate(`/deck/${link.child_id}`);
                      break;
                  }
                }}
              >
                <img
                  className="type-icon"
                  src={link.child_kind === ChildKind.Collection ? files : file}
                  alt="type-icon"
                />
                <div className="name">{link.child_name}</div>
              </div>
            ))
          )}
        </div>
        <div className="collection-actions">
          <button className="new-subcollection-button" onClick={() => setSubcollectionOpen(true)}>
            New subcollection
          </button>
        </div>
        <div className="collection-info">
          {!(isCollectionLoading || areChildrenLoading || isCollectionError || areChildrenError) ? (
            <>
              <div className="info-name">{collection.name}</div>
              <hr />
              <div># of entries: {children.length}</div>
              <div>
                # of subcollections: {children.filter((link) => link.child_kind === ChildKind.Collection).length}
              </div>
              <div># of decks: {children.filter((link) => link.child_kind === ChildKind.Deck).length}</div>
              <hr />
              <button className="rename-collection" onClick={() => setRenameCollectionOpen(true)}>
                Rename collection
              </button>
              <button
                className={'delete-collection' + (children.length === 0 ? '' : ' disabled')}
                onClick={() => {
                  if (children.length === 0) setDeleteCollectionOpen(true);
                }}
              >
                Delete collection
              </button>
            </>
          ) : null}
        </div>
      </div>
      {isCollectionLoading || isCollectionError || isCollectionFetching || areChildrenFetching ? null : (
        <>
          <InputModal
            {...{
              open: subcollectionOpen,
              onClose: () => setSubcollectionOpen(false),
              initialText: '',
              placeholderText: 'Subcollection name',
              submitText: async (subcollectionName) => await addSubcollectionMutation.mutateAsync(subcollectionName),
            }}
          />
          <InputModal
            {...{
              open: renameCollectionOpen,
              onClose: () => setRenameCollectionOpen(false),
              initialText: collection.name,
              placeholderText: 'Collection name',
              submitText: async (newCollectionName) => await renameCollectionMutation.mutateAsync(newCollectionName),
            }}
          />
          <ConfirmModal
            {...{
              open: deleteCollectionOpen,
              onClose: () => setDeleteCollectionOpen(false),
              text: 'Delete collection?',
              confirmAction: async () => await deleteCollectionMutation.mutateAsync(),
            }}
          />
        </>
      )}
    </>
  );
}

export default Collection;
