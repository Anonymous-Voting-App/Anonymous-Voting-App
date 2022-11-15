# Anonymous-Voting-App

Anonymous Voting App -project

[![Production CI](https://github.com/Anonymous-Voting-App/Anonymous-Voting-App/actions/workflows/production_ci.yml/badge.svg)](https://github.com/Anonymous-Voting-App/Anonymous-Voting-App/actions/workflows/production_ci.yml)
[![Staging CI](https://github.com/Anonymous-Voting-App/Anonymous-Voting-App/actions/workflows/staging_ci.yml/badge.svg)](https://github.com/Anonymous-Voting-App/Anonymous-Voting-App/actions/workflows/staging_ci.yml)
[![codecov](https://codecov.io/gh/Anonymous-Voting-App/Anonymous-Voting-App/branch/dev/graph/badge.svg?token=JIZMP0Z6ZX)](https://codecov.io/gh/Anonymous-Voting-App/Anonymous-Voting-App)
[![Cypress](https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/simple/davogf/dev&style=flat&logo=cypress)](https://dashboard.cypress.io/projects/davogf/runs)

## Project structure

The project is divided into frontend and backend folders which contain the corresponding npm projects and READMEs. Remember to also check those READMEs for development environment instructions etc.

## Code formatting

To utilize code formatting and linting on commit, run `npm install` in the project root folder and in both `frontend` and `backend` folders!

## Branch protection

`main` and `dev` -branches are protected from pushed and code must be merged via pull requests.

## Project deployment

The project deployment is spread to two different versions:

-   Production (Not yet set up)
    -   When code is pushed to `main`, it will be deployed to production environment
    -   Website URL: [https://knowit-anonymous-voting-app.aws.cybercom.dev/]()
    -   API URL: [https://knowit-anonymous-voting-app.aws.cybercom.dev/api/]()
-   Staging
    -   When code is pushed to `dev`, it will be deployed to staging environment
    -   Website URL: [https://staging.knowit-anonymous-voting-app.aws.cybercom.dev/](https://staging.knowit-anonymous-voting-app.aws.cybercom.dev/)
    -   API URL: [https://staging.knowit-anonymous-voting-app.aws.cybercom.dev/api/](https://staging.knowit-anonymous-voting-app.aws.cybercom.dev/api/)
