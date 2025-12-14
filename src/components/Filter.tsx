// src/components/Filter.tsx
interface FilterProps {
  activeFilter: string;
  onFilter: (category: string) => void;
}

const categories = ['all', 'cylinders', 'accessories'];

export default function Filter({ activeFilter, onFilter }: FilterProps) {
  return (
    <div className="flex gap-2 mb-4">
      {categories.map(category => (
        <button
          key={category}
          onClick={() => onFilter(category)}
          className={`px-4 py-2 rounded ${
            activeFilter === category ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </button>
      ))}
    </div>
  );
}