import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { EyeIcon, CheckCircleIcon, XCircleIcon, ClockIcon, UserIcon, UserCircleIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { generatePDF } from '../../utils/pdfGenerator';

function AppointmentManagement() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        pet: '',
        service: '',
        date: '',
        time: '',
        notes: '',
        status: 'pending'
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/appointments', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAppointments(response.data || []);
        } catch (error) {
            setError('Failed to fetch appointments');
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewAppointment = (appointment) => {
        setSelectedAppointment(appointment);
        setIsModalOpen(true);
        setIsEditMode(false);
    };

    const handleEditAppointment = (appointment) => {
        setSelectedAppointment(appointment);
        setFormData({
            pet: appointment.pet || '',
            service: appointment.service || '',
            date: appointment.date ? new Date(appointment.date).toISOString().split('T')[0] : '',
            time: appointment.time ? appointment.time.substring(0, 5) : '',
            notes: appointment.notes || '',
            status: appointment.status || 'pending'
        });
        setIsModalOpen(true);
        setIsEditMode(true);
    };

    const handleStatusUpdate = async (appointmentId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://localhost:5000/api/appointments/${appointmentId}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data) {
                Swal.fire({
                    icon: 'success',
                    title: 'Status Updated',
                    text: `Appointment status has been updated to ${newStatus}`,
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });
                fetchAppointments();
            } else {
                throw new Error('Failed to update appointment status');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: error.response?.data?.message || 'Failed to update appointment status',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
        }
    };

    const handleDeleteAppointment = async (appointmentId) => {
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

            if (result.isConfirmed) {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/appointments/${appointmentId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Appointment has been deleted.',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });
                fetchAppointments();
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Delete Failed',
                text: 'Failed to delete appointment',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Service validation
        if (!formData.service.trim()) {
            newErrors.service = 'Service is required';
        }

        // Date validation
        if (!formData.date) {
            newErrors.date = 'Date is required';
        } else {
            const selectedDate = new Date(formData.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                newErrors.date = 'Date cannot be in the past';
            }
        }

        // Time validation
        if (!formData.time) {
            newErrors.time = 'Time is required';
        }

        // Pet validation
        if (!formData.pet) {
            newErrors.pet = 'Pet is required';
        }

        // Status validation
        if (!formData.status) {
            newErrors.status = 'Status is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/appointments/${selectedAppointment._id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: 'Appointment has been updated.',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });

            setIsModalOpen(false);
            fetchAppointments();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'Failed to update appointment',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <ClockIcon className="h-5 w-5" />;
            case 'confirmed':
                return <CheckCircleIcon className="h-5 w-5" />;
            case 'completed':
                return <CheckCircleIcon className="h-5 w-5" />;
            case 'cancelled':
                return <XCircleIcon className="h-5 w-5" />;
            default:
                return null;
        }
    };

    const handleDownloadReport = () => {
        const columns = [
            { header: 'Appointment ID', accessor: (appointment) => `#${appointment._id.slice(-6)}` },
            { header: 'Customer', accessor: (appointment) => `${appointment.user?.firstName} ${appointment.user?.lastName}` },
            { header: 'Service', accessor: (appointment) => appointment.service },
            { header: 'Date & Time', accessor: (appointment) => `${formatDate(appointment.date)} ${appointment.time}` },
            { header: 'Status', accessor: (appointment) => appointment.status }
        ];

        generatePDF('Appointment Management Report', filteredAppointments, columns, 'appointment-management-report.pdf', 'appointments');
    };

    const filteredAppointments = appointments.filter(appointment => {
        const searchLower = searchQuery.toLowerCase();
        const statusMatch = filterStatus === 'all' || appointment.status === filterStatus;
        const searchMatch =
            appointment.service.toLowerCase().includes(searchLower) ||
            appointment.status.toLowerCase().includes(searchLower) ||
            (appointment.user?.firstName?.toLowerCase().includes(searchLower)) ||
            (appointment.user?.lastName?.toLowerCase().includes(searchLower)) ||
            (appointment.user?.email?.toLowerCase().includes(searchLower)) ||
            (appointment.notes?.toLowerCase().includes(searchLower));

        return statusMatch && searchMatch;
    });

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-600 text-center">
                    <h2 className="text-xl font-semibold mb-2">Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Appointment Management</h1>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search appointments..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                    <button
                        onClick={handleDownloadReport}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center"
                    >
                        <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                        Download Report
                    </button>
                </div>
            </div>

            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="all">All Appointments</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Appointments Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredAppointments.map((appointment) => (
                            <tr key={appointment._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                    #{appointment._id.slice(-6)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {appointment.user?.firstName} {appointment.user?.lastName}
                                    </div>
                                    <div className="text-sm text-gray-500">{appointment.user?.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {appointment.service}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(appointment.date)} {appointment.time}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                                        {getStatusIcon(appointment.status)}
                                        <span className="ml-1">{appointment.status}</span>
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => handleViewAppointment(appointment)}
                                            className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                                            title="View Details"
                                        >
                                            <EyeIcon className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleEditAppointment(appointment)}
                                            className="text-yellow-600 hover:text-yellow-900 transition-colors duration-200"
                                            title="Edit Appointment"
                                        >
                                            <PencilIcon className="h-5 w-5" />
                                        </button>
                                        {appointment.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusUpdate(appointment._id, 'confirmed')}
                                                    className="text-green-600 hover:text-green-900 transition-colors duration-200"
                                                    title="Confirm Appointment"
                                                >
                                                    <CheckCircleIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
                                                    className="text-red-600 hover:text-red-900 transition-colors duration-200"
                                                    title="Cancel Appointment"
                                                >
                                                    <XCircleIcon className="h-5 w-5" />
                                                </button>
                                            </>
                                        )}
                                        {appointment.status === 'confirmed' && (
                                            <button
                                                onClick={() => handleStatusUpdate(appointment._id, 'completed')}
                                                className="text-green-600 hover:text-green-900 transition-colors duration-200"
                                                title="Mark as Completed"
                                            >
                                                <CheckCircleIcon className="h-5 w-5" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDeleteAppointment(appointment._id)}
                                            className="text-red-600 hover:text-red-900 transition-colors duration-200"
                                            title="Delete Appointment"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Appointment Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-6 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-gray-900">
                                {isEditMode ? 'Edit Appointment' : 'Appointment Details'}
                            </h3>
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setSelectedAppointment(null);
                                }}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <XCircleIcon className="h-6 w-6" />
                            </button>
                        </div>

                        {isEditMode ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Service</label>
                                    <select
                                        name="service"
                                        value={formData.service}
                                        onChange={handleInputChange}
                                        className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.service ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                    >
                                        <option value="">Select a service</option>
                                        <option value="Checkup">Checkup</option>
                                        <option value="Vaccination">Vaccination</option>
                                        <option value="Grooming">Grooming</option>
                                    </select>
                                    {errors.service && (
                                        <p className="mt-1 text-sm text-red-600">{errors.service}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.date ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.date && (
                                        <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Time</label>
                                    <input
                                        type="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleInputChange}
                                        className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.time ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        step="300"
                                    />
                                    {errors.time && (
                                        <p className="mt-1 text-sm text-red-600">{errors.time}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.status ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                    {errors.status && (
                                        <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Pet</label>
                                    <select
                                        name="pet"
                                        value={formData.pet}
                                        onChange={handleInputChange}
                                        className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.pet ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                    >
                                        <option value="">Select a pet</option>
                                        {selectedAppointment?.user?.pets?.map(pet => (
                                            <option key={pet._id} value={pet._id}>
                                                {pet.name} ({pet.type} - {pet.breed})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.pet && (
                                        <p className="mt-1 text-sm text-red-600">{errors.pet}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            setErrors({});
                                        }}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                                    >
                                        Update Appointment
                                    </button>
                                </div>
                            </form>
                        ) : selectedAppointment ? (
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                            <ClockIcon className="h-5 w-5 mr-2 text-gray-500" />
                                            Appointment Information
                                        </h4>
                                        <div className="space-y-2">
                                            <p className="text-sm text-gray-900">Date: {formatDate(selectedAppointment.date)}</p>
                                            <p className="text-sm text-gray-900">Time: {selectedAppointment.time}</p>
                                            <p className="text-sm text-gray-900">Service: {selectedAppointment.service}</p>
                                            <p className="text-sm text-gray-900">
                                                Status: <span className={`px-2 py-1 rounded-full ${getStatusColor(selectedAppointment.status)}`}>
                                                    {selectedAppointment.status}
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                            <UserIcon className="h-5 w-5 mr-2 text-gray-500" />
                                            Customer Information
                                        </h4>
                                        <div className="space-y-2">
                                            <p className="text-sm text-gray-900">Name: {selectedAppointment.user?.firstName} {selectedAppointment.user?.lastName}</p>
                                            <p className="text-sm text-gray-900">Email: {selectedAppointment.user?.email}</p>
                                            {selectedAppointment.user?.phone && (
                                                <p className="text-sm text-gray-900">Phone: {selectedAppointment.user.phone}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                            <UserCircleIcon className="h-5 w-5 mr-2 text-gray-500" />
                                            Pet Information
                                        </h4>
                                        <div className="space-y-2">
                                            {selectedAppointment.user?.pets?.find(pet => pet._id === selectedAppointment.pet) ? (
                                                <>
                                                    <p className="text-sm text-gray-900">Name: {selectedAppointment.user.pets.find(pet => pet._id === selectedAppointment.pet).name}</p>
                                                    <p className="text-sm text-gray-900">Type: {selectedAppointment.user.pets.find(pet => pet._id === selectedAppointment.pet).type}</p>
                                                    <p className="text-sm text-gray-900">Breed: {selectedAppointment.user.pets.find(pet => pet._id === selectedAppointment.pet).breed}</p>
                                                    <p className="text-sm text-gray-900">Age: {selectedAppointment.user.pets.find(pet => pet._id === selectedAppointment.pet).age} years</p>
                                                </>
                                            ) : (
                                                <p className="text-sm text-gray-500">Pet information not available</p>
                                            )}
                                        </div>
                                    </div>

                                    {selectedAppointment.notes && (
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">Notes</h4>
                                            <p className="text-sm text-gray-900">{selectedAppointment.notes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-gray-500">No appointment details available</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default AppointmentManagement;