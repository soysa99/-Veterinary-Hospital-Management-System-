import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiCalendar, FiClock, FiUser, FiCheckCircle, FiEdit, FiTrash } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { useUser } from '../../context/UserContext';
import Spinner from '../../components/Spinner';
import { validateRequired, validateDate, validateTime, validateNotes } from '../../utils/validationUtils';

// Base URL for API
const API_BASE_URL = 'http://localhost:5000/api';

function Appointment() {
    const { user } = useUser();
    const [appointments, setAppointments] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        pet: '',
        service: '',
        date: '',
        time: '',
        notes: ''
    });
    const [formErrors, setFormErrors] = useState({
        pet: '',
        service: '',
        date: '',
        time: '',
        notes: ''
    });

    const availableTimes = [
        '09:00 AM', '10:00 AM', '11:00 AM',
        '02:00 PM', '03:00 PM', '04:00 PM'
    ];

    const getAuthConfig = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';
            return null;
        }
        return {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    };

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const config = getAuthConfig();
            if (!config) return;

            const response = await axios.get(`${API_BASE_URL}/appointments`, config);
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to fetch appointments'
            });
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const errors = {
            pet: '',
            service: '',
            date: '',
            time: '',
            notes: ''
        };

        // Validate pet selection
        if (!validateRequired(formData.pet)) {
            errors.pet = 'Please select a pet';
        }

        // Validate service
        if (!validateRequired(formData.service)) {
            errors.service = 'Please select a service';
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
            const config = getAuthConfig();
            if (!config) return;

            if (editingId) {
                await axios.put(
                    `${API_BASE_URL}/appointments/${editingId}`,
                    formData,
                    config
                );
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Appointment updated successfully'
                });
            } else {
                await axios.post(
                    `${API_BASE_URL}/appointments`,
                    formData,
                    config
                );
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Appointment booked successfully'
                });
            }
            fetchAppointments();
            resetForm();
        } catch (error) {
            console.error('Error saving appointment:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to save appointment'
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (!result.isConfirmed) return;

        try {
            setLoading(true);
            const config = getAuthConfig();
            if (!config) return;

            await axios.delete(`${API_BASE_URL}/appointments/${id}`, config);
            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Appointment has been deleted.'
            });
            fetchAppointments();
            if (editingId === id) resetForm();
        } catch (error) {
            console.error('Error deleting appointment:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to delete appointment'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (appointment) => {
        setFormData({
            pet: appointment.pet,
            service: appointment.service,
            date: new Date(appointment.date).toISOString().split('T')[0],
            time: appointment.time,
            notes: appointment.notes || ''
        });
        setEditingId(appointment._id);
    };

    const resetForm = () => {
        setFormData({
            pet: '',
            service: '',
            date: '',
            time: '',
            notes: ''
        });
        setEditingId(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner size="lg" text="Loading your appointments..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold mb-6">
                    {editingId ? 'Edit Appointment' : 'Book Appointment'}
                </h2>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl shadow-xl p-6 space-y-6"
                >
                    <div>
                        <label className="block mb-2 font-semibold">Pet</label>
                        <select
                            name="pet"
                            value={formData.pet}
                            onChange={handleInputChange}
                            className={`w-full border rounded-lg px-4 py-2 ${formErrors.pet ? 'border-red-500' : 'border-gray-300'}`}
                            disabled={submitting}
                        >
                            <option value="">Select Pet</option>
                            {user?.pets?.map((pet) => (
                                <option key={pet._id} value={pet._id}>
                                    {pet.name} ({pet.type})
                                </option>
                            ))}
                        </select>
                        {formErrors.pet && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.pet}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold">Service</label>
                        <select
                            name="service"
                            value={formData.service}
                            onChange={handleInputChange}
                            className={`w-full border rounded-lg px-4 py-2 ${formErrors.service ? 'border-red-500' : 'border-gray-300'}`}
                            disabled={submitting}
                        >
                            <option value="">Select Service</option>
                            <option value="Checkup">Checkup</option>
                            <option value="Vaccination">Vaccination</option>
                            <option value="Grooming">Grooming</option>
                        </select>
                        {formErrors.service && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.service}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            className={`w-full border rounded-lg px-4 py-2 ${formErrors.date ? 'border-red-500' : 'border-gray-300'}`}
                            disabled={submitting}
                        />
                        {formErrors.date && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.date}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold">Time</label>
                        <div className="grid grid-cols-3 gap-3">
                            {availableTimes.map((time) => (
                                <button
                                    type="button"
                                    key={time}
                                    onClick={() => setFormData(prev => ({ ...prev, time }))}
                                    className={`px-4 py-2 rounded-lg ${formData.time === time
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200'
                                        } ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={submitting}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                        {formErrors.time && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.time}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold">Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            rows={3}
                            className={`w-full border rounded-lg px-4 py-2 ${formErrors.notes ? 'border-red-500' : 'border-gray-300'}`}
                            disabled={submitting}
                        />
                        {formErrors.notes && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.notes}</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-4">
                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                disabled={submitting}
                                className="px-4 py-2 border border-gray-500 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`px-6 py-2 bg-blue-600 text-white rounded-lg ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {submitting ? (
                                <div className="flex items-center justify-center">
                                    <Spinner size="sm" text="" />
                                    <span className="ml-2">Processing...</span>
                                </div>
                            ) : (
                                editingId ? 'Update Appointment' : 'Book Appointment'
                            )}
                        </button>
                    </div>
                </form>

                {/* Appointment List */}
                <div className="mt-12">
                    <h3 className="text-2xl font-semibold mb-4">My Appointments</h3>
                    {loading ? (
                        <p className="text-gray-500">Loading appointments...</p>
                    ) : appointments.length === 0 ? (
                        <p className="text-gray-500">No appointments booked yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {appointments.map((apt) => (
                                <div key={apt._id} className="bg-white rounded-lg shadow-md p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="text-xl font-semibold text-gray-800">
                                                {user?.pets?.find(p => p._id === apt.pet)?.name || 'Unknown Pet'}
                                            </h4>
                                            <p className="text-sm text-gray-500">
                                                {user?.pets?.find(p => p._id === apt.pet)?.type || 'Unknown Type'}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <FiCalendar className="text-gray-500" />
                                                <span className="text-gray-700">
                                                    {new Date(apt.date).toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FiClock className="text-gray-500" />
                                                <span className="text-gray-700">{apt.time}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <FiUser className="text-gray-500" />
                                                <span className="text-gray-700">Service: {apt.service}</span>
                                            </div>
                                            {apt.notes && (
                                                <div className="flex items-start gap-2">
                                                    <FiCheckCircle className="text-gray-500 mt-1" />
                                                    <span className="text-gray-700">Notes: {apt.notes}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4 border-t">
                                        <button
                                            onClick={() => handleEdit(apt)}
                                            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            disabled={submitting}
                                        >
                                            <FiEdit /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(apt._id)}
                                            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            disabled={submitting}
                                        >
                                            <FiTrash /> Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Appointment;
