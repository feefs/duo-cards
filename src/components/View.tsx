import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { auth, db } from '../App';

import { useAuthState } from 'react-firebase-hooks/auth'

function View(match: any) {
  const[user] = useAuthState(auth);
  const [data, setData] = useState({
    cards: [],
    created: null,
    last_edited: null,
    last_practiced: null,
    creator_uid: "",
    name: ""
  })
  
  const fetchCards = async () => {
    if (!user) {
        return
    }
    const deck = db.collection('decks').doc(match.match.params.id)
    const doc = await deck.get()
    const d = doc.data() as any
    if (!d) {
        return
    }
    setData(d)
  }

  useEffect(() => {
      fetchCards()
  }, [user])

  const cardlist = data.cards.map((c: any, index: number) => {
    return (
      <div key={c.id} className="card-preview">
          <div></div>
          <div>{c.ja}</div>
          <div>{c.pronunciation}</div>
          <div>{c.en}</div>
          <div>{c.pos}</div>
          <div></div>
      </div>
    )
  })

  return (
    <div className="view-body">
        <div className="cards">{user ? cardlist : "Loading"}</div>
        <Actions match={match.match} />
        <Stats data={data} />
    </div>
  )
}

function Actions(props: any) {
  const history = useHistory()
  const practiceDeck = (id: string) => {
    setTimeout(() => history.push(`/practice/${id}`), 100)
  }

  const editDeck = (id: string) => {
    setTimeout(() => history.push(`/edit/${id}`), 100)
  }

  return (
    <div className="actions">
      <button className="practice-deck" onClick={() => {practiceDeck(props.match.params.id)}}>Practice</button>
      <button className="edit-deck" onClick={() => {editDeck(props.match.params.id)}}>Edit Deck</button>
    </div>
  )
}

function Stats(props: any) {
  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return "Never"
    const d = timestamp.toDate() as Date
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`
  }

  return (
    <div className="stats">
      <div>
        <div>Deck name:</div>
        <div>{props.data.name}</div>
      </div>
      <div>
        <div># of cards:</div>
        <div>{props.data.cards.length}</div>
      </div>
      <div>
        <div>Last practiced:</div>
        <div>{formatTimestamp(props.data.last_practiced)}</div>
      </div>
      <div>
        <div>Last edited:</div>
        <div>{formatTimestamp(props.data.last_edited)}</div>
      </div>
      <div>
        <div>Time created:</div>
        <div>{formatTimestamp(props.data.created)}</div>
      </div>
    </div>
  ) 
}

export default View
