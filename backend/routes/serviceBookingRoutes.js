import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    createBooking,
    getUserBookings,
    getBooking,
    updateBooking,
    deleteBooking,
    getAllBookings,
    updateBookingStatus
} from '../controllers/serviceBookingController.js';

const router = express.Router();

// User routes
router.post('/book', protect, createBooking);
router.get('/my-bookings', protect, getUserBookings);
router.get('/:id', protect, getBooking);
router.put('/:id', protect, updateBooking);
router.delete('/:id', protect, deleteBooking);
router.get('/', protect, getAllBookings);
router.put('/:id/status', protect, updateBookingStatus);

export default router;