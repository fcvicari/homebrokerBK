## Description

This project aims to study React technologies with the NextJS framework for frontend development and NodeJS with the NestJS framework for backend development.

The PostgreSQL serverless database will be used in this project. To use it, go to the <a href="https://www.render.com/" target="blank">Render</a> website, create an account, set up a cluster, create a user and set the DATABASE_URL environment variable in the .env file.

## Technologies

### NestJS
A powerful, extensible Node.js framework for building efficient and scalable server-side applications, utilizing modern JavaScript and TypeScript features.

### Prisma ORM
An ORM (Object-Relational Mapping) tool that simplifies database access with support for various SQL and NoSQL databases.

### PostgreSQL database
A powerful, open-source relational database management system used for storing structured data with support for advanced querying and transactions.

### OpenAPI (Swagger)
OpenAPI (formerly Swagger) is a standard specification for defining RESTful APIs, enabling clear, language-agnostic documentation. It simplifies API development, testing, and integration by providing a structured format (YAML or JSON). Tools like Swagger UI and Codegen enhance visualization and code generation.

### TypeScript
A superset of JavaScript that adds static types, improving developer experience and maintaining large codebases.

### JWT Authentication
JSON Web Tokens (JWT) are used for secure user authentication and session management.

### Commitlint & Commitizen
Tools for enforcing consistent commit messages and automating semantic versioning with conventional changelogs.

### Testing & Linting
Automated testing with Jest and Supertest, and code quality enforcement with ESLint, Prettier, and Husky.

### Class Validation & Transformation
Class-validator and class-transformer for validating and transforming objects in TypeScript classes.

### Reactive Programming
Rxjs is used for handling asynchronous data streams in a declarative manner.

## Installation
To install the application, you must configure the DATABASE_URL environment variable. This variable must contain the address of the application database.
This application is configured to use the database in Cockroach. If you want to change, you must reconfigure the prisma ORM.

## Running the app

```bash
# development
$ yarn start:dev

# production mode
$ yarn build
$ yarn start
```

## Future Implementations

To enhance the project's functionality and user experience, the following features could be added:

1. **Email Sending for User Actions**:  
   Implement email notifications for key actions, such as:  
   - Confirming user registration.  
   - Supporting the "Forgot Password" process to reset user credentials.

2. **Email Template Utilization**:  
   Introduce customizable email templates to ensure consistency in communication, improve efficiency, and provide a professional appearance for all automated emails.

These improvements would strengthen the platform's reliability and overall usability.