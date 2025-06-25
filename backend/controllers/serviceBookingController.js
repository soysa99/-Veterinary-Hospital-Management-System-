import asyncHandler from 'express-async-handler';
import ServiceBooking from '../models/serviceBookingModel.js';
import User from '../models/userModel.js';

// @desc    Create a new service booking
// @route   POST /api/services/book
// @access  Private
export const createBooking = asyncHandler(async (req, res) => {
    const { pet, serviceType, date, time, address, notes, price } = req.body;

    // Validate pet exists for the user
    const user = await User.findById(req.user._id);
    const petExists = user.pets.some(p => p._id.toString() === pet);

    if (!petExists) {
        res.status(400);
        throw new Error('Pet not found');
    }

    const booking = await ServiceBooking.create({
        user: req.user._id,
        pet,
        serviceType,
        date,
        time,
        address,
        notes,
        price
    });

    res.status(201).json(booking);
});

// @desc    Get all bookings for a user
// @route   GET /api/services/my-bookings
// @access  Private
export const getUserBookings = asyncHandler(async (req, res) => {
    const bookings = await ServiceBooking.find({ user: req.user._id })
        .populate('user', 'firstName lastName email')
        .populate('pet', 'name type breed age')
        .sort({ date: -1 });

    res.json(bookings);
});

// @desc    Get a single booking
// @route   GET /api/services/:id
// @access  Private
export const getBooking = asyncHandler(async (req, res) => {
    const booking = await ServiceBooking.findById(req.params.id)
        .populate('user', 'firstName lastName email phone pets');

    if (!booking) {
        res.status(404);
        throw new Error('Booking not found');
    }

    // Transform the data to include pet information
    const bookingObj = booking.toObject();
    if (bookingObj.user && bookingObj.user.pets) {
        const pet = bookingObj.user.pets.find(p => p._id.toString() === bookingObj.pet);
        if (pet) {
            bookingObj.petDetails = {
                name: pet.name,
                type: pet.type,
                breed: pet.breed,
                age: pet.age
            };
        }
    }

    res.json(bookingObj);
});

// @desc    Update a booking
// @route   PUT /api/services/:id
// @access  Private
export const updateBooking = asyncHandler(async (req, res) => {
    const booking = await ServiceBooking.findById(req.params.id);

    if (!booking) {
        res.status(404);
        throw new Error('Booking not found');
    }

    const { pet, serviceType, date, time, address, notes, price, status } = req.body;

    // Update fields
    if (pet) booking.pet = pet;
    if (serviceType) booking.serviceType = serviceType;
    if (date) booking.date = date;
    if (time) booking.time = time;
    if (address) booking.address = address;
    if (notes !== undefined) booking.notes = notes;
    if (price) booking.price = price;
    if (status) booking.status = status;

    const updatedBooking = await booking.save();

    res.json(updatedBooking);
});

// @desc    Delete a booking
// @route   DELETE /api/services/:id
// @access  Private
export const deleteBooking = asyncHandler(async (req, res) => {
    const booking = await ServiceBooking.findById(req.params.id);

    if (!booking) {
        res.status(404);
        throw new Error('Booking not found');
    }

    await booking.deleteOne();
    res.json({ message: 'Booking removed' });
});

// @desc    Get all bookings
// @route   GET /api/services
// @access  Private
export const getAllBookings = asyncHandler(async (req, res) => {
    const bookings = await ServiceBooking.find({})
        .populate('user', 'firstName lastName email phone pets')
        .sort({ date: -1 });

    // Transform the data to include pet information
    const transformedBookings = bookings.map(booking => {
        const bookingObj = booking.toObject();
        if (bookingObj.user && bookingObj.user.pets) {
            const pet = bookingObj.user.pets.find(p => p._id.toString() === bookingObj.pet);
            if (pet) {
                bookingObj.petDetails = {
                    name: pet.name,
                    type: pet.type,
                    breed: pet.breed,
                    age: pet.age
                };
            }
        }
        return bookingObj;
    });

    res.json(transformedBookings);
});

// @desc    Update booking status
// @route   PUT /api/services/:id/status
// @access  Private
export const updateBookingStatus = asyncHandler(async (req, res) => {
    const booking = await ServiceBooking.findById(req.params.id);

    if (!booking) {
        res.status(404);
        throw new Error('Booking not found');
    }

    const { status } = req.body;

    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
        res.status(400);
        throw new Error('Invalid status');
    }

    booking.status = status;
    const updatedBooking = await booking.save();

    res.json(updatedBooking);
});

// @desc    Get service booking stats
// @route   GET /api/services/stats
// @access  Private/Admin
export const getServiceStats = asyncHandler(async (req, res) => {
    const stats = await ServiceBooking.aggregate([
        {
            $group: {
                _id: null,
                totalBookings: { $sum: 1 },
                totalRevenue: { $sum: '$price' },
                averagePrice: { $avg: '$price' }
            }
        }
    ]);

    const serviceStats = await ServiceBooking.aggregate([
        {
            $group: {
                _id: '$serviceId',
                count: { $sum: 1 },
                serviceName: { $first: '$serviceName' }
            }
        },
        { $sort: { count: -1 } }
    ]);

    res.json({
        overall: stats[0],
        byService: serviceStats
    });
});