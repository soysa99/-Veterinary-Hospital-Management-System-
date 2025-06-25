import express from 'express';
import {
    register,
    login,
    getMe,
    updateUser,
    deleteUser,
    getUsers,
    getUserById,
    updateUserByAdmin,
    deleteUserByAdmin,
    createUserByAdmin,
    addPet,
    updatePet,
    deletePet
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/update', protect, updateUser);
router.delete('/delete', protect, deleteUser);

// Pet routes
router.post('/pets', protect, addPet);
router.put('/pets/:petId', protect, updatePet);
router.delete('/pets/:petId', protect, deletePet);

// User management routes
router.route('/users')
    .get(protect, getUsers)
    .post(protect, createUserByAdmin);

router.route('/users/:id')
    .get(protect, getUserById)
    .put(protect, updateUserByAdmin)
    .delete(protect, deleteUserByAdmin);

export default router;