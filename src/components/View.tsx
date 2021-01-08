import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../App';

import { useAuthState } from 'react-firebase-hooks/auth'

function View(match: any) {
    const[user] = useAuthState(auth);
    return (
    <div className="view-body">
        <Cards user={user} match={match} />
        <Actions />
        <Stats />
    </div>
    )
}

function Cards(props: any) {
  const [data, setData] = useState({
      cards: [],
      created: null,
      creator_uid: "",
      name: ""
  })

  const fetchCards = async () => {
      if (!props.user) {
          return
      }
      const deck = db.collection('decks').doc(props.match.match.params.id)
      const doc = await deck.get()
      const d = doc.data() as {cards: [], created: any, creator_uid: string, name: string}
      if (!d) {
          return
      }
      setData(d)
  }

  useEffect(() => {
      fetchCards()
  }, [props.user])

  const cardlist = data.cards.map((c: any, index: number) => {
      return (
        <Link key={c.id} className="card-preview" 
              style={{ color: "#ECEFF4", textDecoration: 'none' }}
              to={`/view/${c.deckID}`}>
          <div>
              <div></div>
              <div>{c.ja}</div>
              <div>{c.pronunciation}</div>
              <div>{c.en}</div>
              <div>{c.pos}</div>
              <div></div>
          </div>
        </Link>
      )
    })

  return <div className="cards">{props.user ? cardlist : "Loading"}</div>
}

function Actions() {
  return <div className="actions">Actions not complete yet.</div>
}

function Stats() {
  return <div className="stats">Stats not complete yet.</div>
}

export default View
