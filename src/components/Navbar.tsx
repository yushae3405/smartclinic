import { motion } from 'framer-motion';
import { Menu, X, Stethoscope } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: "100%" }
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Stethoscope className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">SmartClinic</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/services">Services</NavLink>
            <NavLink to="/doctors">Doctors</NavLink>
            <NavLink to="/appointments">Appointments</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        animate={isOpen ? "open" : "closed"}
        variants={menuVariants}
        className="md:hidden"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <MobileNavLink to="/" onClick={() => setIsOpen(false)}>Home</MobileNavLink>
          <MobileNavLink to="/services" onClick={() => setIsOpen(false)}>Services</MobileNavLink>
          <MobileNavLink to="/doctors" onClick={() => setIsOpen(false)}>Doctors</MobileNavLink>
          <MobileNavLink to="/appointments" onClick={() => setIsOpen(false)}>Appointments</MobileNavLink>
          <MobileNavLink to="/contact" onClick={() => setIsOpen(false)}>Contact</MobileNavLink>
        </div>
      </motion.div>
    </nav>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ to, children, onClick }: { to: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
    >
      {children}
    </Link>
  );
}