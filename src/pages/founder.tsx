import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Founder() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Founder</h1>
        <p>Peter Maina is the founder of AquaGas Delivery, aiming to simplify LPG delivery in Kenya.</p>
      </main>
      <Footer />
    </>
  );
}