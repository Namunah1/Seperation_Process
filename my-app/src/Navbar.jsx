import { Link, useLocation } from 'react-router-dom';
import './Navbar.css'; // Import the custom CSS

const navLinks = [
  { path: '/', label: 'Fractional Distillation' },
  { path: '/langmuir', label: 'Zeolite' },
  { path: '/about', label: ' Membrane' },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <h1 className="navbar-title">My Simulator Portal</h1>
      <div className="navbar-links">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`navbar-link ${location.pathname === link.path ? 'active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
