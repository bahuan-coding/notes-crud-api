const request = require('supertest');
const { v4: uuidv4 } = require('uuid');
const app = require('../src/app');
const notesService = require('../src/services/notesService');

/**
 * Senior-Level Test Suite for Notes CRUD API
 * 
 * Testing Philosophy:
 * - Each test validates specific behavior, not just status codes
 * - Error cases verify complete error response structure
 * - Edge cases cover boundary conditions and input validation
 * - Helper functions eliminate code duplication
 * - Tests are organized by endpoint with clear separation of concerns
 */

describe('Notes CRUD API', () => {
  // Test helpers to reduce duplication and improve readability
  const createTestNote = (title = 'Test Note', content = 'Test Content') => {
    return notesService.createNote(title, content);
  };

  const expectSuccessResponse = (response, expectedMessage) => {
    expect(response.body).toMatchObject({
      success: true,
      message: expectedMessage
    });
    expect(response.body.data).toBeDefined();
  };

  const expectValidationError = (response, expectedMessage) => {
    expect(response.body).toMatchObject({
      success: false,
      error: 'Validation Error',
      message: expect.stringContaining(expectedMessage)
    });
    expect(response.body.data).toBeUndefined();
  };

  const expectNotFoundError = (response) => {
    expect(response.body).toMatchObject({
      success: false,
      error: 'Not Found',
      message: 'Note not found'
    });
    expect(response.body.data).toBeUndefined();
  };

  const expectNoteStructure = (note) => {
    expect(note).toMatchObject({
      id: expect.any(String),
      title: expect.any(String),
      content: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    });
    // Validate UUID format
    expect(note.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    // Validate ISO date format
    expect(new Date(note.createdAt).toISOString()).toBe(note.createdAt);
    expect(new Date(note.updatedAt).toISOString()).toBe(note.updatedAt);
  };

  describe('POST /notes - Create Note', () => {
    const validNoteData = { title: 'Integration Test', content: 'Test note content' };

    describe('Success Cases', () => {
      it('should create note with valid data and return complete note object', async () => {
        const response = await request(app)
          .post('/notes')
          .send(validNoteData)
          .expect(201);

        expectSuccessResponse(response, 'Note created successfully');
        expectNoteStructure(response.body.data);
        
        expect(response.body.data).toMatchObject({
          title: validNoteData.title,
          content: validNoteData.content
        });
        
        // Verify timestamps are equal for new notes
        expect(response.body.data.createdAt).toBe(response.body.data.updatedAt);
      });

      it('should trim whitespace from title and content', async () => {
        const dataWithWhitespace = {
          title: '  Whitespace Test  ',
          content: '  Content with spaces  '
        };

        const response = await request(app)
          .post('/notes')
          .send(dataWithWhitespace)
          .expect(201);

        expect(response.body.data.title).toBe('Whitespace Test');
        expect(response.body.data.content).toBe('Content with spaces');
      });
    });

    describe('Validation Failures', () => {
      it('should reject empty request body', async () => {
        const response = await request(app)
          .post('/notes')
          .send({})
          .expect(400);

        expect(response.body).toMatchObject({
          success: false,
          error: 'Bad Request',
          message: 'Request body is required'
        });
      });

      it('should reject missing title', async () => {
        const response = await request(app)
          .post('/notes')
          .send({ content: 'Content without title' })
          .expect(400);

        expectValidationError(response, 'Title is required');
      });

      it('should reject missing content', async () => {
        const response = await request(app)
          .post('/notes')
          .send({ title: 'Title without content' })
          .expect(400);

        expectValidationError(response, 'Content is required');
      });

      it('should reject non-string title', async () => {
        const response = await request(app)
          .post('/notes')
          .send({ title: 123, content: 'Valid content' })
          .expect(400);

        expectValidationError(response, 'Title is required and must be a non-empty string');
      });

      it('should reject non-string content', async () => {
        const response = await request(app)
          .post('/notes')
          .send({ title: 'Valid title', content: ['array', 'content'] })
          .expect(400);

        expectValidationError(response, 'Content is required and must be a non-empty string');
      });

      it('should reject whitespace-only title', async () => {
        const response = await request(app)
          .post('/notes')
          .send({ title: '   ', content: 'Valid content' })
          .expect(400);

        expectValidationError(response, 'Title is required and must be a non-empty string');
      });

      it('should reject whitespace-only content', async () => {
        const response = await request(app)
          .post('/notes')
          .send({ title: 'Valid title', content: '\t\n  ' })
          .expect(400);

        expectValidationError(response, 'Content is required and must be a non-empty string');
      });

      it('should reject title exceeding 200 characters', async () => {
        const longTitle = 'a'.repeat(201);
        const response = await request(app)
          .post('/notes')
          .send({ title: longTitle, content: 'Valid content' })
          .expect(400);

        expectValidationError(response, 'Title must be 200 characters or less');
      });

      it('should reject content exceeding 5000 characters', async () => {
        const longContent = 'a'.repeat(5001);
        const response = await request(app)
          .post('/notes')
          .send({ title: 'Valid title', content: longContent })
          .expect(400);

        expectValidationError(response, 'Content must be 5000 characters or less');
      });
    });

    describe('Boundary Cases', () => {
      it('should accept title at 200 character limit', async () => {
        const maxTitle = 'a'.repeat(200);
        const response = await request(app)
          .post('/notes')
          .send({ title: maxTitle, content: 'Valid content' })
          .expect(201);

        expect(response.body.data.title).toBe(maxTitle);
      });

      it('should accept content at 5000 character limit', async () => {
        const maxContent = 'a'.repeat(5000);
        const response = await request(app)
          .post('/notes')
          .send({ title: 'Valid title', content: maxContent })
          .expect(201);

        expect(response.body.data.content).toBe(maxContent);
      });
    });
  });

  describe('GET /notes - List All Notes', () => {
    describe('Success Cases', () => {
      it('should return empty collection when no notes exist', async () => {
        const response = await request(app)
          .get('/notes')
          .expect(200);

        expect(response.body).toMatchObject({
          success: true,
          data: [],
          count: 0,
          message: 'Notes retrieved successfully'
        });
      });

      it('should return all notes with correct count and structure', async () => {
        const note1 = createTestNote('First Note', 'First Content');
        const note2 = createTestNote('Second Note', 'Second Content');

        const response = await request(app)
          .get('/notes')
          .expect(200);

        expectSuccessResponse(response, 'Notes retrieved successfully');
        expect(response.body.count).toBe(2);
        expect(response.body.data).toHaveLength(2);
        
        response.body.data.forEach(note => expectNoteStructure(note));
        
        // Verify notes are returned in creation order
        expect(response.body.data[0].id).toBe(note1.id);
        expect(response.body.data[1].id).toBe(note2.id);
      });

      it('should return notes with complete data integrity', async () => {
        const originalNote = createTestNote('Data Integrity Test', 'Original content');

        const response = await request(app)
          .get('/notes')
          .expect(200);

        const returnedNote = response.body.data[0];
        expect(returnedNote).toMatchObject({
          id: originalNote.id,
          title: originalNote.title,
          content: originalNote.content,
          createdAt: originalNote.createdAt,
          updatedAt: originalNote.updatedAt
        });
      });
    });
  });

  describe('GET /notes/:id - Get Specific Note', () => {
    describe('Success Cases', () => {
      it('should return specific note with complete structure', async () => {
        const note = createTestNote('Specific Note', 'Specific Content');

        const response = await request(app)
          .get(`/notes/${note.id}`)
          .expect(200);

        expectSuccessResponse(response, 'Note retrieved successfully');
        expectNoteStructure(response.body.data);
        expect(response.body.data).toMatchObject({
          id: note.id,
          title: 'Specific Note',
          content: 'Specific Content'
        });
      });
    });

    describe('Error Cases', () => {
      it('should return 404 for non-existent UUID', async () => {
        const validUuid = uuidv4();
        const response = await request(app)
          .get(`/notes/${validUuid}`)
          .expect(404);

        expectNotFoundError(response);
      });

      it('should return 404 for invalid ID format', async () => {
        const response = await request(app)
          .get('/notes/invalid-id-format')
          .expect(404);

        expectNotFoundError(response);
      });

      it('should return 404 for malformed ID parameter', async () => {
        const response = await request(app)
          .get('/notes/123-invalid-uuid')
          .expect(404);

        expectNotFoundError(response);
      });
    });
  });

  describe('PUT /notes/:id - Update Note', () => {
    describe('Success Cases', () => {
      it('should update both title and content with timestamp change', async () => {
        const note = createTestNote('Original Title', 'Original Content');
        const originalUpdatedAt = note.updatedAt;
        
        // Ensure timestamp difference
        await new Promise(resolve => setTimeout(resolve, 10));
        
        const updateData = { title: 'Updated Title', content: 'Updated Content' };
        const response = await request(app)
          .put(`/notes/${note.id}`)
          .send(updateData)
          .expect(200);

        expectSuccessResponse(response, 'Note updated successfully');
        expect(response.body.data).toMatchObject({
          id: note.id,
          title: 'Updated Title',
          content: 'Updated Content',
          createdAt: note.createdAt
        });
        expect(response.body.data.updatedAt).not.toBe(originalUpdatedAt);
      });

      it('should update only title when content omitted', async () => {
        const note = createTestNote('Original Title', 'Original Content');
        
        const response = await request(app)
          .put(`/notes/${note.id}`)
          .send({ title: 'Only Title Updated' })
          .expect(200);

        expect(response.body.data).toMatchObject({
          title: 'Only Title Updated',
          content: 'Original Content'
        });
      });

      it('should update only content when title omitted', async () => {
        const note = createTestNote('Original Title', 'Original Content');
        
        const response = await request(app)
          .put(`/notes/${note.id}`)
          .send({ content: 'Only Content Updated' })
          .expect(200);

        expect(response.body.data).toMatchObject({
          title: 'Original Title',
          content: 'Only Content Updated'
        });
      });

      it('should trim whitespace in updated fields', async () => {
        const note = createTestNote('Original Title', 'Original Content');
        
        const response = await request(app)
          .put(`/notes/${note.id}`)
          .send({ title: '  Trimmed Title  ', content: '  Trimmed Content  ' })
          .expect(200);

        expect(response.body.data.title).toBe('Trimmed Title');
        expect(response.body.data.content).toBe('Trimmed Content');
      });
    });

    describe('Validation Failures', () => {
      it('should reject empty update object', async () => {
        const note = createTestNote();
        
        const response = await request(app)
          .put(`/notes/${note.id}`)
          .send({})
          .expect(400);

        expect(response.body).toMatchObject({
          success: false,
          error: 'Bad Request',
          message: expect.stringContaining('At least one field')
        });
      });

      it('should reject null values', async () => {
        const note = createTestNote();
        
        const response = await request(app)
          .put(`/notes/${note.id}`)
          .send({ title: null, content: null })
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('At least one field');
      });

      it('should handle whitespace-only updates by trimming', async () => {
        const note = createTestNote('Original', 'Original');
        
        const response = await request(app)
          .put(`/notes/${note.id}`)
          .send({ title: '   Updated   ', content: '\t\nUpdated Content\n  ' })
          .expect(200);

        expect(response.body.data.title).toBe('Updated');
        expect(response.body.data.content).toBe('Updated Content');
      });
    });

    describe('Error Cases', () => {
      it('should return 404 for non-existent note', async () => {
        const validUuid = uuidv4();
        const response = await request(app)
          .put(`/notes/${validUuid}`)
          .send({ title: 'Updated Title' })
          .expect(404);

        expectNotFoundError(response);
      });

      it('should return 404 for invalid ID format', async () => {
        const response = await request(app)
          .put('/notes/invalid-id')
          .send({ title: 'Updated Title' })
          .expect(404);

        expectNotFoundError(response);
      });
    });
  });

  describe('DELETE /notes/:id - Delete Note', () => {
    describe('Success Cases', () => {
      it('should delete note and return deleted note data', async () => {
        const note = createTestNote('To Delete', 'Delete Content');
        const initialCount = notesService.getNotesCount();

        const response = await request(app)
          .delete(`/notes/${note.id}`)
          .expect(200);

        expectSuccessResponse(response, 'Note deleted successfully');
        expect(response.body.data).toMatchObject({
          id: note.id,
          title: 'To Delete',
          content: 'Delete Content'
        });
        
        // Verify actual deletion
        expect(notesService.getNotesCount()).toBe(initialCount - 1);
      });

      it('should maintain data integrity after deletion', async () => {
        const note1 = createTestNote('Keep Note 1', 'Content 1');
        const note2 = createTestNote('Delete Note', 'Content to delete');
        const note3 = createTestNote('Keep Note 3', 'Content 3');

        await request(app)
          .delete(`/notes/${note2.id}`)
          .expect(200);

        const listResponse = await request(app)
          .get('/notes')
          .expect(200);

        expect(listResponse.body.count).toBe(2);
        const remainingIds = listResponse.body.data.map(note => note.id);
        expect(remainingIds).toContain(note1.id);
        expect(remainingIds).toContain(note3.id);
        expect(remainingIds).not.toContain(note2.id);
      });
    });

    describe('Error Cases', () => {
      it('should return 404 for non-existent note', async () => {
        const validUuid = uuidv4();
        const response = await request(app)
          .delete(`/notes/${validUuid}`)
          .expect(404);

        expectNotFoundError(response);
      });

      it('should return 404 for invalid ID format', async () => {
        const response = await request(app)
          .delete('/notes/invalid-id-format')
          .expect(404);

        expectNotFoundError(response);
      });

      it('should not affect other notes when delete fails', async () => {
        const existingNote = createTestNote('Existing Note', 'Should remain');
        const initialCount = notesService.getNotesCount();

        await request(app)
          .delete('/notes/non-existent-id')
          .expect(404);

        expect(notesService.getNotesCount()).toBe(initialCount);
        
        // Verify existing note is unchanged
        const response = await request(app)
          .get(`/notes/${existingNote.id}`)
          .expect(200);
        
        expect(response.body.data.title).toBe('Existing Note');
      });
    });
  });

  describe('Error Handling & Edge Cases', () => {
    it('should handle malformed JSON with proper error response', async () => {
      const response = await request(app)
        .post('/notes')
        .set('Content-Type', 'application/json')
        .send('{ "title": "Invalid JSON" "content": "missing comma" }')
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: 'Bad Request',
        message: expect.stringContaining('Invalid JSON')
      });
    });

    it('should return 404 for non-existent API routes', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .expect(404);

      expect(response.body).toMatchObject({
        error: 'Not Found',
        message: expect.stringContaining('Route /api/nonexistent not found')
      });
    });

    it('should handle unsupported HTTP methods on notes endpoints', async () => {
      const response = await request(app)
        .patch('/notes')
        .expect(404);

      expect(response.body.error).toBe('Not Found');
    });

    it('should maintain API consistency during concurrent operations', async () => {
      // Create multiple notes concurrently
      const promises = Array.from({ length: 5 }, (_, i) =>
        request(app)
          .post('/notes')
          .send({ title: `Concurrent Note ${i}`, content: `Content ${i}` })
      );

      const responses = await Promise.all(promises);
      
      // Verify all were created successfully
      responses.forEach(response => {
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
      });

      // Verify final state
      const listResponse = await request(app)
        .get('/notes')
        .expect(200);
      
      expect(listResponse.body.count).toBe(5);
      expect(listResponse.body.data).toHaveLength(5);
    });

    it('should handle content length at exact boundary', async () => {
      const response = await request(app)
        .post('/notes')
        .send({ title: 'Boundary Test', content: 'x'.repeat(5001) })
        .expect(400);

      expectValidationError(response, 'Content must be 5000 characters or less');
    });

    it('should preserve createdAt when updating notes', async () => {
      const note = createTestNote('Original', 'Content');
      const originalCreatedAt = note.createdAt;
      
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const response = await request(app)
        .put(`/notes/${note.id}`)
        .send({ title: 'Updated' })
        .expect(200);

      expect(response.body.data.createdAt).toBe(originalCreatedAt);
      expect(response.body.data.updatedAt).not.toBe(originalCreatedAt);
    });

    it('should handle service errors gracefully', async () => {
      // Test error handling by causing a service error
      const originalCreateNote = notesService.createNote;
      notesService.createNote = () => {
        throw new Error('Service temporarily unavailable');
      };

      const response = await request(app)
        .post('/notes')
        .send({ title: 'Test', content: 'Test' })
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Internal Server Error');

      // Restore original method
      notesService.createNote = originalCreateNote;
    });
  });

  describe('Health Check', () => {
    it('should return health status with timestamp', async () => {
      const beforeTime = new Date().toISOString();
      
      const response = await request(app)
        .get('/health')
        .expect(200);

      const afterTime = new Date().toISOString();

      expect(response.body).toMatchObject({
        status: 'OK',
        timestamp: expect.any(String)
      });

      // Verify timestamp is valid and within reasonable range
      const timestamp = new Date(response.body.timestamp);
      expect(timestamp.toISOString()).toBe(response.body.timestamp);
      expect(new Date(response.body.timestamp).getTime()).toBeGreaterThanOrEqual(new Date(beforeTime).getTime());
      expect(new Date(response.body.timestamp).getTime()).toBeLessThanOrEqual(new Date(afterTime).getTime());
    });
  });
});