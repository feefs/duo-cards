import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
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
  const [empty, setEmpty] = useState(false)
  const history = useHistory()

  const viewDeck = (id: string) => {
    setTimeout(() => history.push(`/duo-cards/view/${id}`), 100)
  }

  const fetchDecks = async () => {
    if (!props.user) {
      setEmpty(false)
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
    if (data.length === 0) {
      setEmpty(true)
    }
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

  return <div className="decks">
    {props.user ? decklist : <div className="text">User not signed in, decks not available.</div>}
    {empty ? <div className="text">No decks. Make one!</div> : null}
    </div>
}

function ActionNav() {
  const history = useHistory()
  const newDeck = () => {
    setTimeout(() => history.push('/duo-cards/create'), 100)
  }

  return (
    <div className="action-nav">
      <button className="new-deck" onClick={newDeck}>New Deck</button>
    </div>
  )
}

function Curated() {
  const history = useHistory()
  const curatedDeck = (c: any) => {
    setTimeout(() => history.push({
      pathname: "/duo-cards/create",
      state: { curateParameters: c.parameters, numCards: c.num }
    }), 100)
  }
  
  return (
    <div className="curated">
      <div className="text">Curated</div>
      <div className="curated-previews">
        {curatedList.map(curated =>
            <div
              className="curated-card"
              onClick={() => {curatedDeck(curated)}}>
              {curated.name}
            </div>
        )}
      </div>
    </div>
  )
}

export default Home
