import { useState, useEffect } from 'react';
import { FaTaxi, FaHome, FaHotel, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import Swal from 'sweetalert2';
import Spinner from '../../components/Spinner';
import { validateRequired, validateDate, validateTime, validateAddress, validateNotes } from '../../utils/validationUtils';

function BookService() {
    const { user } = useUser();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Services available for booking
    const availableServices = [
        {
            id: 1,
            name: 'Pet Taxi',
            description: 'Safe and comfortable transportation for your pets',
            price: 25,
            icon: <FaTaxi className="w-8 h-8 text-blue-600" />
        },
        {
            id: 2,
            name: 'Home Visit',
            description: 'Professional pet care services at your home',
            price: 40,
            icon: <FaHome className="w-8 h-8 text-blue-600" />
        },
        {
            id: 3,
            name: 'Pet Boarding',
            description: 'Comfortable stay for your pets while you are away',
            price: 35,
            icon: <FaHotel className="w-8 h-8 text-blue-600" />
        }
    ];

    // State for form
    const [selectedService, setSelectedService] = useState(null);
    const [formData, setFormData] = useState({
        pet: '',
        date: '',
        time: '',
        address: '',
        notes: '',
        serviceType: '',
        price: 0
    });
    const [isEditing, setIsEditing] = useState(false);
    const [formErrors, setFormErrors] = useState({
        pet: '',
        date: '',
        time: '',
        address: '',
        notes: ''
    });

    // Fetch bookings
    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/services/my-bookings', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch bookings');
            }

            const data = await response.json();
            setBookings(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const errors = {
            pet: '',
            date: '',
            time: '',
            address: '',
            notes: ''
        };

        // Validate pet selection
        if (!validateRequired(formData.pet)) {
            errors.pet = 'Please select a pet';
        }

        // Validate date
        if (!validateRequired(formData.date)) {
            errors.date = 'Date is required';
        } else if (!validateDate(formData.date)) {
            errors.date = 'Please select a future date';
        }

        // Validate time
        if (!validateRequired(formData.time)) {
            errors.time = 'Time is required';
        } else if (!validateTime(formData.time)) {
            errors.time = 'Please select a valid time';
        }

        // Validate address
        if (!validateRequired(formData.address)) {
            errors.address = 'Address is required';
        } else if (!validateAddress(formData.address)) {
            errors.address = 'Please enter a complete address (minimum 10 characters)';
        }

        // Validate notes (optional)
        if (formData.notes && !validateNotes(formData.notes)) {
            errors.notes = 'Notes cannot exceed 500 characters';
        }

        setFormErrors(errors);
        return !Object.values(errors).some(error => error !== '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setSubmitting(true);
            const token = localStorage.getItem('token');
            const url = isEditing
                ? `http://localhost:5000/api/services/${formData._id}`
                : 'http://localhost:5000/api/services/book';

            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    serviceType: selectedService.name,
                    price: selectedService.price
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to save booking');
            }

            const data = await response.json();

            if (isEditing) {
                setBookings(bookings.map(booking =>
                    booking._id === data._id ? data : booking
                ));
                Swal.fire({
                    icon: 'success',
                    title: 'Booking Updated',
                    text: 'Your booking has been updated successfully!',
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                setBookings([...bookings, data]);
                Swal.fire({
                    icon: 'success',
                    title: 'Booking Created',
                    text: 'Your booking has been created successfully!',
                    timer: 2000,
                    showConfirmButton: false
                });
            }

            // Reset form
            setFormData({
                pet: '',
                date: '',
                time: '',
                address: '',
                notes: '',
                serviceType: '',
                price: 0
            });
            setSelectedService(null);
            setIsEditing(false);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'An error occurred while saving the booking'
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (booking) => {
        const serviceDetails = availableServices.find(s => s.name === booking.serviceType);
        setSelectedService(serviceDetails);
        setFormData({
            _id: booking._id,
            pet: booking.pet._id,
            date: new Date(booking.date).toISOString().split('T')[0],
            time: booking.time,
            address: booking.address,
            notes: booking.notes,
            serviceType: booking.serviceType,
            price: booking.price
        });
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            });

            if (!result.isConfirmed) {
                return;
            }

            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/services/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete booking');
            }

            setBookings(bookings.filter(booking => booking._id !== id));
            Swal.fire(
                'Deleted!',
                'Your booking has been removed.',
                'success'
            );
        } catch (error) {
            Swal.fire(
                'Error!',
                error.message || 'Failed to delete booking',
                'error'
            );
        }
    };

    const handleCancel = () => {
        setSelectedService(null);
        setIsEditing(false);
        setFormData({
            pet: '',
            date: '',
            time: '',
            address: '',
            notes: '',
            serviceType: '',
            price: 0
        });
    };

    // Add this function to format pet name for display
    const formatPetName = (pet) => {
        return `${pet.name} (${pet.type}${pet.breed ? ` - ${pet.breed}` : ''})`;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner size="lg" text="Loading your bookings..." />
            </div>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900">Book a Service</h1>
                    <p className="mt-4 text-xl text-gray-600">
                        Choose from our premium pet care services
                    </p>
                </div>

                {/* Available Services */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {availableServices.map((service) => (
                        <motion.div
                            key={service.id}
                            whileHover={{ scale: 1.02 }}
                            className={`bg-white rounded-2xl shadow-xl p-6 cursor-pointer ${selectedService?.id === service.id ? 'ring-2 ring-blue-600' : ''
                                }`}
                            onClick={() => {
                                setSelectedService(service);
                                setIsEditing(false);
                                setFormData({
                                    pet: '',
                                    date: '',
                                    time: '',
                                    address: '',
                                    notes: '',
                                    serviceType: service.name,
                                    price: service.price
                                });
                            }}
                        >
                            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                            <p className="text-gray-600 mb-4">{service.description}</p>
                            <p className="text-blue-600 font-semibold">${service.price}/hour</p>
                        </motion.div>
                    ))}
                </div>

                {/* Booking Form */}
                {(selectedService || isEditing) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 mb-12"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            {isEditing ? 'Edit Booking' : `Book ${selectedService?.name}`}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Pet
                                    </label>
                                    <select
                                        name="pet"
                                        value={formData.pet}
                                        onChange={(e) => setFormData({ ...formData, pet: e.target.value })}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${formErrors.pet ? 'border-red-500' : 'border-gray-300'}`}
                                    >
                                        <option value="">Choose a pet</option>
                                        {user?.pets?.map(pet => (
                                            <option key={pet._id} value={pet._id}>
                                                {formatPetName(pet)}
                                            </option>
                                        ))}
                                    </select>
                                    {formErrors.pet && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.pet}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${formErrors.date ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {formErrors.date && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.date}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Time
                                    </label>
                                    <input
                                        type="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${formErrors.time ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {formErrors.time && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.time}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${formErrors.address ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Service location"
                                    />
                                    {formErrors.address && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Additional Notes
                                </label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    rows={4}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${formErrors.notes ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Any special requirements..."
                                />
                                {formErrors.notes && (
                                    <p className="mt-1 text-sm text-red-600">{formErrors.notes}</p>
                                )}
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={submitting}
                                    className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? (
                                        <div className="flex items-center justify-center">
                                            <Spinner size="sm" text="" />
                                            <span className="ml-2">Processing...</span>
                                        </div>
                                    ) : (
                                        isEditing ? 'Update Booking' : 'Book Now'
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {/* Booked Services List */}
                {bookings.length > 0 && (
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Booked Services</h2>

                        <div className="space-y-4">
                            {bookings.map((booking) => (
                                <motion.div
                                    key={booking._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-white rounded-xl shadow-md p-6"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">
                                                {booking.serviceType} for {booking.pet.name}
                                            </h3>
                                            <p className="text-gray-600 mt-1">
                                                {new Date(booking.date).toLocaleDateString()} at {booking.time}
                                            </p>
                                            <p className="text-gray-600">{booking.address}</p>
                                            {booking.notes && (
                                                <p className="text-gray-600 mt-2">
                                                    <span className="font-medium">Notes:</span> {booking.notes}
                                                </p>
                                            )}
                                            <p className="text-blue-600 font-semibold mt-2">
                                                ${booking.price}/hour
                                            </p>
                                            <p className={`mt-2 text-sm font-medium ${booking.status === 'pending' ? 'text-yellow-600' :
                                                booking.status === 'confirmed' ? 'text-green-600' :
                                                    booking.status === 'completed' ? 'text-blue-600' :
                                                        'text-red-600'
                                                }`}>
                                                Status: {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                            </p>
                                        </div>
                                        {booking.status === 'pending' && (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(booking)}
                                                    className="p-2 text-blue-600 hover:text-blue-800"
                                                    title="Edit"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(booking._id)}
                                                    className="p-2 text-red-600 hover:text-red-800"
                                                    title="Delete"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default BookService;