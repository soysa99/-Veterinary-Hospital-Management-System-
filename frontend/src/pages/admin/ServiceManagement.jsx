import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { EyeIcon, PencilIcon, TrashIcon, XCircleIcon, CheckCircleIcon, ClockIcon, ExclamationCircleIcon, UserCircleIcon, MagnifyingGlassIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { generatePDF } from '../../utils/pdfGenerator';

function ServiceManagement() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [formData, setFormData] = useState({
        serviceType: '',
        price: '',
        notes: '',
        status: 'pending',
        pet: ''
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/services', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setServices(response.data || []);
        } catch (error) {
            setError('Failed to fetch services');
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewService = (service) => {
        if (!service) return;
        setSelectedService(service);
        setIsModalOpen(true);
        setIsEditMode(false);
    };

    const handleEditService = (service) => {
        if (!service) return;
        setSelectedService(service);
        setFormData({
            serviceType: service.serviceType || '',
            price: service.price || '',
            notes: service.notes || '',
            status: service.status || 'pending',
            pet: service.pet || ''
        });
        setIsModalOpen(true);
        setIsEditMode(true);
    };

    const handleDeleteService = async (serviceId) => {
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
                await axios.delete(`http://localhost:5000/api/services/${serviceId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Service has been deleted.',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });
                fetchServices();
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Delete Failed',
                text: 'Failed to delete service',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
        }
    };

    const handleStatusUpdate = async (serviceId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/services/${serviceId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            Swal.fire({
                icon: 'success',
                title: 'Status Updated',
                text: `Service status has been updated to ${newStatus}`,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
            fetchServices();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'Failed to update service status',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Service type validation
        if (!formData.serviceType.trim()) {
            newErrors.serviceType = 'Service type is required';
        }

        // Price validation
        if (!formData.price) {
            newErrors.price = 'Price is required';
        } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
            newErrors.price = 'Price must be a positive number';
        }

        // Status validation
        if (!formData.status) {
            newErrors.status = 'Status is required';
        }

        // Pet validation
        if (!formData.pet) {
            newErrors.pet = 'Pet is required';
        }

        // Notes validation (optional)
        if (formData.notes && formData.notes.length > 500) {
            newErrors.notes = 'Notes cannot exceed 500 characters';
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
            await axios.put(`http://localhost:5000/api/services/${selectedService._id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: 'Service has been updated.',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });

            setIsModalOpen(false);
            fetchServices();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'Failed to update service',
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
                return <ExclamationCircleIcon className="h-5 w-5" />;
            default:
                return null;
        }
    };

    const handleDownloadReport = () => {
        const columns = [
            { header: 'Service ID', accessor: (service) => `#${service._id.slice(-6)}` },
            { header: 'Customer', accessor: (service) => `${service.user?.firstName} ${service.user?.lastName}` },
            { header: 'Service Type', accessor: (service) => service.serviceType },
            { header: 'Date & Time', accessor: (service) => `${new Date(service.date).toLocaleDateString()} ${service.time}` },
            { header: 'Status', accessor: (service) => service.status }
        ];

        generatePDF('Service Management Report', filteredServices, columns, 'service-management-report.pdf', 'services');
    };

    const filteredServices = services.filter(service => {
        const searchLower = searchQuery.toLowerCase();
        const statusMatch = filterStatus === 'all' || service.status === filterStatus;
        const searchMatch =
            service.serviceType.toLowerCase().includes(searchLower) ||
            service.status.toLowerCase().includes(searchLower) ||
            (service.user?.firstName?.toLowerCase().includes(searchLower)) ||
            (service.user?.lastName?.toLowerCase().includes(searchLower)) ||
            (service.user?.email?.toLowerCase().includes(searchLower)) ||
            (service.notes?.toLowerCase().includes(searchLower));

        return statusMatch && searchMatch;
    });

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
                <h1 className="text-2xl font-bold text-gray-900">Service Management</h1>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search services..."
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
                        <option value="all">All Services</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Services Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredServices.map((service) => (
                            <tr key={service._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                    #{service._id.slice(-6)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {service.user?.firstName} {service.user?.lastName}
                                    </div>
                                    <div className="text-sm text-gray-500">{service.user?.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {service.serviceType}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(service.date).toLocaleDateString()} {service.time}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    ${service.price}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getStatusColor(service.status)}`}>
                                        {getStatusIcon(service.status)}
                                        <span className="ml-1">{service.status}</span>
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => handleViewService(service)}
                                            className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                                            title="View Details"
                                        >
                                            <EyeIcon className="h-5 w-5" />
                                        </button>
                                        {service.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusUpdate(service._id, 'confirmed')}
                                                    className="text-green-600 hover:text-green-900 transition-colors duration-200"
                                                    title="Confirm Service"
                                                >
                                                    <CheckCircleIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(service._id, 'cancelled')}
                                                    className="text-red-600 hover:text-red-900 transition-colors duration-200"
                                                    title="Cancel Service"
                                                >
                                                    <ExclamationCircleIcon className="h-5 w-5" />
                                                </button>
                                            </>
                                        )}
                                        {service.status === 'confirmed' && (
                                            <button
                                                onClick={() => handleStatusUpdate(service._id, 'completed')}
                                                className="text-green-600 hover:text-green-900 transition-colors duration-200"
                                                title="Mark as Completed"
                                            >
                                                <CheckCircleIcon className="h-5 w-5" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleEditService(service)}
                                            className="text-yellow-600 hover:text-yellow-900 transition-colors duration-200"
                                            title="Edit Service"
                                        >
                                            <PencilIcon className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteService(service._id)}
                                            className="text-red-600 hover:text-red-900 transition-colors duration-200"
                                            title="Delete Service"
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

            {/* Service Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-6 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-gray-900">
                                {isEditMode ? 'Edit Service' : 'Service Details'}
                            </h3>
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setSelectedService(null);
                                }}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <XCircleIcon className="h-6 w-6" />
                            </button>
                        </div>

                        {isEditMode ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Service Type</label>
                                    <select
                                        name="serviceType"
                                        value={formData.serviceType}
                                        onChange={handleInputChange}
                                        className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.serviceType ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                    >
                                        <option value="">Select service type</option>
                                        <option value="Pet Taxi">Pet Taxi</option>
                                        <option value="Home Visit">Home Visit</option>
                                        <option value="Pet Boarding">Pet Boarding</option>
                                    </select>
                                    {errors.serviceType && (
                                        <p className="mt-1 text-sm text-red-600">{errors.serviceType}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.price ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        min="0"
                                        step="0.01"
                                    />
                                    {errors.price && (
                                        <p className="mt-1 text-sm text-red-600">{errors.price}</p>
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
                                        <option value="">Select status</option>
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
                                        {selectedService?.user?.pets?.map(pet => (
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
                                        className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.notes ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.notes && (
                                        <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
                                    )}
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
                                        Update Service
                                    </button>
                                </div>
                            </form>
                        ) : selectedService ? (
                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Service Details</h4>
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-900">Service Type: {selectedService.serviceType || 'N/A'}</p>
                                        <p className="text-sm text-gray-900">Price: ${selectedService.price || '0'}</p>
                                        <p className="text-sm text-gray-900">Date: {selectedService.date ? new Date(selectedService.date).toLocaleDateString() : 'N/A'}</p>
                                        <p className="text-sm text-gray-900">Time: {selectedService.time || 'N/A'}</p>
                                        <p className="text-sm text-gray-900">
                                            Status: <span className={`px-2 py-1 rounded-full ${getStatusColor(selectedService.status)}`}>
                                                {selectedService.status || 'N/A'}
                                            </span>
                                        </p>
                                        {selectedService.notes && (
                                            <p className="text-sm text-gray-900">Notes: {selectedService.notes}</p>
                                        )}
                                        {selectedService.user && (
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <h5 className="text-sm font-medium text-gray-700 mb-2">Customer Information</h5>
                                                <p className="text-sm text-gray-900">Name: {selectedService.user.firstName} {selectedService.user.lastName}</p>
                                                <p className="text-sm text-gray-900">Email: {selectedService.user.email}</p>
                                                {selectedService.user.phone && (
                                                    <p className="text-sm text-gray-900">Phone: {selectedService.user.phone}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                        <UserCircleIcon className="h-5 w-5 mr-2 text-gray-500" />
                                        Pet Information
                                    </h4>
                                    <div className="space-y-2">
                                        {selectedService?.user?.pets?.find(pet => pet._id === selectedService.pet) ? (
                                            <>
                                                <p className="text-sm text-gray-900">Name: {selectedService.user.pets.find(pet => pet._id === selectedService.pet).name}</p>
                                                <p className="text-sm text-gray-900">Type: {selectedService.user.pets.find(pet => pet._id === selectedService.pet).type}</p>
                                                <p className="text-sm text-gray-900">Breed: {selectedService.user.pets.find(pet => pet._id === selectedService.pet).breed}</p>
                                                <p className="text-sm text-gray-900">Age: {selectedService.user.pets.find(pet => pet._id === selectedService.pet).age} years</p>
                                            </>
                                        ) : (
                                            <p className="text-sm text-gray-500">Pet information not available</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-3">
                                    {selectedService.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleStatusUpdate(selectedService._id, 'confirmed')}
                                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                                            >
                                                Confirm Service
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(selectedService._id, 'cancelled')}
                                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
                                            >
                                                Cancel Service
                                            </button>
                                        </>
                                    )}
                                    {selectedService.status === 'confirmed' && (
                                        <button
                                            onClick={() => handleStatusUpdate(selectedService._id, 'completed')}
                                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                                        >
                                            Mark as Completed
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-gray-500">No service details available</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ServiceManagement;