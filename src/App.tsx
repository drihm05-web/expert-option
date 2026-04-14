import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Marketplace } from './pages/Marketplace';
import { Dashboard } from './pages/Dashboard';
import { Admin } from './pages/Admin';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { Auctions } from './pages/Auctions';
import { Journey } from './pages/Journey';
import { Concierge } from './pages/Concierge';
import { Contact } from './pages/Contact';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/auctions" element={<Auctions />} />
            <Route path="/journey" element={<Journey />} />
            <Route path="/concierge" element={<Concierge />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/vehicles" element={<Marketplace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}
