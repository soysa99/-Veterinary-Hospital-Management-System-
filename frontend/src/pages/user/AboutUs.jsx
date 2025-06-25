import { UserCircleIcon, HeartIcon, StarIcon, AcademicCapIcon } from '@heroicons/react/24/solid';

function About() {
    return (
        <div className="bg-white">
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Hero Section with Pet Image */}
                <div className="text-center mb-16 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 opacity-30 rounded-3xl -z-10"></div>
                    <h1 className="text-5xl font-bold text-gray-900">
                        About Us
                    </h1>
                    <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                        Dedicated to providing the best care for your beloved pets with compassion and expertise
                    </p>
                    <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        <img
                            src="https://images.unsplash.com/photo-1583511655826-05700d52f4d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
                            alt="Happy dog"
                            className="rounded-xl object-cover h-48 w-full shadow-md"
                        />
                        <img
                            src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
                            alt="Cat"
                            className="rounded-xl object-cover h-48 w-full shadow-md"
                        />
                        <img
                            src="https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
                            alt="Dog with vet"
                            className="rounded-xl object-cover h-48 w-full shadow-md"
                        />
                        <img
                            src="https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
                            alt="Dog walking"
                            className="rounded-xl object-cover h-48 w-full shadow-md"
                        />
                    </div>
                </div>

                {/* Mission Statement */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-16 shadow-sm relative overflow-hidden">
                    <div className="absolute -right-20 -top-20 opacity-20">
                        <HeartIcon className="h-64 w-64 text-blue-400" />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
                        <p className="text-gray-600 text-lg">
                            To provide exceptional care for all pets through compassionate service,
                            modern medical practices, and continuous education of pet parents.
                        </p>
                    </div>
                </div>

                {/* Pet Care Gallery */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                        Our <span className="text-blue-600">Happy Patients</span>
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {petImages.map((image, index) => (
                            <div key={index} className="relative group overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                                <img
                                    src={image.src}
                                    alt={image.alt}
                                    className="h-64 w-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                    <p className="text-white font-medium">{image.caption}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Team Section */}
                <div className="mb-16">
                    <h2 className="text-3xl mt-20 font-bold text-gray-900 mb-12 text-center">
                        Meet Our <span className="text-blue-600">Team</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {team.map((member) => (
                            <div
                                key={member.name}
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                            >
                                <div className="p-6 flex justify-center">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="h-32 w-32 rounded-full object-cover border-4 border-blue-100"
                                    />
                                </div>
                                <div className="p-6 text-center border-t border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {member.name}
                                    </h3>
                                    <p className="text-blue-600 font-medium mt-1">{member.role}</p>
                                    <p className="mt-4 text-gray-600">{member.description}</p>
                                    <div className="mt-6 flex justify-center space-x-2">
                                        {member.specialties.map((specialty, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                            >
                                                {specialty}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Testimonials with Pet Owners */}
                <div className="bg-blue-50 rounded-2xl p-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                        What <span className="text-blue-600">Pet Parents</span> Say
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                                <div className="flex items-center mb-4">
                                    <img
                                        src={testimonial.ownerImage}
                                        alt={testimonial.owner}
                                        className="h-12 w-12 rounded-full object-cover mr-4"
                                    />
                                    <div>
                                        <h4 className="font-bold">{testimonial.owner}</h4>
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <StarIcon
                                                    key={i}
                                                    className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                                <div className="mt-4 flex justify-center">
                                    <img
                                        src={testimonial.petImage}
                                        alt={testimonial.pet}
                                        className="h-20 w-20 rounded-full object-cover border-2 border-blue-200"
                                    />
                                </div>
                                <p className="text-center mt-2 text-sm text-blue-600">{testimonial.pet}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

const team = [
    {
        name: 'Dr. Sarah Johnson',
        role: 'Lead Veterinarian',
        description: 'Board-certified veterinarian with 15 years of experience in pet care and surgery',
        specialties: ['Surgery', 'Dentistry', 'Preventive Care'],
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
    },
    {
        name: 'Dr. Mike Wilson',
        role: 'Emergency Specialist',
        description: 'Specializes in emergency pet care and critical condition management',
        specialties: ['Emergency', 'Trauma', 'Critical Care'],
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
    },
    {
        name: 'Emma Thompson',
        role: 'Behavior Specialist',
        description: 'Certified pet behaviorist with expertise in training and rehabilitation',
        specialties: ['Training', 'Behavior', 'Rehabilitation'],
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
    }
];

const petImages = [
    {
        src: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        alt: 'Golden Retriever',
        caption: 'Max - Golden Retriever'
    },
    {
        src: 'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        alt: 'Dog with bandage',
        caption: 'Buddy - Post-Surgery Care'
    },
    {
        src: 'https://images.unsplash.com/photo-1594149929911-78975a43d4f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        alt: 'Cat being examined',
        caption: 'Mittens - Routine Checkup'
    },
    {
        src: 'https://images.unsplash.com/photo-1491485880348-85d48a9e5312?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        alt: 'Cat with doctor',
        caption: 'Luna - Senior Care'
    }
];

const testimonials = [
    {
        owner: 'Jennifer K.',
        ownerImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        pet: 'Max (Golden Retriever)',
        petImage: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        quote: 'The team saved Max when he had an emergency. Their care and expertise are unmatched!',
        rating: 5
    },
    {
        owner: 'Michael T.',
        ownerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        pet: 'Whiskers (Persian Cat)',
        petImage: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        quote: 'Emma helped solve Whiskers\' behavioral issues. We\'re so grateful for her patience and knowledge.',
        rating: 5
    },
    {
        owner: 'Sarah L.',
        ownerImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        pet: 'Bella (Labrador)',
        petImage: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        quote: 'Regular checkups keep Bella healthy and happy. The staff always makes us feel welcome.',
        rating: 4
    }
];

export default About;