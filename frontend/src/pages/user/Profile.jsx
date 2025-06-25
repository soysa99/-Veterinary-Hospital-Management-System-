import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit, FiTrash2, FiPlus, FiUser, FiMail, FiCalendar, FiPlusCircle } from 'react-icons/fi';
import { FaUserCircle } from 'react-icons/fa';
import { useUser } from '../../context/UserContext';
import Swal from 'sweetalert2';

function Profile() {
    const { user, updateUser, addPet, updatePet, deletePet } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: ''
    });
    const [newPet, setNewPet] = useState({ name: '', type: '', breed: '', age: '' });
    const [showPetForm, setShowPetForm] = useState(false);
    const [editingPet, setEditingPet] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setEditData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || ''
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handlePetInputChange = (e) => {
        const { name, value } = e.target;
        if (editingPet) {
            setEditingPet(prev => ({ ...prev, [name]: value }));
        } else {
            setNewPet(prev => ({ ...prev, [name]: value }));
        }
    };

    const saveProfile = async () => {
        try {
            const result = await updateUser(editData);
            if (result.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Profile Updated',
                    text: 'Your profile has been updated successfully!',
                    timer: 2000,
                    showConfirmButton: false
                });
                setIsEditing(false);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Update Failed',
                    text: result.error || 'Failed to update profile. Please try again.'
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while updating your profile.'
            });
        }
    };

    const handleAddPet = async () => {
        if (!newPet.name || !newPet.type) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Pet name and type are required'
            });
            return;
        }

        try {
            const result = await addPet(newPet);
            if (result.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Pet Added',
                    text: 'Your pet has been added successfully!',
                    timer: 2000,
                    showConfirmButton: false
                });
                setNewPet({ name: '', type: '', breed: '', age: '' });
                setShowPetForm(false);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: result.error || 'Failed to add pet. Please try again.'
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while adding your pet.'
            });
        }
    };

    const handleUpdatePet = async () => {
        if (!editingPet.name || !editingPet.type) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Pet name and type are required'
            });
            return;
        }

        try {
            const result = await updatePet(editingPet._id, editingPet);
            if (result.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Pet Updated',
                    text: 'Your pet has been updated successfully!',
                    timer: 2000,
                    showConfirmButton: false
                });
                setEditingPet(null);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: result.error || 'Failed to update pet. Please try again.'
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while updating your pet.'
            });
        }
    };

    const handleDeletePet = async (petId) => {
        try {
            await deletePet(petId);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while deleting your pet.'
            });
        }
    };

    const startEditing = () => {
        setEditData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: user.phone || '',
            address: user.address || ''
        });
        setIsEditing(true);
    };

    const startEditingPet = (pet) => {
        setEditingPet({ ...pet });
        setShowPetForm(true);
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-blue-200 h-48 relative">
                        <div className="absolute -bottom-16 left-6">
                            <div className="relative">
                                <FaUserCircle className="h-32 w-32 text-gray-400 border-4 border-white rounded-full shadow-2xl" />
                                <button
                                    onClick={startEditing}
                                    className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
                                >
                                    <FiEdit className="text-black" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-20 px-6 pb-6">
                        {!isEditing ? (
                            <>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900">
                                            {user.firstName} {user.lastName}
                                        </h1>
                                        <div className="flex items-center mt-2 text-gray-600">
                                            <FiMail className="mr-2" />
                                            <p>{user.email}</p>
                                        </div>
                                        {user.phone && (
                                            <div className="flex items-center mt-1 text-gray-600">
                                                <FiUser className="mr-2" />
                                                <p>{user.phone}</p>
                                            </div>
                                        )}
                                        {user.address && (
                                            <p className="mt-1 text-gray-600">{user.address}</p>
                                        )}
                                    </div>
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => navigate('/appointment')}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition flex items-center cursor-pointer hover:bg-blue-700"
                                        >
                                            <FiCalendar className="mr-2" />
                                            Book Appointment
                                        </button>
                                        <button
                                            onClick={() => navigate('/book-service')}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition flex items-center cursor-pointer hover:bg-blue-700"
                                        >
                                            <FiPlusCircle className="mr-2" />
                                            Book Service
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={editData.firstName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={editData.lastName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={editData.email}
                                            disabled
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={editData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={editData.address}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={saveProfile}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Pets Section */}
                        <div className="mt-12">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-900">My Pets</h2>
                                <button
                                    onClick={() => {
                                        setEditingPet(null);
                                        setNewPet({ name: '', type: '', breed: '', age: '' });
                                        setShowPetForm(!showPetForm);
                                    }}
                                    className="flex items-center text-blue-700 font-medium"
                                >
                                    <FiPlus className="mr-1" /> Add Pet
                                </button>
                            </div>

                            {showPetForm && (
                                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                    <h3 className="text-lg font-medium mb-4">
                                        {editingPet ? 'Edit Pet' : 'Add New Pet'}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={editingPet ? editingPet.name : newPet.name}
                                                onChange={handlePetInputChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                            <input
                                                type="text"
                                                name="type"
                                                value={editingPet ? editingPet.type : newPet.type}
                                                onChange={handlePetInputChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
                                            <input
                                                type="text"
                                                name="breed"
                                                value={editingPet ? editingPet.breed : newPet.breed}
                                                onChange={handlePetInputChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                                            <input
                                                type="number"
                                                name="age"
                                                value={editingPet ? editingPet.age : newPet.age}
                                                onChange={handlePetInputChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end space-x-3 mt-4">
                                        <button
                                            onClick={() => {
                                                setShowPetForm(false);
                                                setEditingPet(null);
                                            }}
                                            className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={editingPet ? handleUpdatePet : handleAddPet}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                                        >
                                            {editingPet ? 'Update Pet' : 'Add Pet'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {user.pets && user.pets.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {user.pets.map((pet) => (
                                        <div key={pet._id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-xl text-gray-900">{pet.name}</h3>
                                                    <p className="text-gray-600">{pet.type} • {pet.breed}</p>
                                                    <p className="text-gray-600 mt-1">Age: {pet.age} years</p>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => startEditingPet(pet)}
                                                        className="text-blue-700 p-1 hover:bg-blue-50 rounded-full transition"
                                                    >
                                                        <FiEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeletePet(pet._id)}
                                                        className="text-red-700 p-1 hover:bg-red-50 rounded-full transition"
                                                    >
                                                        <FiTrash2 />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-gray-50 rounded-xl p-8 text-center">
                                    <p className="text-gray-500">You haven't added any pets yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;