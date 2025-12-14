import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function HowItWorks() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">How It Works</h1>
        <p>Order LPG cylinders online and have them delivered quickly to your location.</p>
      </main>
      <Footer />
    </>
  );
}