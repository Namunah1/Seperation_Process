import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Home from './Fracdis.jsx';
import LangmuirIsothermKgSimulator from './LangmuirIsothermKgSimulator.jsx';
import About from './Membrane.jsx'; // dummy About page

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/langmuir" element={<LangmuirIsothermKgSimulator />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}
