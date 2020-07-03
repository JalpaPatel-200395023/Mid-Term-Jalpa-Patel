// You need to complete this controller with the required 7 actions
const viewPath = 'reservations';
const Reservation = require('../models/reservation');
const User = require('../models/user');

exports.index = async (req, res) => {
    try {
        const reservations = await Reservation
            .find()
            .populate('user')
            .sort({ updatedAt: 'desc' });

        res.render(`${viewPath}/index`, {
            pageTitle: 'New Reservation',
            reservations: reservations
        });
    } catch (error) {
        req.flash('danger', `There was an error displaying the reservations: ${error}`);
        res.redirect('/');
    }
};

exports.show = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id)
            .populate('user');
        console.log(reservation);
        res.render(`${viewPath}/show`, {
            pageTitle: 'Reservation',
            reservation: reservation
        });
    } catch (error) {
        req.flash('danger', `There was an error displaying this reservation: ${error}`);
        res.redirect('/');
    }
};

exports.new = (req, res) => {
    //got solution From Slack : Thanks Shaun
    const roomTypes = Reservation.schema.paths.roomType.enumValues;
    res.render(`${viewPath}/new`, {
        pageTitle: 'New Reservation',
        roomTypes: roomTypes
    });
};

exports.create = async (req, res) => {
    try {
        console.log(req.session.passport);
        const { user: email } = req.session.passport;
        const user = await User.findOne({ email: email });
        console.log('User', user);
        const reservation = await Reservation.create({ user: user._id, ...req.body });

        req.flash('success', 'Your reservation was created successfully.');
        res.redirect(`/reservations/${reservation.id}`);
    } catch (error) {
        req.flash('danger', `There was an error creating this reservation: ${error}`);
        req.session.formData = req.body;
        res.redirect('/reservations/new');
    }
};

exports.edit = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        const roomTypes = Reservation.schema.paths.roomType.enumValues;
        res.render(`${viewPath}/edit`, {
            pageTitle: 'Reservation',
            formData: reservation,
            roomTypes: roomTypes
        });
    } catch (error) {
        req.flash('danger', `There was an error accessing this reservation: ${error}`);
        res.redirect('/');
    }
};

exports.update = async (req, res) => {
    try {
        const { user: email } = req.session.passport;
        const user = await User.findOne({ email: email });

        let reservation = await Reservation.findById(req.body.id);
        if (!reservation) throw new Error('Reservation could not be found');

        const attributes = { user: user._id, ...req.body };
        await Reservation.validate(attributes);
        await Reservation.findByIdAndUpdate(attributes.id, attributes);

        req.flash('success', 'The Reservation was updated successfully');
        res.redirect(`/reservations/${req.body.id}`);
    } catch (error) {
        req.flash('danger', `There was an error updating this reservation: ${error}`);
        res.redirect(`/reservations/${req.body.id}/edit`);
    }
};

exports.delete = async (req, res) => {
    try {
        console.log(req.body);
        await Reservation.deleteOne({ _id: req.body.id });
        req.flash('success', 'The reservation was deleted successfully');
        res.redirect(`/reservations`);
    } catch (error) {
        req.flash('danger', `There was an error deleting this reservation: ${error}`);
        res.redirect(`/reservations`);
    }
};