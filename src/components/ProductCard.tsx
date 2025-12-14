// src/components/ProductCard.tsx
interface ProductCardProps {
  name: string;
  price: number;
  image: string;
}

export default function ProductCard({ name, price, image }: ProductCardProps) {
  return (
    <div className="min-w-[200px] bg-white rounded-lg shadow p-2 flex-shrink-0">
      <img src={image} alt={name} className="w-full h-32 object-cover rounded" />
      <h3 className="mt-2 font-semibold">{name}</h3>
      <p className="text-blue-600 font-bold">KES {price}</p>
    </div>
  );
}