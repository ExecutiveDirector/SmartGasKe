import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Investors() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Investors</h1>
        <p>We welcome investors to join us in revolutionizing LPG delivery in Kenya.</p>
      </main>
      <Footer />
    </>
  );
}