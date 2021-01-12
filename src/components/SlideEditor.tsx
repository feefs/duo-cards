import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { db } from '../App';

import firebase from 'firebase/app'

// Types
import { CardSchema, SlideEditorProps, CardProps, HistType } from '../ts/interfaces';

function SlideEditor(props: SlideEditorProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [deleted, setDeleted] = useState<boolean>(false)
  const history: HistType = useHistory()

  if (props.cardlist.length === 0) {
    return <div>Loading...</div>
  }

  const prev = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1) }
  const next = () => { if (currentIndex < props.cardlist.length - 1) setCurrentIndex(currentIndex + 1) }

  const deepCopy = () => {
    return props.cardlist.map((c: CardSchema) => JSON.parse(JSON.stringify(c)))
  }

  const updateCard = (index: number, field: string, value: string) => {
    const dc = deepCopy()
    dc[index][field] = value
    props.setCardlist(dc)
  }

  const newCard = () => {
    const dc = deepCopy()
    dc.splice(currentIndex + 1, 0, {})
    props.setCardlist(dc)
    setTimeout(() => setCurrentIndex(currentIndex + 1), 100)
  }

  const deleteCard = () => {
    if (props.cardlist.length > 1) {
      const dc = deepCopy()
      dc.splice(currentIndex, 1)
      props.setCardlist(dc)
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
    props.setCardlist(dc)
  }

  const submitDeck = async () => {
    if (submitted) { return }

    setSubmitted(true)

    if (props.deckID) {
      await db.collection('decks').doc(props.deckID).update({
        name: props.deckName,
        cards: deepCopy(),
        last_edited: firebase.firestore.Timestamp.now()
      })
    } else {
      await db.collection('decks').add({
        creator_uid: props.user.uid,
        name: props.deckName,
        cards: deepCopy(),
        created: firebase.firestore.Timestamp.now(),
      })
    }

    if (props.deckID) {
      history.goBack()
    } else {
      history.push('/duo-cards')
    }
  }

  const deleteDeck = async () => {
    if (deleted) { return }

    setDeleted(true)

    await db.collection('decks').doc(props.deckID).delete()
    history.push('/duo-cards')
  }

  const slides = props.cardlist.map((c: CardSchema, index: number) => {
      if (!c.hasOwnProperty('id')) {
        c['id'] = props.cardID
        props.setCardID(props.cardID + 1)
      }
      return (
        <div key={c['id']} className={index === currentIndex ? "slide active" : "slide"}
            style={{transform: `translateX(${((currentIndex - index) * -10) + 20}vmin)`}}>
          <Card cardData={c} 
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
      <input className="name" value={props.deckName} placeholder="deck name" onChange={e => props.setDeckName(e.target.value)} />
      <div className="slider">{slides}</div>
      <button className="nav-button previous" onClick={prev}>Left</button>
      <button className="nav-button next" onClick={next}>Right</button>
      <button className="new-card" onClick={newCard}>+</button>
      <button className="delete-card" onClick={deleteCard}>x</button>
      <button className="wipe-card" onClick={wipeCard}>🧹</button>
      <button
        className={props.user && !submitted && props.deckName ? "submit-deck" : "submit-deck disabled"}
        onClick={props.user && !submitted && props.deckName ? submitDeck : () => {}}
      >✓</button>
      {props.deckID ?
        <button
          className={props.user && !deleted ? "delete-deck" : "delete-deck disabled"}
          onClick={props.user && !deleted ? deleteDeck : () => {}}
        >Delete Deck</button>
        : null
      }
    </div>
  )
}

function Card(props: CardProps) {
  return (
    <div className="card">
      <div></div>
      <input value={props.cardData.ja} placeholder="ja" onChange={e => props.setJa(e.target.value)} />
      <input value={props.cardData.pronunciation} placeholder="romaji" onChange={e => props.setPronunciation(e.target.value)} />
      <input value={props.cardData.en} placeholder="en" onChange={e => props.setEn(e.target.value)} />
      <input value={props.cardData.pos} placeholder="grammar" onChange={e => props.setPos(e.target.value)} />
      <div></div>
    </div>
  )
}

export default SlideEditor
