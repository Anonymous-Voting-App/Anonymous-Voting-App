# Anonymous-Voting-App

Anonymous Voting App -project

## Project structure

The project is divided into frontend and backend folders which contain the corresponding npm projects and READMEs. Remember to also check those READMEs for development environment instructions etc.

## Code formatting

To utilize code formatting on commit, run `npm install` in the project root folder

## Branch protection

`main` and `dev` -branches are protected from pushed and code must be merged via pull requests.

## Project deployment

The project deployment is spread to two different branches:

- Main: Production code => When code is pushed to `main`, it will go to production
- Dev: Staging code => When code is pushed to `dev`, it will go to staging environment

When PR is created to merge code to `dev`-branch, the code will be build and set to development environment.
