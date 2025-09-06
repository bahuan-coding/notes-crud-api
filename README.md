# Notes CRUD API

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18+-blue.svg)](https://expressjs.com/)
[![Jest](https://img.shields.io/badge/Jest-29+-red.svg)](https://jestjs.io/)
[![Coverage](https://img.shields.io/badge/Coverage-95%25-brightgreen.svg)](#testing)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Professional Node.js REST API for managing notes with comprehensive testing and interview-ready architecture**

A production-quality CRUD API built with Express.js, featuring comprehensive input validation, error handling, and a robust test suite. Designed to demonstrate senior-level backend engineering skills.

## ✨ Features

- **Complete CRUD Operations** - Create, read, update, and delete notes
- **Professional Architecture** - Clean separation of concerns with layered design
- **Comprehensive Validation** - Input sanitization and detailed error messages
- **Robust Error Handling** - Proper HTTP status codes and structured responses
- **High Test Coverage** - 95%+ coverage with 46 comprehensive test cases
- **Code Quality** - ESLint integration with consistent coding standards
- **In-Memory Storage** - No external dependencies, perfect for demos
- **CORS Support** - Ready for frontend integration
- **Health Monitoring** - Built-in health check endpoint

## 🚀 Quick Start

### Prerequisites

- Node.js ≥18.0.0
- npm ≥8.0.0

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd notes-crud-api

# Install dependencies
npm install

# Start the server
npm start
```

The API will be available at `http://localhost:3000`

### Development Mode

```bash
# Start with auto-reload
npm run dev
```

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the production server |
| `npm run dev` | Start development server with auto-reload |
| `npm test` | Run the complete test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Check code quality with ESLint |
| `npm run lint:fix` | Fix ESLint issues automatically |

## 🔗 API Endpoints

### Base URL
```
http://localhost:3000
```

| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| `POST` | `/notes` | Create a new note | `201`, `400` |
| `GET` | `/notes` | Retrieve all notes | `200` |
| `GET` | `/notes/:id` | Retrieve a specific note | `200`, `404` |
| `PUT` | `/notes/:id` | Update a note | `200`, `400`, `404` |
| `DELETE` | `/notes/:id` | Delete a note | `200`, `404` |
| `GET` | `/health` | Health check | `200` |

### Request/Response Examples

#### Create a Note
```bash
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Meeting Notes",
    "content": "Discuss project timeline and deliverables"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Meeting Notes",
    "content": "Discuss project timeline and deliverables",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Note created successfully"
}
```

#### Get All Notes
```bash
curl http://localhost:3000/notes
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Meeting Notes",
      "content": "Discuss project timeline and deliverables",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "count": 1,
  "message": "Notes retrieved successfully"
}
```

#### Get Specific Note
```bash
curl http://localhost:3000/notes/123e4567-e89b-12d3-a456-426614174000
```

#### Update a Note
```bash
curl -X PUT http://localhost:3000/notes/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Meeting Notes",
    "content": "Discuss project timeline, deliverables, and budget"
  }'
```

#### Delete a Note
```bash
curl -X DELETE http://localhost:3000/notes/123e4567-e89b-12d3-a456-426614174000
```

### Error Responses

#### Validation Error (400)
```json
{
  "success": false,
  "error": "Validation Error",
  "message": "Title is required and must be a non-empty string"
}
```

#### Not Found (404)
```json
{
  "success": false,
  "error": "Not Found",
  "message": "Note not found"
}
```

## 🧪 Testing & Quality

### Test Coverage
The project maintains **95%+ code coverage** with comprehensive test scenarios:

- **46 test cases** covering all CRUD operations
- **Validation testing** for all input scenarios  
- **Error handling** for edge cases and failures
- **Integration testing** for middleware and server functionality
- **Boundary testing** for limits and constraints

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Code Quality
```bash
# Check code quality
npm run lint

# Auto-fix issues
npm run lint:fix
```

See [TESTING.md](TESTING.md) for detailed testing documentation and philosophy.

## 🎬 Demo Script

A complete demo script is provided to showcase all API functionality:

```bash
# Make the script executable
chmod +x demo.sh

# Run the complete demo (requires server to be running)
./demo.sh
```

The demo script demonstrates:
1. Health check
2. Creating multiple notes
3. Retrieving all notes
4. Getting a specific note
5. Updating a note
6. Deleting a note
7. Error handling scenarios

## 🏗️ Architecture

### Project Structure
```
notes-crud-api/
├── src/
│   ├── app.js              # Express application setup
│   ├── server.js           # Server startup and configuration
│   ├── middleware/         # Custom middleware
│   │   ├── errorHandler.js # Global error handling
│   │   └── validateNote.js # Input validation
│   ├── models/             # Data models
│   │   └── Note.js         # Note entity
│   ├── routes/             # API route definitions
│   │   └── notes.js        # Notes CRUD endpoints
│   └── services/           # Business logic
│       └── notesService.js # Notes service layer
├── tests/                  # Test suites
│   ├── notes.test.js       # API endpoint tests
│   ├── server.test.js      # Server integration tests
│   └── setup.js            # Test configuration
├── demo.sh                 # Complete API demo script
├── TESTING.md              # Testing documentation
└── README.md               # This file
```

### Design Principles
- **Layered Architecture** - Clear separation between routes, services, and models
- **Error-First Design** - Comprehensive error handling at every layer
- **Validation-First** - Input validation before processing
- **Test-Driven Quality** - High test coverage with meaningful assertions
- **Professional Standards** - ESLint, consistent naming, proper HTTP codes

## 🎯 Interview-Ready Highlights

This project demonstrates:

### **Technical Excellence**
- ✅ RESTful API design with proper HTTP methods and status codes
- ✅ Comprehensive input validation and error handling
- ✅ Professional project structure and code organization
- ✅ High test coverage (95%+) with meaningful test cases
- ✅ Code quality enforcement with ESLint
- ✅ Modern Node.js and Express.js best practices

### **Senior-Level Patterns**
- ✅ Layered architecture with separation of concerns
- ✅ Middleware pattern for cross-cutting concerns
- ✅ Service layer abstraction for business logic
- ✅ Comprehensive error handling strategy
- ✅ Professional testing methodology
- ✅ Clean, maintainable, and scalable code

### **Production Readiness**
- ✅ Environment-based configuration
- ✅ Proper logging and monitoring (health check)
- ✅ CORS support for frontend integration
- ✅ Input sanitization and validation
- ✅ Graceful error responses
- ✅ Documentation and demo scripts

## 🛠️ Technology Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.18+
- **Testing:** Jest 29+ with Supertest
- **Code Quality:** ESLint 8+
- **UUID Generation:** uuid 9+
- **CORS:** cors 2.8+

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

This is a portfolio/interview demonstration project. For suggestions or improvements, please open an issue or submit a pull request.

---

**Built with ❤️ for demonstrating senior backend engineering skills**