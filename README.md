# Anonymous-Voting-App

Anonymous Voting App -project

[![Staging CI](https://github.com/Anonymous-Voting-App/Anonymous-Voting-App/actions/workflows/staging_ci.yml/badge.svg)](https://github.com/Anonymous-Voting-App/Anonymous-Voting-App/actions/workflows/staging_ci.yml)
[![codecov](https://codecov.io/gh/Anonymous-Voting-App/Anonymous-Voting-App/branch/dev/graph/badge.svg?token=JIZMP0Z6ZX)](https://codecov.io/gh/Anonymous-Voting-App/Anonymous-Voting-App)

## Project structure

The project is divided into frontend and backend folders which contain the corresponding npm projects and READMEs. Remember to also check those READMEs for development environment instructions etc.

## Code formatting

To utilize code formatting and linting on commit, run `npm install` in the project root folder and in both `frontend` and `backend` folders!

## Branch protection

`main` and `dev` -branches are protected from pushed and code must be merged via pull requests.

## Project deployment

The project deployment is spread to three different versions:

-   Production
    -   When code is pushed to `main`, it will be deployed to production environment
    -   Website URL: TBD
    -   API URL: TBD
-   Staging
    -   When code is pushed to `dev`, it will be deployed to staging environment
    -   Website URL: [https://d2l9c7s1roosdj.cloudfront.net/](https://d2l9c7s1roosdj.cloudfront.net/)
    -   API URL: [https://d2l9c7s1roosdj.cloudfront.net/api/](https://d2l9c7s1roosdj.cloudfront.net/api/)
-   Dev
    -   When PR is created against `dev`, the code of the PR will be deployed to dev environment
    -   Website URL: [http://dev.knowit-anonymous-voting-app.aws.cybercom.dev.s3-website.eu-north-1.amazonaws.com/](http://dev.knowit-anonymous-voting-app.aws.cybercom.dev.s3-website.eu-north-1.amazonaws.com/)
    -   API URL: [http://dev.knowit-anonymous-voting-app.aws.cybercom.dev.s3-website.eu-north-1.amazonaws.com/api/](http://dev.knowit-anonymous-voting-app.aws.cybercom.dev.s3-website.eu-north-1.amazonaws.com/api/)
