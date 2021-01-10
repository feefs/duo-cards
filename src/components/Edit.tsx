import { useState, useEffect } from 'react';
import { auth, db } from '../App';
import SlideEditor from './SlideEditor';

import { useAuthState } from 'react-firebase-hooks/auth'

function Edit(match: any) {
  const[user] = useAuthState(auth);

  const [deckName, setDeckName] = useState("")
  const [cardlist, setCardlist] = useState([])
  const [ID, setID] = useState(0)

  const fetchCards = async () => {
    if (!user) {
        return
    }
    const deck = db.collection('decks').doc(match.match.params.id)
    const doc = await deck.get()
    const d = doc.data() as {cards: [], created: any, creator_uid: string, name: string}
    if (!d || !user || d.creator_uid !== user.uid) {
      return
  }
    const cards: any[] = d.cards
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
        deckName={deckName}
        setDeckName={setDeckName}
        cards={cardlist}
        setCards={setCardlist}
        ID={ID}
        setID={setID}
        dbRef={match.match.params.id}
        ret={true}
      />
    </div>
  )
}

export default Edit
