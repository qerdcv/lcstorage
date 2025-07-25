import { Trash2 } from 'lucide-react';
import { Link } from 'react-router';

function stringToColor(str: string) {
  const hue = [...str].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  return `hsl(${hue}, 70%, 80%)`; // soft pastel
}

interface CardProps {
  id: number;
  name: string;
  onDelete: (id: number) => void;
}

export default function Card({ id, name, onDelete }: CardProps) {
  const bgColor = stringToColor(name);
  return (
    <div
      className="relative rounded-xl overflow-hidden shadow-md transition hover:shadow-lg"
      style={{ backgroundColor: bgColor, height: '150px' }}
    >
      <Link to={`/cards/${id}`} className="block w-full h-full px-4 py-3">
        <h2 className="text-xl font-semibold text-gray-800 truncate">{name}</h2>
      </Link>

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDelete(id);
        }}
        className="absolute bottom-2 right-2 p-1 rounded-full hover:bg-white/30 transition"
      >
        <Trash2 size={18} className="text-gray-700" />
      </button>
    </div>
  );
}