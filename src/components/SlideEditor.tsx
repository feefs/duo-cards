import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { auth, db } from '../App';

import { useAuthState } from 'react-firebase-hooks/auth'
import firebase from 'firebase/app'

function SlideEditor(props: any) {
  const [currentIndex, setCurrentIndex] = useState(0)
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

  const wipeCard = () => {
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

    const processedCards = deepCopy()
    processedCards.forEach((card: any) => {
      if (card.metadata) {
        delete card.metadata
      }
      if (card.defs) {
        delete card.defs
      }
    });

    const time = firebase.firestore.Timestamp.now()

    if (props.dbRef) {
      await db.collection('decks').doc(props.dbRef).update({
        name: props.deckName,
        cards: processedCards,
        last_edited: time
      })
    } else {
      const res = await db.collection('decks').add({
        creator_uid: user.uid,
        name: props.deckName,
        cards: processedCards,
        created: time,
      })

      const userSnapshot = db.collection('users').doc(`${user.uid}`)
      const userData = await userSnapshot.get()
      userSnapshot.update({
        decks: userData.get('decks').concat({ name: props.deckName, deckID: res.id })
      })
    }
    if (props.ret) {
      history.goBack()
    } else {
      history.push('/duo-cards')
    }
  }

  const deleteDeck = async () => {
    await db.collection('decks').doc(props.dbRef).delete()
    history.push('/duo-cards')
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
      <input className="name" value={props.deckName} placeholder="deck name" onChange={e => props.setDeckName(e.target.value)} />
      <div className="slider">
        {slides}
      </div>
      <button className="new-card" onClick={newCard}>+</button>
      <button className="delete-card" onClick={deleteCard}>x</button>
      <button className="wipe-card" onClick={wipeCard}>-</button>
      <button className="submit-deck" onClick={submitDeck}>✓</button>
      {props.dbRef ? <button className="delete-deck" onClick={deleteDeck}>Delete Deck</button> : null}
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

export default SlideEditor
