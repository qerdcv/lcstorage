import React from 'react';
import { Link } from 'react-router';
import db from '@/db';
import type { ICard } from '@models/card';
import Card from '@components/Card';
import { Plus } from 'lucide-react';

export default function HomePage() {
  const [cards, setCards] = React.useState<ICard[]>([]);
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
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {cards.map((card) => (
              <Card
                key={card.id}
                id={card.id}
                name={card.name}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      ) : (
        <p>No cards available</p>
      )}
      <Link
        to="/add"
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition"
        aria-label="Add new card"
      >
        <Plus size={24} />
      </Link>
    </>
  )
}
