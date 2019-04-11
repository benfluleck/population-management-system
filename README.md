[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.com/benfluleck/population-management-system.svg?branch=develop)](https://travis-ci.com/benfluleck/population-management-system)
[![Coverage Status](https://coveralls.io/repos/github/benfluleck/population-management-system/badge.svg?branch=chore-implement-tests-for-application)](https://coveralls.io/github/benfluleck/population-management-system?branch=chore-implement-tests-for-application) [![Greenkeeper badge](https://badges.greenkeeper.io/benfluleck/population-management-system.svg)](https://greenkeeper.io/)



# Population Management System
The Population management application is a project inspired by my LMS Outputs for [Andela](https://andela.com/) for my D2 Assessments. The aim is a back-end javascript application that implements a simple way to populate locations with the amount of male and females in that location

# Table of Contents

- [Getting Started](#getting-started)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [API Endpoints](#api-endpoints)
- [Questions](#questions)
- [Support or Contribution](#support-or-contribution)

## Getting Started
This is a backend javascript application built with [**Node JS**](https://nodejs.org/en/) using [**Express**](https://expressjs.com/) framework. The application runs with Redis server and Express Session for security and validation of users.

## Technology Stack
**Server Side**
1. NodeJS
2. Express FrameWork
3. MongoDB with Moongoose ORM

## Installation

1. Install [**Node JS**](https://nodejs.org/en/).

2. Clone the [**repository here**](https://github.com/benfluleck/random-phone-number-generator)
3. [**cd**] into the root of the **project directory**.
4. Run `yarn install` on the terminal to install project dependecies
5. Create a `.env` file in the root directory of the application. Example of the content of a .env file is shown in the .env.sample

6. Start the application:
**_Different Build Environments_**

**Production**
```
yarn build
yarn start:prod
```
**Development**
```
yarn start:dev
```
## API Endpoints
Api endpoints were created using `express` router. The routes are defined under `src/routes/index.js`.

Request type | Endpoint                                   | Action
-------------|--------------------------------------------|--------------------------------------------------
POST         | /api/v1/auth/signup                             | Signs up to the applicaiton
POST         | /api/v1/auth/signin                      | Signs into the application
GET	     | /api/v1/locations                     | Retrieves a list of all locations
POST	     | /api/v1/locations                     | Adds a new location to the application
GET	         | /api/v1/locations/:locationId                          | This gets the details of a specified location with any locations nested in it
PUT          | /api/v1/locations/:locationId          | Updates a specified location on the application
DELETE       | /api/v1/locations/:locationId          | Deletes a specified location


## Testing

Sever side tests - Run `yarn test` on the terminal while within the **project root directory**.

Server side testing is achieved through use of `chai-http`, `mocha` and `chai` packages. `chai-http` is used to make requests to the api and `mocha` is the testing framework and `chai` is the exception library. They will both be installed when you run `yarn install` and the tests will run when you run `yarn test`.

## Questions
For more details contact benny.ogidan@andela.com

## Support or Contribution
For any suggestions or contributions or issues please do raise them or email me.
For **Contributiions**, Please clone the repo and implement a PR I would appreciate it
