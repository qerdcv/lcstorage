import React from 'react';
import { Link } from 'react-router';
import db from '@/db';
import type { Card } from '@models/card';


function HomePage() {
  const [cards, setCards] = React.useState<Card[]>([]);
  const handleDelete = async (id: number) => {
    await db.deleteCard(id);
    setCards(cards.filter(card => card.id !== id));
  };

  React.useEffect(() => {
    const fetchCards = async () => {
      setCards(await db.getCards());
    };
    fetchCards();
  }, []);

  return (
    <>
      {cards.length > 0 ? (
        <ul>
          {cards.map(card => (
            <li>
              <Link to={`/cards/${card.id}`} key={card.id}>
                <strong>{card.name}</strong>&nbsp;
              </Link>
              <button onClick={() => handleDelete(card.id)}>Delete</button>
            </li>

          ))}
        </ul>
      ) : (
        <p>No cards available. Please add some.</p>
      )}
      <Link to='/add'>Add Card</Link >
    </>
  )
}

export default HomePage;