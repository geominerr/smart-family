# Server

This project was generated with [Nest](https://github.com/nestjs/nest)

## Change directory from root

```bash
$ cd server
```

## Installation

```bash
$ npm install
```

## Enviroment

```bash
$ cp .env.example .env
```

## Running the app

```bash
$ docker-compose up
```

After starting the app on port (4000 as default) you can open in your browser OpenAPI documentation by typing doc http://localhost:4000/doc . For more information about OpenAPI/Swagger please visit [Swagger](https://swagger.io/).

## Prisma migrate

> When the database is ready to connect, the application container will perform prisma migrations automatically

## Prisma studio

```bash
$ npm run prisma:studio
```

Prisma Studio is up on http://localhost:5555

## Build

```bash
$ npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Test

```bash
# run test database
$ npm run docker:e2e:up

# e2e tests
$ npm run test:e2e

# shut down test database
$ npm run docker:e2e:down
```
