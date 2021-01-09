import { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { auth, db } from '../App';
import curatedList from '../ts/curated';

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
  const [decks, setDecks] = useState<any[]>([])
  const history = useHistory()

  const viewDeck = (id: string) => {
    setTimeout(() => history.push(`/view/${id}`), 100)
  }

  const fetchDecks = async () => {
    if (!props.user) {
      return
    }

    const userDecks = db.collection('decks').where("creator_uid", "==", `${props.user.uid}`)
    const decks = await userDecks.orderBy("created", "desc").get()
    const data: any[] = []
    decks.forEach(doc => {
      const d = doc.data()
      d.id = doc.ref.id
      data.push(d)
    })
    setDecks(data)
  }

  useEffect(() => {
    fetchDecks()
  }, [props.user])

  const decklist = decks.map((d: any) => {
    return (
      <div 
        key={d.id} 
        className="deck-preview"
        onClick={() => {viewDeck(d.id)}}
      >
          <div>{d.name}</div>
      </div>
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
  return (
    <div className="curated">
      {curatedList.map(curated =>
      <Link style={{color: "#ECEFF4", textDecoration: 'none'}}
        to={{ pathname: "/create",
              state: {
                curateParameters: curated.parameters, numCards: curated.num
              }
          }}
      >
        <div>{curated.name}</div>
      </Link>
      )
      }
    </div>
  )
}

export default Home
