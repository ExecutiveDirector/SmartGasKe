import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="font-bold text-xl">
          AquaGas
        </Link>

        <div className="flex gap-6">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/founder">Founder</Link>
          <Link to="/how-it-works">How It Works</Link>
          <Link to="/technology">Technology</Link>
          <Link to="/investors">Investors</Link>
          <Link to="/partners">Partners</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/shop">Shop</Link>
        </div>
      </div>
    </nav>
  );
}