# Guidelines for coding the backend

## Versions

1.0 - 02.10.2022

## Foreword

This is a basic guideline for developing the backend, it contains nothing major but it's just simple document where I
list how some basic stuff should be implemented.

I should have specified these guidelines earlier but as I forgot I'll do it now :)

## Testing

### Unit testing

Unit tests are required for most cases for the code to be approved into the staging-branch. Tests are to be written in the same language
the code is written in so for with TypeScript code, write the tests in TypeScript.

### End-to-end

Will most probably be done with Cypress, but it will not be added till later in the project.

## Variables

Use `const` and `let`, don't use `var`.

The CI will fail in the future if `var` is used.
Read more from here [https://eslint.org/docs/latest/rules/no-var](https://eslint.org/docs/latest/rules/no-var)

## Interfaces

When developing with TypeScript, prefer using separate interfaces instead of defining the type in the function definition.
This makes it easier to understand the project.

## REST API endpoints

When adding new endpoints, follow the best practices mentioned here [https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/](https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/)

To maintain consistent HTTP response style, use the responses found in the `utils/responses.ts`-file.

## Prefer ES6 features over ES5

This includes, for example, arrow functions and import instead of require.

## No console.log

The only Logger that should be used outside of your personal development environment
is the Winston logger which can be imported from `utils/logger.ts`-file.
