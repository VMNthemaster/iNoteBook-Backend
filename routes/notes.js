const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');
const { findByIdAndUpdate, findOne, findById } = require('../models/Note');


//ROUTE 1: get all the notes details using get "/api/notes/getuser". Login required
router.get('/fetchallnotes', async (req, res) => {
    try {
        // const notes = await Note.find({ user: req.user.id });
        const notes = {
            a: "hi"
        }
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
      }
});

//ROUTE 2: add a new note using POST "/api/notes/addnote". Login required
router.post('/addnote', fetchuser, [
    body('title', "Title must be at least 3 characters").isLength({ min: 3 }),
    body('description', "Title must be at least 5 characters").isLength({ min: 5 }),
], async (req, res) => {
    try {


        const { title, description, tag } = req.body;

        // if there are errors return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        };

        // else create a new note
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save()

        res.json(savedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
      }
});

//ROUTE 3: update an existing note using put "/api/notes/upatenote/:id". Login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const {title, description, tag} = req.body;
    try {
        // Create a newNote object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        // Find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


//ROUTE 4: update an existing note using DELETE "/api/notes/deletenote/:id". Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to be deleted and delete it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        // Alllow deletoin only if user owns this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Note.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Note Deleted", note: note  });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/newroute', (req, res) => {
    res.json({msg: "aaa"})
})

module.exports = router;