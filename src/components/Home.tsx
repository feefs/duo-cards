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

  useEffect(() => {
    async function fetchDecks() {
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

    fetchDecks()
  }, [props.user])
  
  const viewDeck = (id: string | undefined) => {
    setTimeout(() => props.history.push(`/duo-cards/view/${id ? id : ""}`), 100)
  }

  const decklist = decks.map((d: DeckSchema) => {
    return (
      <div key={d.docID} className="deck-preview" onClick={() => {viewDeck(d.docID)}}>
        <div className="deck-preview-text">
          {d.name}
        </div>
        <div className="gradient"></div>
      </div>
    )
  })

  return (
    <div className="decks">
      {props.user ? decklist : <div className="text">User not signed in. Decks not available.</div>}
      {empty ? <div className="text">No decks. Make one!</div> : null}
    </div>
  )
}

function New(props: {history: HistType, user: any}) {
  const newDeck = () => {
    setTimeout(() => props.history.push('/duo-cards/create'), 100)
  }

  return (
    <div className="new-action">
      <button
        className={props.user ? "new-deck" : "new-deck disabled"}
        onClick={props.user ? newDeck : () => {}}>New Deck</button>
    </div>
  )
}

function Curated(props: {history: HistType}) {
  const [curatedCards, setCuratedCards] = useState<CuratedCard[]>([])

  useEffect(() => {
    async function fetchCurated() {
      //Fisher-Yates
      for (let i = curatedList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i)
        const temp = curatedList[i]
        curatedList[i] = curatedList[j]
        curatedList[j] = temp
      }
  
      setCuratedCards(curatedList)
    }

    fetchCurated()
  }, [])

  const curatedDeck = (c: CuratedCard) => {
    setTimeout(() => props.history.push({
      pathname: "/duo-cards/create",
      state: { name: c.name, curateParameters: c.parameters, numCards: c.num }
    }), 100)
  }

  const curatedDeckList = curatedCards.map((curated: CuratedCard, index: number) => {
    return (
      <div className="curated-preview">
        <div key={index} className="curated-preview-text" onClick={() => {curatedDeck(curated)}}>
          {curated.name}
        </div>
      </div>
    )
  })
  
  return (
    <div className="curated">
      <div className="text">Curated</div>
        {curatedDeckList}
    </div>
  )
}

export default Home
