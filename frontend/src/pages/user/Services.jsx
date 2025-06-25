import { motion } from 'framer-motion';
import { FaTaxi, FaHome, FaHotel } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Services() {
    return (
        <div className="bg--white min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-20 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
                        >
                            Premium Pet Services
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-gray-600 max-w-3xl mx-auto"
                        >
                            Discover our range of specialized services designed to make pet care convenient and comfortable for you and your furry friends.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Special Services Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {specialServices.map((service, index) => (
                            <motion.div
                                key={service.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                className="bg-white rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-shadow duration-300"
                            >
                                <div className="p-8">
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-500 text-3xl transform group-hover:scale-110 transition-transform duration-300">
                                        {service.icon}
                                    </div>
                                    <h3 className="mt-6 text-2xl font-bold text-gray-900">{service.title}</h3>
                                    <p className="mt-4 text-gray-600 leading-relaxed">{service.description}</p>
                                    <ul className="mt-6 space-y-3">
                                        {service.features.map((feature, i) => (
                                            <li key={i} className="flex items-center text-gray-600">
                                                <svg className="w-4 h-4 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <Link
                                        to={service.link}
                                        className="mt-8 inline-flex items-center justify-center w-full px-6 py-3 text-base font-medium text-white bg-blue-500"
                                    >
                                        Explore
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
}

const specialServices = [
    {
        title: "Pet Taxi",
        icon: <FaTaxi />,
        description: "Safe and comfortable transportation for your pets to vet appointments, grooming sessions, or anywhere they need to go.",
        features: [
            "Door-to-door service",
            "Climate controlled vehicles",
            "Professional pet handlers",
            "GPS tracking available"
        ],

    },
    {
        title: "Pet Boarding",
        icon: <FaHotel />,
        description: "Luxury accommodation for your pets while you're away, providing them with comfort, care, and companionship.",
        features: [
            "24/7 supervision",
            "Comfortable bedding",
            "Regular exercise",
            "Daily updates & photos"
        ],

    },
    {
        title: "Home Visit",
        icon: <FaHome />,
        description: "Professional pet care services in the comfort of your home, perfect for pets who prefer their familiar environment.",
        features: [
            "Medication administration",
            "Feeding & exercise",
            "Basic grooming",
            "Health monitoring"
        ],

    }
];

export default Services;