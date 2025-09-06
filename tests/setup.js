// Jest setup file
const notesService = require('../src/services/notesService');

// Set test environment
process.env.NODE_ENV = 'test';

// Clear all notes before each test
beforeEach(() => {
  notesService.clearAllNotes();
});

// Set test timeout
jest.setTimeout(10000);
