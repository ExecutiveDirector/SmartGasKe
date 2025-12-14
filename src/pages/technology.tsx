import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Technology() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Technology</h1>
        <p>We leverage a modern web and mobile platform to track orders and deliveries efficiently.</p>
      </main>
      <Footer />
    </>
  );
}