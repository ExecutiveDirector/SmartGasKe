import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo / Brand */}
        <Link href="/" className="font-bold text-xl cursor-pointer hover:text-white/90 transition">
          <span className="text-aqua-400">Aqua</span>as
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-6">
          <Link href="/" className="hover:text-white/80 transition">
            Home
          </Link>
          <Link href="/about" className="hover:text-white/80 transition">
            About
          </Link>
          <Link href="/founder" className="hover:text-white/80 transition">
            Founder
          </Link>
          <Link href="/how-it-works" className="hover:text-white/80 transition">
            How It Works
          </Link>
          <Link href="/technology" className="hover:text-white/80 transition">
            Technology
          </Link>
          <Link href="/investors" className="hover:text-white/80 transition">
            Investors
          </Link>
          <Link href="/partners" className="hover:text-white/80 transition">
            Partners
          </Link>
          <Link href="/contact" className="hover:text-white/80 transition">
            Contact
          </Link>
          <Link href="/shop" className="hover:text-white/80 transition">
            Shop
          </Link>
        </div>
      </div>
    </nav>
  );
}