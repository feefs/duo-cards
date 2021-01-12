import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { auth, db } from '../App';

import { useAuthState } from 'react-firebase-hooks/auth'
import firebase from 'firebase/app'

// Types
import {
  CardSchema,
  DeckSchema,
  PracticeSlidesProps,
  PracticeCardProps,
  MatchProps,
  HistType
} from '../ts/interfaces';

function Practice(match: MatchProps) {
  const[user] = useAuthState(auth);

  const [deckName, setDeckName] = useState<string>("")
  const [cardlist, setCardlist] = useState<CardSchema[]>([])

  const deckID = match.match.params.id
  
  const fetchCards = async () => {
    if (!user) {
        return
    }

    const deck = db.collection('decks').doc(deckID)
    await deck.update({
      last_practiced: firebase.firestore.Timestamp.now()
    })

    const doc = await deck.get()
    const d = doc.data() as DeckSchema

    if (!d || !user || d.creator_uid !== user.uid) {
      return
    }

    const cards: CardSchema[] = d.cards
    for (let i = 0; i < cards.length; i++) {
      cards[i].flipped = false;
    }

    //Fisher-Yates
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i)
      const temp = cards[i]
      cards[i] = cards[j]
      cards[j] = temp
    }

    setDeckName(d.name)
    setCardlist(d.cards)
  }

  useEffect(() => {
      fetchCards()
  }, [user])

  return (
    <div className="practice-body">
      <PracticeSlides
        deckName={deckName}
        cards={cardlist}
        setCards={setCardlist}
        deckID={deckID}/>
    </div>
  )
}

function PracticeSlides(props: PracticeSlidesProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [jaFocus, setJaFocus] = useState<boolean>(true)
  const history: HistType = useHistory()

  if (props.cards.length === 0) {
    return <div>Loading...</div>
  }

  const prev = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1) }
  const next = () => { if (currentIndex < props.cards.length - 1) setCurrentIndex(currentIndex + 1) }

  const deepCopy = () => {
    return props.cards.map((c: CardSchema) => JSON.parse(JSON.stringify(c)))
  }

  const flip = (index: number) => {
    const dc = deepCopy()
    dc[index]['flipped'] = !dc[index]['flipped']
    props.setCards(dc)
  }
  
  const viewDeck = (id: string) => {
    setTimeout(() => history.push(`/duo-cards/view/${id}`), 100)
  }

  const toggleLanguage = () => {
    const dc = deepCopy()
    for (let i = 0; i < dc.length; i++) {
      dc[i]['flipped'] = false
    }
    setJaFocus(!jaFocus)
    props.setCards(dc)
  }

  const editDeck = (id: string) => {
    setTimeout(() => history.push(`/duo-cards/edit/${id}`), 100)
  }

  const slides = props.cards.map((c: CardSchema, index: number) => {
    return (
      <div 
        key={c['id']}
        className={index === currentIndex ? "slide active" : "slide"}
        style={{transform: `translateX(${((currentIndex - index) * -10) + 20}vmin)`}}
        onClick={() => {flip(index)}}
      >
        <PracticeCard cardData={c} jaFocus={jaFocus} />
      </div>
    )
    }
  )

  return (
    <div className="editor">
      <button className="nav-button previous" onClick={prev}>Left</button>
      <button className="nav-button next" onClick={next}>Right</button>
      <div className="name">{props.deckName}</div>
      <div className="slider">
        {slides}
      </div>
      <button className="view-deck" onClick={() => {viewDeck(props.deckID)}}>View Deck</button>
      <button className="edit-deck" onClick={() => {editDeck(props.deckID)}}>Edit Deck</button>
      <button className="toggle-language" onClick={toggleLanguage}>Toggle Language</button>
      <button className="edit-deck" onClick={() => {editDeck(props.deckID)}}>Edit Deck</button>
    </div>
  )
}

function PracticeCard(props: PracticeCardProps) {
  return (
    <div className="card">
      <div></div>
      <div>{props.jaFocus ? (props.cardData.flipped ? props.cardData.en : props.cardData.ja) :
                            (props.cardData.flipped ? props.cardData.ja : props.cardData.en)}
      </div>
      {props.cardData.flipped ? <div>{props.cardData.pronunciation}</div> : null}
      {props.cardData.flipped ? <div>{props.cardData.pos}</div> : null}
      <div></div>
      <div className="gradient"></div>
    </div>
  )
}

export default Practice
