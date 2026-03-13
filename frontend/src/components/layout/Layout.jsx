import Navbar from './Navbar';
import Footer from './Footer';
import Chatbot from '../Chatbot';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <Chatbot />
    </div>
  );
}
