import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { auth, db } from '../App';

import { useAuthState } from 'react-firebase-hooks/auth'
import firebase from 'firebase/app'

function Practice(match: any) {
  const[user] = useAuthState(auth);
  const [data, setData] = useState({
    cards: [],
    created: null,
    last_edited: null,
    last_practiced: null,
    creator_uid: "",
    name: ""
  })

  const [deckName, setDeckName] = useState("")
  const [cardlist, setCardlist] = useState([])
  const [flipped, setFlipped] = useState(false)
  
  const fetchCards = async () => {
    if (!user) {
        return
    }
    const deck = db.collection('decks').doc(match.match.params.id)
    await deck.update({
      last_practiced: firebase.firestore.Timestamp.now()
    })
    const doc = await deck.get()
    const d = doc.data() as any
    if (!d) {
        return
    }
    const cards: any[] = d.cards
    for (let i = 0; i < cards.length; i++) {
      cards[i].flipped = false;
    }
    //setData(d)
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
        setCards={setCardlist}
        cards={cardlist}
        flipped={flipped}
        setFlipped={setFlipped}
        dbRef={match.match.params.id}/>
    </div>
  )
}

function PracticeSlides(props: any) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [jaFocus, setJaFocus] = useState(true)
  const history = useHistory()

  if (props.cards.length === 0) {
    return <div>Loading...</div>
  }

  const prev = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1) }
  const next = () => { if (currentIndex < props.cards.length - 1) setCurrentIndex(currentIndex + 1) }

  const deepCopy = () => {
    return props.cards.map((c: any) => JSON.parse(JSON.stringify(c)))
  }

  const flip = (index: number) => {
    const dc = deepCopy()
    dc[index]['flipped'] = !dc[index]['flipped']
    props.setCards(dc)
  }
  
  const viewDeck = (id: string) => {
    setTimeout(() => history.push(`/view/${id}`), 100)
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
    setTimeout(() => history.push(`/edit/${id}`), 100)
  }

  const slides = props.cards.map((c: any, index: number) => {
    return (
      <div 
        key={c['id']}
        className={index === currentIndex ? "slide active" : "slide"}
        style={{transform: `translateX(${((currentIndex - index) * -10) + 20}vmin)`}}
        onClick={() => {flip(index)}}
      >
        <PracticeCard data={c} jaFocus={jaFocus} />
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
      <button className="view-deck" onClick={() => {viewDeck(props.dbRef)}}>View Deck</button>
      <button className="edit-deck" onClick={() => {editDeck(props.dbRef)}}>Edit Deck</button>
      <button className="toggle-language" onClick={toggleLanguage}>Toggle Language</button>
      <button className="edit-deck" onClick={() => {editDeck(props.dbRef)}}>Edit Deck</button>
    </div>
  )
}

function PracticeCard(props: {data: any, jaFocus: boolean}) {

  return (
    <div className="card">
      <div></div>
      <div>{props.jaFocus ? (props.data.flipped ? props.data.en : props.data.ja) :
                            (props.data.flipped ? props.data.ja : props.data.en)}
      </div>
      {props.data.flipped ? <div>{props.data.pronunciation}</div> : null}
      {props.data.flipped ? <div>{props.data.pos}</div> : null}
      <div></div>
    </div>
  )
}

export default Practice
