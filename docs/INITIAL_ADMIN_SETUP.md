# Setting up the first admin account

This guide covers how to set the first admin user.

## Create user

Start by creating a basic user either through the API or through the frontend.

### API

Send an API request to the backend. One example using curl is given:

`curl --location --request POST 'API_URL/api/user/signup' --header 'Content-Type: application/json' --data-raw '{"firstname": "Enter first name here", "lastname": "Enter last name here", "username": "Enter username here", "email": "Enter email address here", "password": "Enter a strong password here" }'`

### Frontend

1. Go to frontend
2. Click on login
3. Click on register
4. Fill the fields
5. Click register

## Update user to be an admin

For this step, you need some tool to access the database that is used. Following steps assume that you have the database open on your tool of choice.

1. Go to `user`-table
2. Find the account you created before
3. Find column with name `isAdmin`
4. The value should be `false`
5. Change the value to `true`
6. The account is now considered to be an admin
