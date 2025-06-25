import { Link } from 'react-router-dom';
import HeroImage from '../../assets/Hero.jpg';
import { FaPaw, FaClock, FaUserMd, FaClinicMedical, FaDog, FaCat, FaHeartbeat } from 'react-icons/fa';
import { GiMedicinePills } from 'react-icons/gi';

function Home() {
    return (
        <div className="bg-gradient-to-b from-white to-blue-50">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent z-10"></div>
                <img
                    src={HeroImage}
                    alt="Happy pets"
                    className="w-full h-screen object-cover object-center"
                />

                <div className="absolute inset-0 z-20">
                    <div className="max-w-7xl mx-auto px-4 h-full">
                        <div className="flex items-center h-full">
                            <div className="max-w-xl pt-8">
                                <div className="flex items-center mb-6 animate-fade-in-up">
                                    <FaPaw className="text-blue-400 mr-2 text-2xl" />
                                    <span className="text-blue-400 font-semibold tracking-wider">PET CARE SPECIALISTS</span>
                                </div>
                                <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl">
                                    <span className="block mb-2">Exceptional Care</span>
                                    <span className="block text-blue-300">For Your Best Friend</span>
                                </h1>
                                <p className="mt-8 text-xl text-gray-200 max-w-lg leading-relaxed">
                                    Compassionate veterinary care with cutting-edge technology and a loving touch.
                                </p>
                                <div className="mt-10 flex flex-wrap gap-6">
                                    <Link
                                        to="/register"
                                        className="inline-flex items-center px-4 py-3 border border-transparent text-lg font-semibold rounded-full text-white bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                    >
                                        Book Appointment
                                    </Link>
                                    <Link
                                        to="/services"
                                        className="inline-flex items-center px-4 py-3 border-2 border-white text-lg font-semibold rounded-full text-white bg-transparent hover:bg-white/10 transition-all duration-300"
                                    >
                                        Explore Services
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 relative">
                <div className="absolute -top-10 left-0 right-0 flex justify-center">
                    <div className="w-32 h-32 bg-blue-500 rounded-full filter blur-3xl opacity-10"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full font-medium mb-4">
                            Why Choose Us
                        </span>
                        <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                            Unmatched <span className="text-blue-600">Pet Care</span> Experience
                        </h2>
                        <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                            We combine medical expertise with genuine love for animals to provide the best care possible.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={feature.title}
                                className="relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                            >
                                <div className="absolute -top-6 left-6 flex items-center justify-center h-14 w-14 rounded-xl bg-blue-600 text-white text-2xl shadow-md">
                                    {feature.icon}
                                </div>
                                <h3 className="mt-8 text-2xl font-bold text-gray-900">{feature.title}</h3>
                                <p className="mt-4 text-gray-600">{feature.description}</p>
                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <Link
                                        to={feature.link}
                                        className="text-blue-600 font-medium flex items-center hover:text-blue-700 transition-colors"
                                    >
                                        Learn more
                                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pet Types Section */}
            <section className="py-20 bg-blue-100 text-blue-400">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold sm:text-5xl">
                            Care For <span className="text-blue-500">All Pets</span>
                        </h2>
                        <p className="mt-4 text-xl text-blue-100 max-w-3xl mx-auto">
                            We provide specialized care for all types of furry, feathery, and scaly friends.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {petTypes.map((pet) => (
                            <div key={pet.name} className="group">
                                <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg">
                                    <div className="flex items-center justify-center h-16 w-16 bg-white rounded-full text-3xl mb-4">
                                        {pet.icon}
                                    </div>
                                    <h3 className="text-xl font-bold">{pet.name}</h3>
                                    <p className="mt-2 text-blue-400 text-sm">{pet.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


        </div>
    );
}

const features = [
    {
        title: '24/7 Emergency Care',
        description: 'Immediate attention for urgent situations, day or night.',
        icon: <FaClock />,
        link: '/services/emergency'
    },
    {
        title: 'Expert Veterinarians',
        description: 'Board-certified specialists with years of experience.',
        icon: <FaUserMd />,
        link: '/team'
    },
    {
        title: 'Advanced Facilities',
        description: 'State-of-the-art diagnostic and treatment equipment.',
        icon: <FaClinicMedical />,
        link: '/facilities'
    },
    {
        title: 'Preventive Care',
        description: 'Comprehensive wellness plans to keep pets healthy.',
        icon: <GiMedicinePills />,
        link: '/services/preventive'
    }
];

const petTypes = [
    {
        name: 'Dogs',
        description: 'From puppies to seniors',
        icon: <FaDog />
    },
    {
        name: 'Cats',
        description: 'Feline specialists',
        icon: <FaCat />
    },
    {
        name: 'Exotics',
        description: 'Birds, reptiles & more',
        icon: <FaPaw />
    },
    {
        name: 'Special Needs',
        description: 'Extra care required',
        icon: <FaHeartbeat />
    }
];

// Add this to your global CSS
// @keyframes float {
//     0%, 100% { transform: translateY(0); }
//     50% { transform: translateY(-10px); }
// }
// .animate-float { animation: float 3s ease-in-out infinite; }
// .animate-float-delay { animation: float 3s ease-in-out 1.5s infinite; }

export default Home;