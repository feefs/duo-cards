import { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { auth, db } from '../App';

import { useAuthState } from 'react-firebase-hooks/auth'

function Home() {
  const [user] = useAuthState(auth)

  return (
    <div className="home-body">
      <Decks user={user} />
      <ActionNav />
      <Curated />
    </div>
  )
}

function Decks(props: {user: any}) {
  const [decks, setDecks] = useState([])

  const fetchDecks = async () => {
    if (!props.user) {
      return
    }
    const userDecks = db.collection('users').doc(props.user.uid)
    const doc = await userDecks.get()
    const data = doc.data()
    if (!data) {
      return
    }
    data.decks.reverse()
    setDecks(data.decks)
  }

  useEffect(() => {
    fetchDecks()
  }, [props.user])


  const decklist = decks.map((d: any, index: number) => {
    return (
      <Link key={d.deckID} className="deck-preview" 
            style={{ color: "#ECEFF4", textDecoration: 'none' }}
            to={`/view/${d.deckID}`}>
        <div>{d.name}</div>
      </Link>
    )
  })

  return <div className="decks">{props.user ? decklist : "User not signed in; decks not available"}</div>
}

function ActionNav() {
  const history = useHistory()
  const newDeck = () => {
    setTimeout(() => history.push('/create'), 100)
  }

  return (
    <div className="action-nav">
      <button className="new-deck" onClick={newDeck}>New Deck</button>
    </div>
  )
}

function Curated() {
  const param1 = [
    JSON.stringify({
      start: {"days": 0, "weeks": 1},
      end: {"days": 0, "weeks": 0},
      strength: [1, 4]
    }),
    10
  ]
  return (
    <div className="curated">
      <Link style={{color: "#ECEFF4", textDecoration: 'none'}}
            to={{pathname: "/create", state: {curateParameters: param1}}}>
        <div>Curated 1</div>
      </Link>
    </div>
  )
}

export default Home
