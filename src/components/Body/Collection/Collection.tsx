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
import './Collection.scss';

function Collection(): JSX.Element {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const params = useParams();

  const [loading, setLoading] = useState<boolean>(true);
  const [exists, setExists] = useState<boolean>(true);
  const [empty, setEmpty] = useState<boolean>(false);
  const [collection, setCollection] = useState<CollectionSchema>({
    linked: false,
    name: '',
    parent: null,
    children: [],
    id: '',
  });

  const [open, setOpen] = useState<boolean>(false);

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
        const children: Child[] = linksResult.docs
          .map((doc) => doc.data() as Link)
          .map((link) => ({
            id: link.child_id,
            name: link.child_name,
            time_added: link.created,
            kind: link.child_kind,
          }));

        if (children.length === 0) {
          setEmpty(true);
        } else {
          setEmpty(false);
        }
        children.sort((a, b) => b.time_added.toMillis() - a.time_added.toMillis());
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
                className="entity-preview"
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
                <div className="name">{child.name}</div>
              </div>
            ))
          )}
        </div>
        <div className="collection-actions">
          <button className="new-subcollection-button" onClick={() => setOpen(true)}>
            New subcollection
          </button>
        </div>
        <div className="collection-info">
          {!loading ? (
            <>
              <div className="info-name">{collection.name}</div>
              <hr />
              <div># of entries: {collection.children.length}</div>
              <hr />
              <button
                className="delete-collection"
                onClick={() => {
                  // TODO: Delete collection
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
          open,
          onClose: () => setOpen(false),
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
              ],
            });
          },
        }}
      ></InputModal>
    </>
  );
}

export default Collection;
