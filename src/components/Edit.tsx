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

  const deckID = match.match.params.id

  const fetchCards = async () => {
    if (!user) {
        return
    }

    const deck = db.collection('decks').doc(deckID)
    const doc = await deck.get()
    const d = doc.data() as DeckSchema

    if (!d || !user || d.creator_uid !== user.uid) {
      return
    }

    const cards: CardSchema[] = d.cards
    let highestID = 0
    for (let i = 0; i < cards.length; i++) {
      if (cards[i].id > highestID) {
        highestID = cards[i].id
      }
    }

    setCardlist(d.cards)
    setID(highestID + 1)
    setDeckName(d.name)
  }

  useEffect(() => {
    fetchCards()
  }, [])

  return (
    <div className="create-body">
      <SlideEditor
        user={user}
        deckName={deckName}
        setDeckName={setDeckName}
        cards={cardlist}
        setCards={setCardlist}
        ID={ID}
        setID={setID}
        deckID={deckID}
        ret={true}
      />
    </div>
  )
}

export default Edit
