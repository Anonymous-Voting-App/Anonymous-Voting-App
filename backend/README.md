# Anonymous Voting App backend

## Backend structure

The backend is split into multiple layers. The layers follow the logic shown in the following example image.

![Express structure](https://www.coreycleary.me/_next/static/media/Express-REST-API-Struc.aa7ecaa0c41dbb7344c70665a5f5e259.png)

Image from [coreycleary.me](https://www.coreycleary.me/project-structure-for-an-express-rest-api-when-there-is-no-standard-way)

## Setting up backend for development

Install dependencies with `npm install` and run the backend with `npm run start` (or `npm run nodemon` to run using Nodemon).

## Database

The backend uses PostgreSQL via Prisma.

## Utilities

Utils-directory contains some definitions for common utilities.

### Responses

Contains some HTTP responses in common format that should be used.

### Logger

Logger contains definitions for winston, a logging library, that should be used. Just import `Logger` to use.
