import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function About() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">About AquaGas</h1>
        <p>
          AquaGas Delivery provides fast and reliable LPG cylinder delivery in Nairobi.
        </p>
      </main>
      <Footer />
    </>
  );
}