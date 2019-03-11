const express = require('express');
const EventRouter = express.Router();
const Event = require('../Models/Events');
const Auth = require('../Config/AuthController');
const request = require('request');
var schedule = require('node-schedule');

//a scheduler for removing the on campus events
//only allowing for the posting to be active for 30 days
schedule.scheduleJob('0 0 * * *', function(){
    let eraseDay = new Date(new Date().setDate(new Date().getDate() + 1));
    Event.getAllEvents((err, event) => {
        if (err) {
            next(err)
        } else {
            var i;
            for (i = 0; i < event.length; i++) {
                eID = event[i]._id;
                eDate = event[i].eventDate;
                if (eDate < eraseDay) {
                    title = event[i].title;
                    Event.deleteEvent(event[i], (err) => {
                        if (err) {
                            console.log(`[${new Date()}] : ${err}`)
                        } else {
                            console.log(`[${new Date()}] : Successfully removed expired Events. ` + title);
                        }
                    });
                }
            }
        }
    })

});
// Get all Events
EventRouter.get('/', (req, res, next) => {
    Event.find({}).sort({eventDate: 'asc'}).exec((err, events) => {
        if (err) {
            next(err)
        } else {
            res.json(events)
        }
    })
});

// Add
EventRouter.post('/', Auth.VerifyAdmin, (req, res, next) => {
    // let today = new Date();
    let newEvent = new Event({
        title: req.body.title,
        timeTo: req.body.timeTo,
        timeFrom: req.body.timeFrom,
        url: req.body.url,
        location: req.body.location,
        eventDate: req.body.eventDate,
        description: req.body.description
    });

    Event.addEvent(newEvent, (err, callback) => {
        if (err) {
            res.json({
                success: false, message: `Failed to add new event.\n
            Error: ${err}`
            })
        } else {
            res.json({success: true, message: "Successfully added event."})
        }
    })

});

// Update
EventRouter.put('/', Auth.VerifyAdmin, (req, res, next) => {
    Event.getEvent(req.body._id, (err, event) => {
        if (err) {
            res.json({
                success: false,
                message: `Attempt to get event failed. Error: ${err}`
            })
        } else if (event) {
            if (req.body.title) event.title = req.body.title;
            if (req.body.timeTo) event.timeTo = req.body.timeTo;
            if (req.body.timeFrom) event.timeFrom = req.body.timeFrom;
            if (req.body.url) event.url = req.body.url;
            if (req.body.location) event.location = req.body.location;
            if (req.body.eventDate) event.eventDate = req.body.eventDate;
            if (req.body.description) event.description = req.body.description;

            Event.updateEvent(req.body._id, event, (err) => {
                if (err) {
                    res.json({
                        success: false,
                        message: `Attempt to update event failed. Error: ${err}`
                    })
                } else {
                    res.json({
                        success: true,
                        message: `Update Successful.`,
                        event: event
                    })
                }
            });
        } else {
            res.status(404).send({
                success: false,
                message: `404: Event does not exist.`
            })
        }
    });
});

// Delete
EventRouter.delete('/:id', Auth.VerifyAdmin, (req, res, next) => {
    Event.getEvent(req.params.id, (err, event) => {
        if (err) {
            res.json({
                success: false,
                message: `Attempt to find event failed. Error: ${err}`
            })
        } else if (event) {
            Event.deleteEvent(event, (err) => {
                if (err) {
                    res.json({
                        success: false,
                        message: `Attempt to delete event failed. Error: ${err}`
                    })
                } else {
                    res.json({
                        success: true,
                        message: `Event deleted successfully.`
                    })
                }
            });
        } else {
            res.status(404).send({
                success: false,
                message: `404: Event does not exist.`
            })
        }
    })
});

module.exports = EventRouter;