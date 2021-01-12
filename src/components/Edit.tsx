import { useState, useEffect } from 'react';
import { auth, db } from '../App';
import SlideEditor from './SlideEditor';

import { useAuthState } from 'react-firebase-hooks/auth'

// Types
import { CardSchema, DeckSchema, MatchProps } from '../ts/interfaces';

function Edit(match: MatchProps) {
  const[user] = useAuthState(auth);
  const [deckName, setDeckName] = useState<string>("")
  const [cardlist, setCardlist] = useState<CardSchema[]>([])
  const [ID, setID] = useState<number>(0)

  useEffect(() => {
    async function fetchCards() {
      if (!user) {
          return
      }
  
      const deck = db.collection('decks').doc(match.match.params.id)
      const doc = await deck.get()
      const d = doc.data() as DeckSchema

      if (!d || d.creator_uid !== user.uid) {
        return
      }
  
      const cards: CardSchema[] = d.cards
      let highestID = 0
      for (let i = 0; i < cards.length; i++) {
        if (cards[i].id > highestID) {
          highestID = cards[i].id
        }
      }

      setDeckName(d.name)
      setID(highestID + 1)
      setCardlist(d.cards)
    }

    fetchCards()
  }, [user, match.match.params.id])

  return (
    <div className="create-edit-body">
      <SlideEditor
        user={user}
        deckName={deckName}
        setDeckName={setDeckName}
        cardlist={cardlist}
        setCardlist={setCardlist}
        cardID={ID}
        setCardID={setID}
        deckID={match.match.params.id}
      />
    </div>
  )
}

export default Edit
