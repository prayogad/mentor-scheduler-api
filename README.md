# Mentor Scheduler API

## Description

The **Mentor Scheduler API** is a backend application designed to facilitate seamless mentoring sessions between students and mentors. The system allows students to book available mentoring sessions provided by mentors, and enables mentors to manage their availability efficiently. The API supports role-based functionality, allowing users to register as either a **student** or a **mentor**.

## Key Features:
- **Student Role**:
  - Browse and book available mentoring sessions from mentors.
  - View all booked sessions.

- **Mentor Role**:
  - Add, update, and remove mentoring session availability.
  - View all booked sessions by students.

- **User Authentication**:
  - Register, login, and logout as either a student or mentor.
  - Role selection at registration to define user capabilities.


## Tech Stack

- ![NestJS](https://img.shields.io/badge/-NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)
- ![Prisma](https://img.shields.io/badge/-Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
- ![TypeScript](https://img.shields.io/badge/-TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
- ![RxJS](https://img.shields.io/badge/-RxJS-B7178C?style=flat&logo=reactivex&logoColor=white)
- ![bcrypt](https://img.shields.io/badge/-bcrypt-0054A6?style=flat&logo=lock&logoColor=white)
- ![Winston](https://img.shields.io/badge/-Winston-333333?style=flat&logo=winston&logoColor=white)
- ![Zod](https://img.shields.io/badge/-Zod-3178C6?style=flat&logo=zod&logoColor=white)

## Project setup

Create .env file for database connection
```
DATABASE_URL="mysql://username:password@host:port/dbName"
```


```bash
# install dependencies
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```