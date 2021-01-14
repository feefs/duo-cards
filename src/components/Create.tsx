import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { auth } from '../App';
import SlideEditor from './SlideEditor';
import { CURATED_ENABLED } from '../ts/configs';

import { useAuthState } from 'react-firebase-hooks/auth'

// Types
import { CardSchema, LocType } from '../ts/interfaces';

function Create() {
  const[user] = useAuthState(auth);
  const [deckName, setDeckName] = useState<string>("")
  const [cardlist, setCardlist] = useState<CardSchema[]>([])
  const [cardID, setCardID] = useState<number>(0)
  const location: LocType = useLocation()

  useEffect(() => {
    async function fetchCards() {
      let cards: CardSchema[] = []
  
      if (location.state && CURATED_ENABLED) {  
        const name = location.state.name
        const parameters = location.state.curateParameters
        const numCards = location.state.numCards

        const words = await fetch("http://127.0.0.1:5000/query", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: parameters
          }).then(response => response.json())

        words.shift()

        const shuffled = words.slice(0, Math.min(words.length, numCards))

        //Fisher-Yates
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * i)
          const temp = shuffled[i]
          shuffled[i] = shuffled[j]
          shuffled[j] = temp
        }

        const translateWords = shuffled.map((word: { [x: string]: string; }) => word['word_string'] )
        const translateParams = JSON.stringify({ word_list: translateWords })
    
        cards = await fetch("http://127.0.0.1:5000/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: translateParams
          }).then(response => response.json())
        
        for (let i = 0; i < shuffled.length; i++) {
          cards[i].metadata = shuffled[i]
          cards[i].id = i
        }
  
        setDeckName(name)
        setCardID(shuffled.length)
      }
  
      if (cards.length === 0) {
        cards.push({ja: "", pronunciation: "", en: "", pos: "", id: 0})
        setCardID(1)
      }
  
      setCardlist(cards)
    }

    fetchCards()
  }, [location.state])

  return (
    <div className="create-edit-body">
      <SlideEditor
        user={user}
        deckName={deckName}
        setDeckName={setDeckName}
        cardlist={cardlist}
        setCardlist={setCardlist}
        cardID={cardID}
        setCardID={setCardID}
      />
    </div>
  )
}

export default Create
