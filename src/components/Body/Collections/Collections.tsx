import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

import { auth, firestore } from '../../../ts/firebase';
import { CollectionSchema } from '../../../ts/interfaces';
import { CURATED_CONFIGURATIONS, CURATED_ENABLED } from '../../../ts/local';
import './Collections.scss';

const NOT_COLLECTED_ID = 'Uncollected';
const uncollectedCollection = { entities: [], linked_collections: [], name: 'Not Collected', id: NOT_COLLECTED_ID };

function Collections(): JSX.Element {
  const [user, userLoading] = useAuthState(auth);
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [collections, setCollections] = useState<CollectionSchema[]>([]);

  useEffect(() => {
    async function fetchCollections() {
      if (userLoading) {
        return;
      }
      if (!user) {
        setCollections([uncollectedCollection]);
        return;
      }
      const collections: CollectionSchema[] = [];
      const result = await getDocs(query(collection(firestore, 'collections'), where('creator_uid', '==', user.uid)));
      result.forEach((doc) =>
        collections.push({
          ...doc.data(),
          id: doc.id,
        } as CollectionSchema)
      );
      setLoading(false);
      setCollections([...collections, uncollectedCollection]);
    }

    fetchCollections();
  }, [user, userLoading]);

  return (
    <div className="Collections">
      <div className="collections">
        {userLoading ? (
          <div className="text">Loading...</div>
        ) : !user ? (
          <div className="text">User not signed in!</div>
        ) : loading ? (
          <div className="text">Loading...</div>
        ) : (
          collections.map((collection) => (
            <div
              className="collection-preview"
              key={collection.id}
              onClick={() =>
                navigate(collection.id === NOT_COLLECTED_ID ? '/uncollected' : `/collection/${collection.id}`)
              }
            >
              <div className="name">{collection.name}</div>
            </div>
          ))
        )}
      </div>
      <div className="new">
        <button className={user ? '' : 'disabled'} onClick={() => navigate('/new')}>
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
    </div>
  );
}

export default Collections;
