# Architectural Guidelines: Rezult Project

## 1. Core Architecture Pattern
This project follows a **Modular Monolith** approach utilizing a strict **Layered Architecture (Controller-Service-Data)**. 

Do not generate Microservices. The frontend and backend will exist in a single GitHub monorepo (`/client` and `/server`). The backend must strictly separate concerns to ensure maintainability, scalability, and ease of testing.

## 2. Directory Structure
All backend code generation must adhere to the following structure:

```text
rezult-backend/
├── src/
│   ├── controllers/      # HTTP request/response handlers
│   ├── services/         # Core business logic and external integrations
│   ├── models/           # Mongoose schemas and TypeScript interfaces
│   ├── routes/           # Express router definitions
│   ├── middleware/       # JWT guards, RBAC, error handling
│   ├── utils/            # Shared helpers (date formatting, loggers)
│   ├── app.ts            # Express application setup
│   └── server.ts         # Server instantiation

```

## 3. Layer Rules & Responsibilities

When generating code, you must strictly obey these boundaries:

### A. Controller Layer (`src/controllers/`)

* **Role:** The Traffic Cop.
* **Rules:**
* ONLY handles HTTP requests and responses.
* Extracts `req.body`, `req.params`, and `req.query`.
* Validates input using Zod schemas.
* Passes data to the Service Layer.
* Returns standard HTTP status codes and JSON payloads.
* **STRICT PROHIBITION:** Zero business logic or database queries (`Model.find()`, etc.) are allowed in this layer.



### B. Service Layer (`src/services/`)

* **Role:** The Brain.
* **Rules:**
* Contains 100% of the application's business logic.
* Performs database operations by calling the Models.
* Handles external API calls (e.g., calling the RAG system for descriptive answer evaluation).
* **STRICT PROHIBITION:** This layer must not know about Express. Do not pass `req` or `res` objects into service functions.



### C. Data/Model Layer (`src/models/`)

* **Role:** The Storage.
* **Rules:**
* Contains Mongoose schemas and strict TypeScript interfaces.
* Utilizes `{ timestamps: true }` for automated date tracking.



## 4. Development & Testing Workflow

* **API Testing:** All generated endpoints must be structured so they are easily testable via Postman. Ensure standard JSON response structures (e.g., `{ success: boolean, data: any, error?: string }`).
* **Deployment Targets:** The frontend will be deployed via Vercel. Ensure frontend API calls use relative paths or environment variables (`VITE_API_BASE_URL`) rather than hardcoded localhosts.

## 5. AI Generation Instructions

When I ask you to build a new feature (e.g., "Build the assessment creation feature"):

1. **First:** Generate the necessary Typescript interfaces and Mongoose modifications (if not already existing).
2. **Second:** Generate the pure TypeScript Service layer function.
3. **Third:** Generate the Controller to handle the HTTP wrapper.
4. **Fourth:** Generate the Express Route and apply the necessary RBAC middleware.

