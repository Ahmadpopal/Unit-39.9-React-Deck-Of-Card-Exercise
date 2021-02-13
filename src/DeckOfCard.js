import React, { useState, useEffect, useRef} from 'react';
import axios from 'axios'
import Card from './Card'
import './DeckOfCard.css'


const BASE_URL = `http://deckofcardsapi.com/api/deck`

const DeckOfCard = () => {

const [cardDeck, setCardDeck] = useState(null)
const [drawn, setDrawn] = useState([]);
const [autoDraw, setAutoDraw] = useState(false)
const timerRef = useRef(null);




useEffect(()=> {
    async function getDeck(){
        let deck = await axios.get("http://deckofcardsapi.com/api/deck/new/shuffle/")
        setCardDeck(deck.data)

    } 
    getDeck()
}, [setCardDeck])

useEffect(() => {
    async function getCard(){
        let { deck_id } = cardDeck;

        try{
            let drawCard = await axios.get(`${BASE_URL}/${deck_id}/draw/`)
            console.log(drawCard)
            if(drawCard.data.remaining === 0) {
                setAutoDraw(false);
                throw new Error('No Cards remaining!')
            }

            const card = drawCard.data.cards[0];

            setDrawn( d => [
                ...d,
                {
                    id: card.code,
                    name: card.suit + " " + card.value,
                    image: card.image
                }
            ]);
        }
        catch(e){
            alert(e)
        } 
    }

    if(autoDraw && !timerRef.current){
        timerRef.current = setInterval(async () => {
            await getCard()
        }, 1000)
    }

    return () => {
        clearInterval(timerRef.current);
        timerRef.current = null;
    };
}, [autoDraw, setAutoDraw, cardDeck]);


const toggleAutoDraw = () => {
    setAutoDraw(auto => !auto);
  };

const cards = drawn.map(c => (
    <Card key={c.id} name={c.name} image={c.image} />
))


    return (
        <div className="Deck">
      {cardDeck ? (
        <button className="Deck-gimme" onClick={toggleAutoDraw}>
          {autoDraw ? "STOP" : "KEEP"} DRAWING FOR ME!
        </button>
      ) : null}
      <div className="Deck-cardarea">{cards}</div>
    </div>
    )
}

export default DeckOfCard



