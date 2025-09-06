const express = require('express');
const notesService = require('../services/notesService');
const validateNote = require('../middleware/validateNote');

const router = express.Router();

// POST /notes - Create a new note
router.post('/', validateNote, async(req, res, next) => {
  try {
    const { title, content } = req.body;
    const note = notesService.createNote(title, content);

    res.status(201).json({
      success: true,
      data: note,
      message: 'Note created successfully'
    });
  } catch (error) {
    next(error);
  }
});

// GET /notes - Retrieve all notes
router.get('/', async(req, res, next) => {
  try {
    const notes = notesService.getAllNotes();

    res.status(200).json({
      success: true,
      data: notes,
      count: notes.length,
      message: 'Notes retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
});

// GET /notes/:id - Retrieve a specific note
router.get('/:id', async(req, res, next) => {
  try {
    const { id } = req.params;
    const note = notesService.getNoteById(id);

    res.status(200).json({
      success: true,
      data: note,
      message: 'Note retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
});

// PUT /notes/:id - Update a note
router.put('/:id', async(req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const updatedNote = notesService.updateNote(id, title, content);

    res.status(200).json({
      success: true,
      data: updatedNote,
      message: 'Note updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /notes/:id - Remove a note
router.delete('/:id', async(req, res, next) => {
  try {
    const { id } = req.params;
    const deletedNote = notesService.deleteNote(id);

    res.status(200).json({
      success: true,
      data: deletedNote,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
