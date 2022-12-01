# Setup guide

This setup guide covers both local and AWS setup.

## Local

The local setup consists of setting up backend and frontend

### Backend

Easiest way to run backend is by using Docker. First set the environment variables to the `.env`-file as described below.

After setting the environment variables, the database needs to be initialized. The command to use depends on whether you are planning on running a development or a production database. If you plan on running a development database, use `npx prisma migrate dev`. For production databases, use `npx prisma migrate deploy`.

Finally, the backend image can be build using `docker build -t tag .` and it can be run using `docker run -p 8080:8080 tag`.

#### Environment variables (backend)

Set these variables inside a `.env`-file in `backend`-folder.

##### Database

The backend needs a PostgreSQL database to work correctly. Enter the full connection string, including `postgres://` at the beginning, after `DATABASE_URL=` in the `.env`-file. One example of connection string could be `postgresql://user:password@db_address_or_ip:port/database?schema=public`.

##### JWT secret

The backend needs a secret for JWT to work correctly. Enter a secret after `JWT_SECRET=` in the `.env`-file.

##### CORS origin

The backend needs a CORS origin to work correctly. Enter the URL of the frontend after `CORS_ALLOW_ORIGIN=` in the `.env`-file. The URL should include both protocol and port e.g. `http://localhost:3000` or `https://knowit-anonymous-voting-app.aws.cybercom.dev`.

### Frontend

Frontend can be run quickly as development build, with Docker or by building the production build and hosting it. First set the environment variables to the `.env`-file as described below.

#### Environment variables (frontend)

The frontend needs one environment variable to be set for it to know the backend URL to connect to. Set this variable by creating a `.env`-file and by adding the backend URL after the `REACT_APP_BACKEND_URL=`.

#### Development build

To use the default Create-React-App development build, use `npm run start`.

#### Docker

Build the frontend image by running `docker build -t tag .` and run it with `docker run -p 8000:8000 tag`.

#### Manual build and host

Build the frontend with `npm run build`. After building, it can be served via any HTTP server from the `build`-folder. One example is hosting with `serve` using the command `npx serve build`.

## AWS

The AWS environment for this software is defined using Terraform. The definitions are located in the `infra`-folder. There are three different modules used for the deployment, `ecr`, `backend`, and `frontend`.

### ECR

ECR module sets up an Elastic Container Registry for the app to use.

#### Variables (AWS ECR)

| Name    | Definition                    | Default    |
| ------- | ----------------------------- | ---------- |
| name    | Which name to use for the app | ava        |
| region  | AWS region to use             | eu-north-1 |
| profile | AWS profile to use            | ava-mfa    |

### AWS Backend

Backend sets up the backend for the application to use. The main services used are Elastic Container Service, Secrets Manager and Elastic Load Balancer. Additional services are IAM, S3, and CloudWatch.

If the AWS services have access to the given container repository and the pull succeeds, the backend should be ready use straight after finishing.

Remember to change the DNS settings of the domain used to direct the user to the backend load balancer address.

#### Variables (AWS backend)

| Name                         | Definition                                                                                                  | Default    |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------- |
| name                         | Which name to use for the app                                                                               | ava        |
| region                       | AWS region to use                                                                                           | eu-north-1 |
| profile                      | AWS profile to use                                                                                          | ava-mfa    |
| certificate_arn              | The ARN for the SSL certificate to use with the load balancer                                               |            |
| db_url                       | The connection string for the database to be used with the application (see local deployment for more info) |            |
| cors_allow_origin            | The URL to set as Access-Control-Allow-Origin header (see local deployment for more info)                   |            |
| container_repository_address | Address of the container repository used                                                                    |            |
| container_image_tag          | The tag of the container image to be used                                                                   |            |
| vpc                          | The VPC to use                                                                                              |            |
| subnets                      | The subnets to use                                                                                          |            |

### AWS Frontend

Frontend sets up the frontend for the application to use. The main services used are CloudFront and S3. Additional services are IAM and CloudWatch.

To use frontend after deployment, place the results of the build inside the created S3 bucket.

Remember to change the DNS settings of the domain used to direct the user to the backend load balancer address.

#### Variables (AWS frontend)

| Name                             | Definition                                      | Default    |
| -------------------------------- | ----------------------------------------------- | ---------- |
| name                             | Which name to use for the app                   | ava        |
| region                           | AWS region to use                               | eu-north-1 |
| profile                          | AWS profile to use                              | ava-mfa    |
| cloudfront_alias                 | Alias to use for CloudFront                     |            |
| cloudfront_alias_certificate_arn | ARN of the certificate for the CloudFront alias |            |

## AWS Architecture diagram

This diagram can also be found from docs/aws-diagram.drawio
![Anonymous Voting App](https://user-images.githubusercontent.com/47356222/205173517-db588448-4ca3-4801-92a1-020602a7b0f5.png)
