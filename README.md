# Node.js API starter

## What's this?

A API starter kit based on [nest.js]. Use it as a base for building Node.js microservices.

It is recommended to understand [nest.js fundamentals] before attempting to develop new features using this starter.

## Guiding principles

- [The Twelve-Factor App][12-factor]
- [SOLID Principles][solid]
- [Don't Repeat Yourself][dry]
- [Keep it simple, stupid][kiss]
- Small and fast
- Works well with containerization
- Focus on testing
- Focus on security

## Getting Started

The starter connects to [MongoDB] by default. Therefore, make sure you have access to a running MongoDB instance. You can find instructions to setup one [here][mongodb-setup].

```
$ git clone git@github.com:contentstack/microservice-framework-js.git your-project
$ cd your-project
$ npm install
$ cp local-env .env # .env file contains configuration for the microservice
$ npm run migration:run # run database migrations
$ npm run start
```

The service should now start listening on port `3000`.

## What's in the box?

To help you understand how to develop new features, we've included a `TodoModule` in the starter. The `TodoModule` contains a full-fledged REST API for creating, updating and fetching Todos. By going through the implementation of this feature, we demonstrate best practices and also give you a base implementation for your new APIs.

## Configuration and environment

The microservice is configured using environment variables, which is the recommended way to configure apps according to [The Twelve-Factor App][12-factor-configuration]. To make it convenient for local development, we use [dotenv] to add a `.env` file at the root with all the environment variables. These environment variables are then available automatically in the app. A sample `.env` file is checked in the `local-env` file. You can copy it to get started:

```
$ cp local-env .env
```

`.env` files should not be checked in. This ensures that the app receives the appropriate configuration when run in a non-local environment.

### Configuration schemas

If you supply incorrect or insufficient environment variables, the app will fail to start and point you to the problem in the stack trace. This is achieved by checking environment variables against a schema. Checkout `app/configuration.ts` to see how this works and add your own.

## Tests and linting

To run tests and lint:

```
$ npm test
$ npm run lint
```

To get test coverage:

```
$ npm run test:cov
```

### Controller unit tests

Unit tests are written along side each component. The `TodoController` test uses nest.js's `TestingModule` to start a nest.js instance with only the controller. The `TodoService` provider is mocked out. It then uses [supertest] to make HTTP calls on the nest.js server.

This approach allows us to test the controller's behavior at the HTTP level. The outcome is that you are able to test the controller behavior more effectively, covering request serialization/deserialization and validation.

### Service unit tests

Service tests are simpler unit tests that do not involve nest.js. We simply unit test the `TodoService` class by injecting a mock [Mongoose] model.

### Integration tests

The `TodoModule` test is an integration test. It spawns an [in-memory MongoDB][mongodb-memory-server] instance and runs an integration test across the entire module.

Integration tests must be less in number and oriented towards covering the main happy path, since they're slower compared to other unit tests.

## Database migration

We use a library called [migrate-mongo] for database migrations. Migrations help you achieve the following:

- Enforce collection schema using [Schema Validation][schema-validation]
- Create/drop collections
- Migrate your data from a change in data type, adding/removing columns etc
- **Most importantly, keep database changes versioned, repeatable and reliable**

To check migration status:

```
$ npm run migration:status
```

To run migrations:

```
$ npm run migration:run
```

To rollback the last migration:

```
$ npm run migration:rollback
```

You can create a migration by:

```
$ npm run migration:create my-migration-name
```

Migrations are saved in the `migrations` directory. You can find your newly created migration file in there. The migration consists of two parts: `up` script and `down` script. The `up` script applies the change, whereas, the `down` script is reverses the change.

It is important to note that migrations should only be used for DDL statements (database queries that affect the structure of the data) and not DML statements (database queries that add/query domain data). A good way of evaluating if migrations are suitable is to ask yourself if the migrations can run from scratch on an empty database.

## Health endpoints

The starter comes out of the box with a health endpoint at `/health`. The endpoint is configured using the [nest.js Terminus] package. This endpoint also tells you if the app is properly connected to MongoDB.

### Graceful shutdown

The health endpoint plays a vital role for graceful shutdown of the app. When you send `SIGTERM` to the app to shut it down, the health endpoint starts responding with `503`. This lets orchestrators like Kubernetes stop sending traffic to the app.

## Exception handling

See nest.js [Exception filters].

## Logging

See nest.js [Logger].

## Setup [GOCD CI pipeline]

A CI pipeline allows you to check your service's code for issues by running lints and various tests. Once the code is found to be free of defects, a docker build for the service is created and pushed to the common docker repository i.e. Amazon ECR.

You can visit https://docs.gocd.org/current/introduction/concepts_in_go.html for basic concepts of GOCD

Link to ContentStack GOCD - (https://dev-zizjm2h5y7nj-gocd.contentstack.com/)

Raise a ticket in [Cloud Release Management](https://contentstack.atlassian.net/secure/RapidBoard.jspa?rapidView=65&projectKey=CS) board for onboarding to GoCD as a developer. You must have access to create and view [Config Repositories](<(https://docs.gocd.org/current/advanced_usage/config_repo.html)>).

Add the pipeline [pipelines.gocd.yaml](https://github.com/contentstack/api-starter-kit/blob/master/pipelines.gocd.yaml) to the root directory of your service and adapt it to your needs.

A "pipeline group" defined in yaml file is a set of pipelines for related services. For example, all CI/CD pipelines for Personalization services, comes under the "personalization" pipeline group. Each pipeline defined membership of the pipeline group in the pipeline YAML file. Once you adapt the name of the pipeline group for your service, you must also get access to it as part of the ticket raised with Cloud Release Management.

Raise a ticket in [Cloud Release Management](https://contentstack.atlassian.net/secure/RapidBoard.jspa?rapidView=65&projectKey=CS) board for access to Amazon ECR and to create a new ECR repository with a name resembling to service name. You must have access to view and pull images from ECR.

Adapt the image name in the pipeline YAML to match your service.

Add your service repository as a Config Repository in GoCD.
<img width="1563" alt="Screenshot 2020-09-14 at 4 18 58 PM" src="https://user-images.githubusercontent.com/69461422/93077605-a915be80-f6a6-11ea-8bcf-c14faeb8b867.png">

Check if your pipelines are running successfully.

## Next steps

Here's a tip to get more confortable with the framework before you start developing. In the `TodoModule`, we have defined Create, Retrieve and Update endpoints. Try implementing a Delete endpoint, along with all the corresponding tests.

[nest.js]: https://nestjs.com/
[nest.js fundamentals]: https://docs.nestjs.com/first-steps
[12-factor]: https://12factor.net/
[solid]: https://en.wikipedia.org/wiki/SOLID
[dry]: https://en.wikipedia.org/wiki/Don%27t_repeat_yourself
[kiss]: https://en.wikipedia.org/wiki/KISS_principle
[mongodb]: https://www.mongodb.com/
[mongodb-setup]: https://docs.mongodb.com/manual/installation/#mongodb-community-edition-installation-tutorials
[supertest]: https://www.npmjs.com/package/supertest
[mongoose]: https://mongoosejs.com/
[migrate-mongo]: https://www.npmjs.com/package/migrate-mongo
[schema-validation]: https://docs.mongodb.com/manual/core/schema-validation/
[dotenv]: https://www.npmjs.com/package/dotenv
[12-factor-configuration]: https://12factor.net/config
[nest.js terminus]: https://docs.nestjs.com/recipes/terminus
[exception filters]: https://docs.nestjs.com/exception-filters
[logger]: https://docs.nestjs.com/techniques/logger
[mongodb-memory-server]: https://github.com/nodkz/mongodb-memory-server
