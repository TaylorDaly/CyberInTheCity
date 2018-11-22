const express = require('express');
const ProgramRouter = express.Router();
const Program = require('../models/Program');

// Get all programs
ProgramRouter.get('/', (req, res) => {
    Program.getAllPrograms((err, program) => {
        if (err) {
            res.json({
                success: false, message: `Failed to get all program.\n
            Error: ${err}`
            })
        }
        else {
            res.json({success: true, program: program})
        }
    })
});


// Add
ProgramRouter.post('/', (req, res, next) => {
    let newProgram = new Program({
        link: req.body.link,
        level: req.body.level,
        department: req.body.department,
        college: req.body.college,
        description: req.body.description,
        photo: req.body.photo,
        title: req.body.title,
        available: req.body.available,
        degree: req.body.degree
    });

    Program.addProgram(newProgram, (err, callback) => {
        if (err) {
            res.json({
                success: false, message: `Failed to add new program.\n
            Error: ${err}`
            })
        }
        else {
            res.json({success: true, message: "Successfully added program."})
        }
    })

});

// Update
ProgramRouter.put('/', (req, res, next) => {
    Program.getProgram(req.body._id, (err, program) => {
        if (err) {
            res.json({
                success: false,
                message: `Attempt to get program failed. Error: ${err}`
            })
        }
        else if (program) {
            if (req.body.link) program.link = req.body.link;
            if (req.body.level) program.level = req.body.level;
            if (req.body.department) program.department = req.body.department;
            if (req.body.college) program.college = req.body.college;
            if (req.body.description) program.description = req.body.description;
            if (req.body.photo) program.photo = req.body.photo;
            if (req.body.title) program.title = req.body.title;
            if (req.body.available) program.available = req.body.available;
            if (req.body.degree) program.degree = req.body.degree;

            Program.updateProgram(req.body._id, program, (err) => {
                if (err) {
                    res.json({
                        success: false,
                        message: `Attempt to update program failed. Error: ${err}`
                    })
                }
                else {
                    res.json({
                        success: true,
                        message: `Update Successful.`,
                        program: program
                    })
                }
            });
        }
        else {
            res.status(404).send({
                success: false,
                message: `404: program does not exist.`
            })
        }
    });
});

ProgramRouter.delete('/:id', (req, res, next) => {
    Program.getProgram(req.params.id, (err, program) => {
        if (err) {
            res.json({
                success: false,
                message: `Attempt to find program failed. Error: ${err}`
            })
        }
        else if (program) {
            Program.deleteProgram(program, (err) => {
                if (err) {
                    res.json({
                        success: false,
                        message: `Attempt to delete program failed. Error: ${err}`
                    })
                }
                else {
                    res.json({
                        success: true,
                        message: `Program deleted successfully.`
                    })
                }
            });
        }
        else {
            res.status(404).send({
                success: false,
                message: `404: Program does not exist.`
            })
        }
    })
});

module.exports = ProgramRouter;