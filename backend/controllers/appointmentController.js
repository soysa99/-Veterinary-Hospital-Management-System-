import Appointment from '../models/Appointment.js';
import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';

// @desc    Create a new appointment
// @route   POST /api/appointments
// @access  Private
export const createAppointment = asyncHandler(async (req, res) => {
    try {
        const { pet, service, date, time, notes } = req.body;

        // Validate required fields
        if (!pet || !service || !date || !time) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if the time slot is available
        const existingAppointment = await Appointment.findOne({
            date: new Date(date),
            time,
            status: { $ne: 'cancelled' }
        });

        if (existingAppointment) {
            return res.status(400).json({ message: 'This time slot is already booked' });
        }

        const appointment = new Appointment({
            user: req.user._id,
            pet,
            service,
            date: new Date(date),
            time,
            notes
        });

        const savedAppointment = await appointment.save();
        res.status(201).json(savedAppointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
export const getAppointments = asyncHandler(async (req, res) => {
    try {
        const appointments = await Appointment.find({})
            .populate('user', 'firstName lastName email phone')
            .populate({
                path: 'user',
                select: 'firstName lastName email phone pets',
                populate: {
                    path: 'pets',
                    select: 'name type breed age'
                }
            })
            .sort({ date: 1, time: 1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get a single appointment
// @route   GET /api/appointments/:id
// @access  Private
export const getAppointment = asyncHandler(async (req, res) => {
    const appointment = await Appointment.findById(req.params.id)
        .populate({
            path: 'user',
            select: 'firstName lastName email phone pets',
            populate: {
                path: 'pets',
                select: 'name type breed age'
            }
        });

    if (!appointment) {
        res.status(404);
        throw new Error('Appointment not found');
    }

    res.json(appointment);
});

// @desc    Update an appointment
// @route   PUT /api/appointments/:id
// @access  Private
export const updateAppointment = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const { pet, service, date, time, notes, status } = req.body;

        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Check if the new time slot is available (excluding current appointment)
        if (date && time) {
            const existingAppointment = await Appointment.findOne({
                _id: { $ne: id },
                date: new Date(date),
                time,
                status: { $ne: 'cancelled' }
            });

            if (existingAppointment) {
                return res.status(400).json({ message: 'This time slot is already booked' });
            }
        }

        // Update fields
        if (pet) appointment.pet = pet;
        if (service) appointment.service = service;
        if (date) appointment.date = new Date(date);
        if (time) appointment.time = time;
        if (notes !== undefined) appointment.notes = notes;
        if (status) appointment.status = status;

        const updatedAppointment = await appointment.save();
        res.json(updatedAppointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete an appointment
// @route   DELETE /api/appointments/:id
// @access  Private
export const deleteAppointment = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        await appointment.deleteOne();
        res.json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private
export const updateAppointmentStatus = asyncHandler(async (req, res) => {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
        res.status(404);
        throw new Error('Appointment not found');
    }

    const { status } = req.body;

    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
        res.status(400);
        throw new Error('Invalid status');
    }

    appointment.status = status;
    const updatedAppointment = await appointment.save();

    res.json(updatedAppointment);
}); 