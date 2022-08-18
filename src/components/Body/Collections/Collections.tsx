import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import files from 'bootstrap-icons/icons/files.svg';
import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

import { CURATED_CONFIGURATIONS, CURATED_ENABLED } from '../../../data/curated';
import { createCollection } from '../../../data/mutations';
import { fetchCollectionsWithUncollected } from '../../../data/queries';
import { UNCOLLECTED_ID } from '../../../data/queries/collection';
import { auth } from '../../../ts/firebase';
import { NewModal } from '../../Modals';
import './Collections.scss';

function Collections(): JSX.Element {
  const [user, userLoading] = useAuthState(auth);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    isLoading,
    isError,
    data: collections,
  } = useQuery(['collections'], () => fetchCollectionsWithUncollected(user?.uid!), {
    enabled: !!user,
  });

  const [newOpen, setNewOpen] = useState<boolean>(false);

  const newCollectionMutation = useMutation((collectionName: string) => createCollection(collectionName, user?.uid!), {
    onSuccess: () => {
      queryClient.invalidateQueries(['collections']);
      setNewOpen(false);
    },
  });

  return (
    <div className="Collections">
      <div className="collections">
        {!userLoading && !user ? (
          <div className="text">User not signed in!</div>
        ) : isLoading ? (
          <div className="text">Loading...</div>
        ) : isError ? (
          <div className="text">Error fetching collections!</div>
        ) : (
          collections.map(({ data: collection, id }) => (
            <div
              className="collection-preview"
              key={id}
              onClick={() => navigate(id === UNCOLLECTED_ID ? '/uncollected' : `/collection/${id}`)}
            >
              <img className="type-icon" src={files} alt="type-icon" />
              <div className="name">{collection.name}</div>
            </div>
          ))
        )}
      </div>
      <div className="new">
        <button
          className={user ? '' : 'disabled'}
          onClick={() => {
            if (user) {
              setNewOpen(true);
            }
          }}
        >
          New
        </button>
      </div>
      <div className="curated">
        <div className="curated-title">Curated</div>
        <hr />
        {CURATED_ENABLED ? (
          <div className="curated-previews">
            {CURATED_CONFIGURATIONS.map((config) => (
              <div
                className="curated-preview-card"
                key={config.name}
                onClick={() => navigate(`/curated`, { state: { config } })}
              >
                <div className="name">{config.name}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="curated-warning">
            <a
              href="https://github.com/feefs/duo-cards#local-installation-for-curated-cards"
              rel="noreferrer"
              target="_blank"
            >
              Disabled, click to learn more
            </a>
          </div>
        )}
      </div>
      {!user ? null : (
        <NewModal
          {...{
            open: newOpen,
            onClose: () => setNewOpen(false),
            newDeck: () => navigate('/new'),
            newCollection: async (collectionName) => await newCollectionMutation.mutateAsync(collectionName),
          }}
        />
      )}
    </div>
  );
}

export default Collections;
