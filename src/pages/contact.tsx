import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Contact() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
        <p>Email: info@aquagas.co.ke</p>
        <p>Phone: +254 710 820666</p>
        <p>Address: Nairobi, Kenya</p>
      </main>
      <Footer />
    </>
  );
}