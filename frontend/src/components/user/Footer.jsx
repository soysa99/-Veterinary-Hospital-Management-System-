import { Link } from 'react-router-dom';
import pawLogo from '../../assets/paw-logo.png';
import {
    FaFacebook,
    FaInstagram,
    FaTwitter,
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
    FaHeart
} from 'react-icons/fa';

function Footer() {
    return (
        <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white relative">
            {/* Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative max-w-7xl mx-auto pt-16 pb-8 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center space-x-3 group">
                            <img
                                className="h-12 w-12 transform group-hover:rotate-12 transition-transform duration-500"
                                src={pawLogo}
                                alt="PetCare"
                            />
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                PetPaw
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Providing exceptional care for your beloved pets since 2010. Your trusted partner in pet health and happiness.
                        </p>
                        <div className="flex space-x-5">
                            <a href="#" className="text-gray-400 hover:text-blue-500 transform hover:scale-110 transition-all duration-300">
                                <FaFacebook className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-pink-500 transform hover:scale-110 transition-all duration-300">
                                <FaInstagram className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-sky-500 transform hover:scale-110 transition-all duration-300">
                                <FaTwitter className="h-6 w-6" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links Column */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 relative inline-block">
                            Quick Links
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                        </h3>
                        <ul className="space-y-4">
                            {quickLinks.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        to={item.path}
                                        className="text-gray-400 hover:text-white flex items-center group transition-colors duration-300"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services Column */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 relative inline-block">
                            Our Services
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                        </h3>
                        <ul className="space-y-4">
                            {services.map((service) => (
                                <li key={service.name}>
                                    <Link
                                        to={service.path}
                                        className="text-gray-400 hover:text-white flex items-center group transition-colors duration-300"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
                                        {service.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 relative inline-block">
                            Get in Touch
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-start group">
                                <FaMapMarkerAlt className="h-5 w-5 text-blue-400 mt-1 mr-3 flex-shrink-0 group-hover:text-blue-500 transition-colors duration-300" />
                                <span className="text-gray-400 group-hover:text-white transition-colors duration-300">
                                    123 Pet Street, Pet City, PC 12345
                                </span>
                            </li>
                            <li className="flex items-center group">
                                <FaPhoneAlt className="h-5 w-5 text-blue-400 mr-3 group-hover:text-blue-500 transition-colors duration-300" />
                                <a href="tel:1234567890" className="text-gray-400 hover:text-white transition-colors duration-300">
                                    (123) 456-7890
                                </a>
                            </li>
                            <li className="flex items-center group">
                                <FaEnvelope className="h-5 w-5 text-blue-400 mr-3 group-hover:text-blue-500 transition-colors duration-300" />
                                <a href="mailto:info@petpaw.com" className="text-gray-400 hover:text-white transition-colors duration-300">
                                    info@petpaw.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-12 pt-8 border-t border-gray-800">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm">
                            © {new Date().getFullYear()} PetPaw. All rights reserved.
                        </p>
                        <p className="text-gray-400 text-sm mt-4 md:mt-0 flex items-center">
                            Made with <FaHeart className="text-red-500 mx-1" /> by PetPaw Team
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Shop', path: '/shop' },
    { name: 'Contact', path: '/contact' },
];

const services = [
    { name: 'Veterinary Care', path: '/services/veterinary' },
    { name: 'Pet Grooming', path: '/services/grooming' },
    { name: 'Pet Boarding', path: '/services/boarding' },
    { name: 'Pet Training', path: '/services/training' },
];

export default Footer;