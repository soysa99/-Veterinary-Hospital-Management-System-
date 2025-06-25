import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCartIcon, UserCircleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useUser } from '../../context/UserContext';
import pawLogo from '../../assets/paw-logo.png';
import { getCartCount } from '../../utils/cartUtils';

function Navbar() {
    const [cartCount, setCartCount] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('');
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const profileRef = useRef(null);
    const { user, logout } = useUser();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Initial cart count
        setCartCount(getCartCount());

        // Listen for cart updates
        const handleCartUpdate = () => {
            setCartCount(getCartCount());
        };

        window.addEventListener('cartUpdate', handleCartUpdate);
        return () => {
            window.removeEventListener('cartUpdate', handleCartUpdate);
        };
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
        setProfileMenuOpen(false);
    }, [location]);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Log out handler
    const handleLogout = () => {
        logout();
        setProfileMenuOpen(false);
    };

    return (
        <nav className="bg-gradient-to-r from-blue-50 to-blue-100 shadow-sm top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo and Desktop Navigation */}
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center space-x-1 group">
                            <img
                                className="h-12 w-12 transform group-hover:rotate-12 transition-transform duration-500"
                                src={pawLogo}
                                alt="PetCare"
                            />
                            <span className="hidden md:block text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                PetPaw
                            </span>
                        </Link>

                        <div className="hidden md:block ml-18">
                            <div className="flex space-x-4 relative">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        className={`relative px-4 py-2 text-md font-medium transition-all duration-300 ${activeLink === link.path
                                            ? 'text-blue-600'
                                            : 'text-gray-700 hover:text-blue-600'
                                            }`}
                                        onMouseEnter={() => setActiveLink(link.path)}
                                        onMouseLeave={() => setActiveLink('')}
                                    >
                                        {link.name}
                                        <span
                                            className={`absolute left-0 bottom-0 h-0.5 bg-blue-600 transition-all duration-300 ${activeLink === link.path ? 'w-full' : 'w-0'
                                                }`}
                                        ></span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Desktop Right Side */}
                    <div className="hidden md:flex items-center space-x-6">
                        {user && (
                            <Link
                                to="/cart"
                                className="relative group p-2 rounded-full hover:bg-blue-100/50 transition-colors duration-300"
                            >
                                <ShoppingCartIcon className="h-6 w-6 text-gray-700 group-hover:text-blue-600 transition-colors duration-300" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center group-hover:animate-bounce transition-all duration-300">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        )}

                        {user ? (
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                    className="p-2 rounded-full hover:bg-blue-100/50 transition-colors duration-300 focus:outline-none"
                                >
                                    <UserCircleIcon className="h-6 w-6 text-gray-700 hover:text-blue-600 transition-colors duration-300" />
                                </button>

                                {/* Dropdown */}
                                {profileMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                                        <Link
                                            to="/profile"
                                            onClick={() => setProfileMenuOpen(false)}
                                            className="block px-4 py-2 text-gray-700 hover:bg-blue-100"
                                        >
                                            Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-100"
                                        >
                                            Log Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium rounded-lg hover:bg-blue-100/50 transition-all duration-300"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-4 py-2 rounded-lg text-md transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        {user && (
                            <Link to="/cart" className="relative mr-4 p-2">
                                <ShoppingCartIcon className="h-6 w-6 text-gray-700" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        )}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
                        >
                            {mobileMenuOpen ? (
                                <XMarkIcon className="h-6 w-6" />
                            ) : (
                                <Bars3Icon className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div
                className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} transition-all duration-300 ease-in-out`}
            >
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg rounded-lg mx-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 relative group"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.name}
                            <span className="absolute left-3 right-3 bottom-1 h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                        </Link>
                    ))}
                    <div className="pt-4 border-t border-gray-200">
                        {user ? (
                            <>
                                <Link
                                    to="/profile"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 relative group"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Profile
                                    <span className="absolute left-3 right-3 bottom-1 h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                >
                                    Log Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 relative group"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Login
                                    <span className="absolute left-3 right-3 bottom-1 h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                                </Link>
                                <Link
                                    to="/register"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Shop', path: '/shop' },
];

export default Navbar;
