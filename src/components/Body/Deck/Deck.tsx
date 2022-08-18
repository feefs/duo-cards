import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Timestamp } from 'firebase/firestore';
import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate, useParams } from 'react-router-dom';

import { deleteDeck, linkDeck, unlinkDeck } from '../../../data/mutations';
import { linkDeckVariables } from '../../../data/mutations/deck';
import { fetchDeck, fetchParent } from '../../../data/queries';
import { auth } from '../../../ts/firebase';
import { ConfirmModal, CollectionModal } from '../../Modals';
import './Deck.scss';

function formatDate(timestamp: Timestamp): string {
  return timestamp.toDate().toLocaleString();
}

function Deck(): JSX.Element {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const params = useParams();
  const queryClient = useQueryClient();

  const {
    isLoading: isDeckLoading,
    isError,
    data: deck,
  } = useQuery(['deck', params.deckId], () => fetchDeck(params.deckId!), {
    enabled: !!user && !!params.deckId,
  });

  const {
    isLoading: isParentLoading,
    isFetching: isParentFetching,
    data: parent,
  } = useQuery(['parent', params.deckId], () => fetchParent(user?.uid!, params.deckId!), {
    enabled: !!user && !!params.deckId,
  });

  const [addOpen, setAddOpen] = useState<boolean>(false);
  const [unlinkOpen, setUnlinkOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

  const addCollectionLinkMutation = useMutation((variables: linkDeckVariables) => linkDeck(variables), {
    onSuccess: () => {
      queryClient.invalidateQueries(['deck', params.deckId]);
      queryClient.invalidateQueries(['parent', params.deckId]);
      setAddOpen(false);
    },
  });

  const unlinkMutation = useMutation(() => unlinkDeck(user?.uid!, params.deckId!), {
    onSuccess: () => {
      queryClient.invalidateQueries(['deck']);
      queryClient.invalidateQueries(['parent']);
      setUnlinkOpen(false);
    },
  });

  const deleteMutation = useMutation(() => deleteDeck(user?.uid!, params.deckId!), {
    onSuccess: () => {
      navigate('/');
    },
  });

  return (
    <>
      <div className="Deck">
        <div className="cards">
          {isDeckLoading ? (
            <div className="text">Loading...</div>
          ) : isError ? (
            <div className="text">Deck doesn't exist!</div>
          ) : (
            deck.cards.map((card, index) => (
              <div className="card" key={index}>
                <div className="card-text">
                  <div />
                  <div>{card.ja}</div>
                  <div>{card.pronunciation}</div>
                  <div>{card.en}</div>
                  <div>{card.pos}</div>
                  <div />
                </div>
              </div>
            ))
          )}
        </div>
        <div className="deck-actions">
          <button className="practice-button" onClick={() => navigate(`/practice/${params.deckId}`)}>
            Practice
          </button>
          <button className="edit-button" onClick={() => navigate(`/edit/${params.deckId}`)}>
            Edit
          </button>
        </div>
        <div className="deck-info">
          {isDeckLoading || isError || isParentLoading ? null : (
            <>
              <div className="info-name">{deck.name}</div>
              <hr />
              <div># of cards: {deck.cards.length}</div>
              <div>
                <div>Last practiced:</div>
                <div>{deck.last_practiced ? formatDate(deck.last_practiced) : 'Never'}</div>
              </div>
              <div>
                <div>Last edited:</div>
                <div>{formatDate(deck.last_edited)}</div>
              </div>
              <div>
                <div>Time created:</div>
                <div>{formatDate(deck.created)}</div>
              </div>
              <hr />
              {deck.linked ? (
                <button className="collection" onClick={() => setUnlinkOpen(true)}>
                  Unlink from Collection
                </button>
              ) : (
                <button className="collection" onClick={() => setAddOpen(true)}>
                  Add to Collection
                </button>
              )}
              <button className="delete-deck" onClick={() => setDeleteOpen(true)}>
                Delete Deck
              </button>
            </>
          )}
        </div>
      </div>
      {isDeckLoading || isError || isParentFetching ? null : (
        <>
          <CollectionModal
            {...{
              open: addOpen,
              onClose: () => setAddOpen(false),
              user,
              deck,
              deckId: params.deckId,
              parent,
              addCollectionLink: async (variables: linkDeckVariables) =>
                await addCollectionLinkMutation.mutateAsync(variables),
            }}
          />
          <ConfirmModal
            {...{
              open: unlinkOpen,
              onClose: () => setUnlinkOpen(false),
              text: `Unlink collection from ${parent?.name}?`,
              confirmAction: async () => await unlinkMutation.mutateAsync(),
            }}
          />
          <ConfirmModal
            {...{
              open: deleteOpen,
              onClose: () => setDeleteOpen(false),
              text: `Delete the deck ${deck.name}?`,
              confirmAction: async () => await deleteMutation.mutateAsync(),
            }}
          />
        </>
      )}
    </>
  );
}

export default Deck;
