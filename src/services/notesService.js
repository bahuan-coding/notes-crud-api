const Note = require('../models/Note');

class NotesService {
  constructor() {
    this.notes = [];
  }

  createNote(title, content) {
    if (!title || !content) {
      throw new Error('Title and content are required');
    }

    const note = new Note(title.trim(), content.trim());
    this.notes.push(note);
    return note;
  }

  getAllNotes() {
    return this.notes.map(note => note.toJSON());
  }

  getNoteById(id) {
    const note = this.notes.find(note => note.id === id);
    if (!note) {
      throw new Error('Note not found');
    }
    return note.toJSON();
  }

  updateNote(id, title, content) {
    const note = this.notes.find(note => note.id === id);
    if (!note) {
      throw new Error('Note not found');
    }

    if (!title && !content) {
      throw new Error('At least one field (title or content) must be provided');
    }

    note.update(title?.trim(), content?.trim());
    return note.toJSON();
  }

  deleteNote(id) {
    const noteIndex = this.notes.findIndex(note => note.id === id);
    if (noteIndex === -1) {
      throw new Error('Note not found');
    }

    const deletedNote = this.notes.splice(noteIndex, 1)[0];
    return deletedNote.toJSON();
  }

  // Utility method for testing
  clearAllNotes() {
    this.notes = [];
  }

  // Get notes count
  getNotesCount() {
    return this.notes.length;
  }
}

// Create singleton instance
const notesService = new NotesService();

module.exports = notesService;
