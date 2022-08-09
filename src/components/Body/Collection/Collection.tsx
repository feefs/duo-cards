import file from 'bootstrap-icons/icons/file.svg';
import files from 'bootstrap-icons/icons/files.svg';
import {
  collection as firestoreCollection,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  where,
  writeBatch,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate, useParams } from 'react-router-dom';

import { auth, firestore } from '../../../ts/firebase';
import { Child, ChildKind, CollectionSchema, Link, Parent } from '../../../ts/interfaces';
import { InputModal } from '../../Modals';
import { ConfirmModal } from '../../Modals/Confirm/ConfirmModal';
import './Collection.scss';

function Collection(): JSX.Element {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const params = useParams();

  const [loading, setLoading] = useState<boolean>(true);
  const [exists, setExists] = useState<boolean>(true);
  const [empty, setEmpty] = useState<boolean>(false);
  const [collection, setCollection] = useState<CollectionSchema>({
    created: Timestamp.fromMillis(0),
    linked: false,
    name: '',
    parent: null,
    children: [],
    id: '',
  });

  const [subcollectionOpen, setSubcollectionOpen] = useState<boolean>(false);
  const [deleteCollectionOpen, setDeleteCollectionOpen] = useState<boolean>(false);

  useEffect(() => {
    async function fetchCollection() {
      if (!user || !params.collectionId) {
        return;
      }
      const collectionDoc = await getDoc(doc(firestoreCollection(firestore, 'collections'), params.collectionId));
      if (!collectionDoc.exists()) {
        setExists(false);
      } else {
        let parent: Parent | null = null;
        const parentResult = await getDocs(
          query(
            firestoreCollection(firestore, 'links'),
            where('creator_uid', '==', user.uid),
            where('child_id', '==', collectionDoc.id)
          )
        );
        const doc = parentResult.docs.map((doc) => doc).shift();
        if (doc?.exists()) {
          const link = doc.data() as Link;
          parent = { id: link.parent_id, name: link.parent_name };
        }

        const linksResult = await getDocs(
          query(
            firestoreCollection(firestore, 'links'),
            where('creator_uid', '==', user.uid),
            where('parent_id', '==', collectionDoc.id)
          )
        );
        const collectionChildren: Child[] = [];
        const deckChildren: Child[] = [];
        linksResult.docs
          .map((doc) => doc.data() as Link)
          .forEach((link) => {
            const child = {
              id: link.child_id,
              name: link.child_name,
              time_added: link.created,
              kind: link.child_kind,
            };
            if (link.child_kind === ChildKind.Collection) {
              collectionChildren.push(child);
            } else {
              deckChildren.push(child);
            }
          });
        collectionChildren.sort((a, b) => a.name.localeCompare(b.name));
        deckChildren.sort((a, b) => a.name.localeCompare(b.name));
        const children = [...collectionChildren, ...deckChildren];
        if (children.length === 0) {
          setEmpty(true);
        } else {
          setEmpty(false);
        }
        setCollection({ ...collectionDoc.data(), parent, children, id: collectionDoc.id } as CollectionSchema);
      }
      setLoading(false);
    }

    fetchCollection();
  }, [params.collectionId, user]);

  return (
    <>
      <div className="Collection">
        <div className="entries">
          {loading ? (
            <div className="text">Loading...</div>
          ) : !exists ? (
            <div className="text">Collection doesn't exist!</div>
          ) : empty ? (
            <div className="text">No entries, link one!</div>
          ) : (
            collection.children.map((child) => (
              <div
                className="entry-preview"
                key={child.id}
                onClick={() => {
                  switch (child.kind) {
                    case ChildKind.Collection:
                      navigate(`/collection/${child.id}`);
                      break;
                    case ChildKind.Deck:
                      navigate(`/deck/${child.id}`);
                      break;
                  }
                }}
              >
                <img className="type-icon" src={child.kind === ChildKind.Collection ? files : file} alt="type-icon" />
                <div className="name">{child.name}</div>
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
          {!loading ? (
            <>
              <div className="info-name">{collection.name}</div>
              <hr />
              <div># of entries: {collection.children.length}</div>
              <div>
                # of subcollections: {collection.children.filter((child) => child.kind === ChildKind.Collection).length}
              </div>
              <div># of decks: {collection.children.filter((child) => child.kind === ChildKind.Deck).length}</div>
              <hr />
              <button
                className={'delete-collection' + (collection.children.length === 0 ? '' : ' disabled')}
                onClick={() => {
                  if (collection.children.length === 0) setDeleteCollectionOpen(true);
                }}
              >
                Delete collection
              </button>
            </>
          ) : null}
        </div>
      </div>
      <InputModal
        {...{
          open: subcollectionOpen,
          onClose: () => setSubcollectionOpen(false),
          user,
          placeholderText: 'Subcollection name',
          submitText: async (text) => {
            if (!user) {
              return;
            }
            const batch = writeBatch(firestore);
            const timestamp = Timestamp.now();
            const collectionRef = doc(firestoreCollection(firestore, 'collections'));
            batch.set(collectionRef, {
              created: timestamp,
              creator_uid: user.uid,
              linked: true,
              name: text,
            });
            batch.set(doc(firestoreCollection(firestore, 'links')), {
              child_id: collectionRef.id,
              child_kind: ChildKind.Collection,
              child_name: text,
              created: timestamp,
              parent_name: collection.name,
              parent_id: collection.id,

              creator_uid: user.uid,
            });
            await batch.commit();
            if (empty) {
              setEmpty(false);
            }
            setCollection({
              ...collection,
              children: [
                ...collection.children,
                {
                  id: collectionRef.id,
                  name: text,
                  time_added: timestamp,
                  kind: ChildKind.Collection,
                },
              ].sort((a, b) => a.name.localeCompare(b.name)),
            });
          },
        }}
      ></InputModal>
      <ConfirmModal
        {...{
          open: deleteCollectionOpen,
          onClose: () => setDeleteCollectionOpen(false),
          text: 'Delete collection ?',
          confirmAction: async () => {
            if (!user) {
              return;
            }
            const batch = writeBatch(firestore);
            batch.delete(doc(firestoreCollection(firestore, 'collections'), collection.id));
            const result = await getDocs(
              query(
                firestoreCollection(firestore, 'links'),
                where('creator_uid', '==', user.uid),
                where('child_id', '==', collection.id)
              )
            );
            const d = result.docs.map((doc) => doc).shift();
            if (d?.exists()) {
              batch.delete(d.ref);
            }
            batch.commit();
            navigate('/');
          },
        }}
      />
    </>
  );
}

export default Collection;
