import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    getAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment
} from '../controllers/appointmentController.js';

const router = express.Router();

// All routes are protected and require authentication
router.use(protect);

// Get all appointments for the logged-in user
router.get('/', getAppointments);

// Create a new appointment
router.post('/', createAppointment);

// Update an appointment
router.put('/:id', updateAppointment);

// Delete an appointment
router.delete('/:id', deleteAppointment);

export default router; 