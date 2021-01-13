import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { auth, db } from '../App';

import { useAuthState } from 'react-firebase-hooks/auth'
import firebase from 'firebase/app'

// Types
import { DeckSchema, CardSchema, MatchProps, HistType } from '../ts/interfaces';

function View(match: MatchProps) {
  const[user] = useAuthState(auth);
  const [deck, setDeck] = useState<DeckSchema>({
    cards: [],
    created: null,
    creator_uid: "",
    name: ""
  })

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
  
      setDeck(d)
    }

    fetchCards()
  }, [user, match.match.params.id])

  const cardlist = deck.cards.map((c: CardSchema) => {
    return (
      <div key={c.id} className="card-preview">
        <div className="card-preview-text">
          <div></div>
          <div>{c.ja}</div>
          <div>{c.pronunciation}</div>
          <div>{c.en}</div>
          <div>{c.pos}</div>
          <div></div>
        </div>
      </div>
    )
  })

  return (
    <div className="view-body">
        <div className="cards">{cardlist}</div>
        <Actions deckID={match.match.params.id} />
        <Stats deck={deck} />
    </div>
  )
}

function Actions(props: {deckID: string}) {
  const history: HistType = useHistory()

  const practiceDeck = (id: string) => {
    setTimeout(() => history.push(`/duo-cards/practice/${id}`), 100)
  }

  const editDeck = (id: string) => {
    setTimeout(() => history.push(`/duo-cards/edit/${id}`), 100)
  }

  return (
    <div className="practice-edit-actions">
      <button className="practice-deck" onClick={() => {practiceDeck(props.deckID)}}>Practice</button>
      <button className="edit-deck" onClick={() => {editDeck(props.deckID)}}>Edit</button>
    </div>
  )
}

function Stats(props: {deck: DeckSchema}) {
  const formatTimestamp = (timestamp: firebase.firestore.Timestamp | undefined) => {
    if (!timestamp) return "Never"
    const d = timestamp.toDate() as Date
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`
  }

  return (
    props.deck.created ? 
    <div className="stats">
      <div>
        <div>{props.deck.name}</div>
      </div>
      <div>
        <div># of cards: {props.deck.cards.length}</div>
      </div>
      <div>
        <div>Last practiced:</div>
        <div>{formatTimestamp(props.deck.last_practiced)}</div>
      </div>
      <div>
        <div>Last edited:</div>
        <div>{formatTimestamp(props.deck.last_edited)}</div>
      </div>
      <div>
        <div>Time created:</div>
        <div>{formatTimestamp(props.deck.created)}</div>
      </div>
    </div>
    : <div className="stats"></div>
  )
}

export default View
