const mongoose = require('mongoose');

// You need to define the schema for a reservation
const ReservationSchema = new mongoose.Schema({
    // The fields you require are:
    // associated user
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // roomType (options are 'single bed', 'double bed', 'queen', 'king')
    roomType: {
        type: String,
        enum: ['single bed', 'double bed', 'queen', 'king'],
        default: 'single bed',
        required: true
    },
    // checkIn (just date, not time)
    checkIn: {
        type: String,
        required: true
    },
    // checkOut (just date, not time)
    checkOut: {
        type: String,
        required: true
    },
    // numOfOccupants (number of occupants)
    numOfOccupants: {
        type: Number,
        required: true
    }
}, {
        timestamps: true
    });

module.exports = mongoose.model('Reservation', ReservationSchema);