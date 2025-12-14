// src/components/Navbar.tsx
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <span className="font-bold text-xl cursor-pointer">AquaGas</span>
        </Link>
        <div className="flex gap-6">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/founder">Founder</Link>
          <Link href="/how-it-works">How It Works</Link>
          <Link href="/technology">Technology</Link>
          <Link href="/investors">Investors</Link>
          <Link href="/partners">Partners</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/shop">Shop</Link>
        </div>
      </div>
    </nav>
  );
}