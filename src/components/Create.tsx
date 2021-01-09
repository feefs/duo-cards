import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SlideEditor from './SlideEditor';

function Create() {
  const [deckName, setDeckName] = useState("")
  const [cardlist, setCardlist] = useState([])
  const [, setLastFetched] = useState(0)
  const [ID, setID] = useState(0)

  const fetchCards = async (parameters: any, numCards: any) => {
    let cards = []

    if (parameters) {  
      const words = await fetch("http://127.0.0.1:5000/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: parameters
        }).then(response => response.json())
      
      setLastFetched(words.shift()['last_fetched'])

      const shuffled = words.sort(() => 0.5 - Math.random()).slice(0, Math.min(words.length, numCards))
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
  let numCards: any = null
  if (data.state) {
    params = data.state.curateParameters
    numCards = data.state.numCards
  }

  useEffect(() => {
    fetchCards(params, numCards)
  }, [])

  return (
    <div className="create-body">
      <SlideEditor
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
