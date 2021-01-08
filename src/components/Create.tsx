import { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { auth, db } from '../App';

import { useAuthState } from 'react-firebase-hooks/auth'
import firebase from 'firebase/app'

function Create() {
  const [cardlist, setCardlist] = useState([])
  const [, setLastFetched] = useState(0)
  const [ID, setID] = useState(0)
  const [DBRef, setDBRef] = useState("")

  const fetchCards = async (parameters: [string, number] | null, load: [[], string] | null) => {
    let cards = []

    if (load) {
      cards = load[0]
      setID(cards.length)
      setDBRef(load[1])
      setCardlist(cards)
      return
    }

    if (parameters) {
      const queryParams = parameters[0]
      const numWords = parameters[1]
  
      const words = await fetch("http://127.0.0.1:5000/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: queryParams
        }).then(response => response.json())
      
      setLastFetched(words.shift()['last_fetched'])

      const shuffled = words.sort(() => 0.5 - Math.random()).slice(0, Math.min(words.length, numWords))
      const translateWords = shuffled.map((word: any) => word['word_string'] )
      const translateParams = JSON.stringify({ word_list: translateWords })
  
      cards = await fetch("http://127.0.0.1:5000/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: translateParams
        }).then(response => response.json())
      
      for (let i = 0; i < shuffled.length; i++) {
        cards[i]['metadata'] = shuffled[i]
        cards[i].id = i
      }

      setID(shuffled.length)
    }

    if (cards.length === 0) {
      cards.push({ja: "", pronunciation: "", en: "", pos: "", defs: [], metadata: {}, id: 0})
      setID(1)
    }

    setCardlist(cards)
  }

  const data: any = useLocation()
  let params: any = null
  let load: any = null
  if (data.state) {
    params = data.state.curateParameters
    load = data.state.loadCards
  }

  useEffect(() => {
    fetchCards(params, load)
  }, [])

  return (
    <div className="create-body">
      <SlideEditor cards={cardlist} setCards={setCardlist} ID={ID} setID={setID} dbRef={DBRef}/>
    </div>
  )
}

function SlideEditor(props: {cards: any, setCards: any, ID: number, setID: any, dbRef: string | null}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [deckName, setDeckName] = useState("")
  const [user] = useAuthState(auth)
  const history = useHistory()

  if (props.cards.length === 0) {
    return <div>Loading...</div>
  }

  const prev = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1) }
  const next = () => { if (currentIndex < props.cards.length - 1) setCurrentIndex(currentIndex + 1) }

  const deepCopy = () => {
    return props.cards.map((c: any) => JSON.parse(JSON.stringify(c)))
  }

  const updateCard = (index: number, field: string, value: string) => {
    const dc = deepCopy()
    dc[index][field] = value
    props.setCards(dc)
  }

  const newCard = () => {
    const dc = deepCopy()
    dc.splice(currentIndex + 1, 0, {})
    props.setCards(dc)
    setTimeout(() => setCurrentIndex(currentIndex + 1), 100)
  }

  const deleteCard = () => {
    if (props.cards.length > 1) {
      const dc = deepCopy()
      dc.splice(currentIndex, 1)
      props.setCards(dc)
      if (currentIndex === dc.length) {
        setTimeout(() => setCurrentIndex(currentIndex - 1), 100)
      }
    }
  }

  const wipe = () => {
    const dc = deepCopy()
    const dcc = dc[currentIndex]
    dcc.ja = ""
    dcc.pronunciation = ""
    dcc.en = ""
    dcc.pos = ""
    props.setCards(dc)
  }

  const submitDeck = async () => {
    if (!user) { return }

    if (props.dbRef) {
      await db.collection('decks').doc(props.dbRef).update({
        name: deckName,
        cards: deepCopy()
      })
      console.log('Updated deck with ID: ', props.dbRef)
    } else {
      const time = firebase.firestore.Timestamp.now()
      const res = await db.collection('decks').add({
        creator_uid: user.uid,
        created: time,
        name: deckName,
        cards: deepCopy()
      })

      const userSnapshot = db.collection('users').doc(`${user.uid}`)
      const userData = await userSnapshot.get()
      userSnapshot.update({ decks: userData.get('decks').concat({
        name: deckName,
        deckID: res.id
      }) })

      console.log('New deck constructed with ID: ', res.id)
    }
    history.push('/')
  }

  const slides = props.cards.map((c: any, index: number) => {
    if (!c.hasOwnProperty('id')) {
      c['id'] = props.ID
      props.setID(props.ID + 1)
    }
    return (
      <div key={c['id']} className={index === currentIndex ? "slide active" : "slide"}
           style={{transform: `translateX(${((currentIndex - index) * -10) + 20}vmin)`}}>
        <Card data={c} 
          setJa={(v: string) => updateCard(index, 'ja', v)}
          setPronunciation={(v: string) => updateCard(index, 'pronunciation', v)}
          setEn={(v: string) => updateCard(index, 'en', v)}
          setPos={(v: string) => updateCard(index, 'pos', v)}
          />
      </div>
    )
    }
  )

  return (
    <div className="editor">
      <button className="nav-button previous" onClick={prev}>Left</button>
      <button className="nav-button next" onClick={next}>Right</button>
      <input className="name" value={deckName} placeholder="deck name" onChange={e => setDeckName(e.target.value)} />
      <div className="slider">
        {slides}
      </div>
      <button className="new-card" onClick={newCard}>+</button>
      <button className="delete-card" onClick={deleteCard}>x</button>
      <button className="wipe" onClick={wipe}>-</button>
      <button className="submit-deck" onClick={submitDeck}>✓</button>

    </div>
  )
}

function Card(props: {data: any, setJa: any, setPronunciation: any, setEn: any, setPos: any}) {
  return (
    <div className="card">
      <div></div>
      <input value={props.data.ja} placeholder="ja" onChange={e => props.setJa(e.target.value)} />
      <input value={props.data.pronunciation} placeholder="romanji" onChange={e => props.setPronunciation(e.target.value)} />
      <input value={props.data.en} placeholder="en" onChange={e => props.setEn(e.target.value)} />
      <input value={props.data.pos} placeholder="grammar" onChange={e => props.setPos(e.target.value)} />
      <div></div>
    </div>
  )
}

export default Create
