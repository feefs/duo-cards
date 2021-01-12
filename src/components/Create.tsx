import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { auth } from '../App';
import SlideEditor from './SlideEditor';

import { useAuthState } from 'react-firebase-hooks/auth'

// Types
import { CardSchema, LocType } from '../ts/interfaces';

function Create() {
  const[user] = useAuthState(auth);
  const [deckName, setDeckName] = useState<string>("")
  const [cardlist, setCardlist] = useState<CardSchema[]>([])
  const [ID, setID] = useState<number>(0)

  const fetchCards = async (parameters: string, numCards: number, name: string) => {
    let cards: CardSchema[] = []

    if (parameters) {  
      const words = await fetch("http://127.0.0.1:5000/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: parameters
        }).then(response => response.json())
      
      words.shift()

      //Fisher-Yates
      for (let i = words.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i)
        const temp = words[i]
        words[i] = words[j]
        words[j] = temp
      }

      const shuffled = words.slice(0, Math.min(words.length, numCards))
      const translateWords = shuffled.map((word: { [x: string]: string; }) => word['word_string'] )
      const translateParams = JSON.stringify({ word_list: translateWords })
  
      cards = await fetch("http://127.0.0.1:5000/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: translateParams
        }).then(response => response.json())
      
      for (let i = 0; i < shuffled.length; i++) {
        cards[i].id = i
      }

      setDeckName(name)
      setID(shuffled.length)
    }

    if (cards.length === 0) {
      cards.push({ja: "", pronunciation: "", en: "", pos: "", id: 0})
      setID(1)
    }

    setCardlist(cards)
  }

  const data: LocType = useLocation()
  let name: string
  let params: string
  let numCards: number
  if (data.state) {
    name = data.state.name
    params = data.state.curateParameters
    numCards = data.state.numCards
  }

  useEffect(() => {
    fetchCards(params, numCards, name)
  }, [])

  return (
    <div className="create-body">
      <SlideEditor
        user={user}
        deckName={deckName}
        setDeckName={setDeckName}
        cards={cardlist}
        setCards={setCardlist}
        ID={ID}
        setID={setID}
      />
    </div>
  )
}

export default Create
