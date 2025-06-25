import mongoose from 'mongoose';

const serviceBookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    pet: {
        type: String,
        required: true
    },
    serviceType: {
        type: String,
        required: true,
        enum: ['Pet Taxi', 'Home Visit', 'Pet Boarding']
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    price: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const ServiceBooking = mongoose.model('ServiceBooking', serviceBookingSchema);
export default ServiceBooking;