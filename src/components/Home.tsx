import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { auth, db } from '../App';
import curatedList from '../ts/curated';

import { useAuthState } from 'react-firebase-hooks/auth'

// Types
import { DeckSchema, CuratedCard, HistType } from '../ts/interfaces';

function Home() {
  const [user] = useAuthState(auth)
  const history: HistType = useHistory()
  return (
    <div className="home-body">
      <Decks history={history} user={user} />
      <New history={history} user={user} />
      <Curated history={history} />
    </div>
  )
}

function Decks(props: {history: HistType, user: any}) {
  const [decks, setDecks] = useState<DeckSchema[]>([])
  const [empty, setEmpty] = useState<boolean>(false)

  const viewDeck = (id: string | undefined) => {
    setTimeout(() => props.history.push(`/duo-cards/view/${id ? id : ""}`), 100)
  }

  const fetchDecks = async () => {
    if (!props.user) {
      setEmpty(false)
      return
    }

    const userDecks = db.collection('decks').where("creator_uid", "==", `${props.user.uid}`)
    const decks = await userDecks.orderBy("created", "desc").get()
    const data: DeckSchema[] = []

    decks.forEach(doc => {
      const d = doc.data() as DeckSchema
      d.docID = doc.ref.id
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

  const decklist = decks.map((d: DeckSchema) => {
    return (
      <div 
        key={d.docID} 
        className="deck-preview"
        onClick={() => {viewDeck(d.docID)}}
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

function New(props: {history: HistType, user: any}) {
  const newDeck = () => {
    setTimeout(() => props.history.push('/duo-cards/create'), 100)
  }

  return (
    <div className="action-nav">
      <button
        className={props.user ? "new-deck" : "new-deck disabled"}
        onClick={props.user ? newDeck : () => {}}>New Deck</button>
    </div>
  )
}

function Curated(props: {history: HistType}) {
  const curatedDeck = (c: CuratedCard) => {
    setTimeout(() => props.history.push({
      pathname: "/duo-cards/create",
      state: { name: c.name, curateParameters: c.parameters, numCards: c.num }
    }), 100)
  }
  
  return (
    <div className="curated">
      <div className="text">Curated</div>
      <div className="curated-previews">
        {curatedList.map((curated: CuratedCard, index: number) =>
            <div
              key={index}
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
