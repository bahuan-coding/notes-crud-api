/**
 * Server Integration Tests
 * Tests server configuration and middleware
 */

const request = require('supertest');
const app = require('../src/app');

describe('Server Integration', () => {

  it('should handle CORS preflight requests', async () => {
    const response = await request(app)
      .options('/notes')
      .expect(204);
    
    expect(response.headers['access-control-allow-origin']).toBe('*');
  });

  it('should parse JSON request bodies', async () => {
    const response = await request(app)
      .post('/notes')
      .send({ title: 'JSON Test', content: 'Testing JSON parsing' })
      .expect(201);
    
    expect(response.body.data.title).toBe('JSON Test');
  });

  it('should handle URL-encoded request bodies', async () => {
    const response = await request(app)
      .post('/notes')
      .send('title=URL+Test&content=Testing+URL+encoding')
      .expect(201);
    
    expect(response.body.data.title).toBe('URL Test');
    expect(response.body.data.content).toBe('Testing URL encoding');
  });

  it('should enforce request size limits', async () => {
    // Test with content at the limit (5000 chars)
    const maxContent = 'a'.repeat(5000);
    const response = await request(app)
      .post('/notes')
      .send({ title: 'Size Test', content: maxContent })
      .expect(201);
    
    expect(response.body.data.content).toHaveLength(5000);
  });
});