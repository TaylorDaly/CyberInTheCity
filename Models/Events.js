const mongoose = require('mongoose');

// Allow admin to edit pages and create pages using a powerful text editor
const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    timeTo: String,
    timeFrom: String,
    url: String,
    location: String,
    eventDate: Date,
    description: String,
});

const events = module.exports = mongoose.model('Event', EventSchema);

module.exports.getAllEvents = (callback) => {
    events.find(callback);
};

module.exports.getEvent = (id, callback) => {
    let query = {_id: id};
    events.findOne(query, callback);
};

module.exports.addEvent = (newEvent, callback) => {
    newEvent.save(callback);
};

module.exports.updateEvent = (id, update, callback) => {
    events.findByIdAndUpdate(id, update, callback);
};

module.exports.deleteEvent = (id, callback) => {
    let query = {_id: id};
    events.deleteOne(query, callback)
};