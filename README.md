# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone https://github.com/Dazmond-ru/nodejs2023Q2-service.git
```

## Navigate to the project directory
```
cd nodejs2024Q1-service
```

## Switch to the "dev-2" branch
```
git checkout dev-2
```

## Installing NPM modules

```
npm install
```

## Create ".env" file

```
cp .env.example .env
```

## Run "docker-compose"

```
docker compose up -d
```

## Run prisma migration

```
npm run prisma:migrate
```

## Check size image

```
docker images
```

## Testing

**After application running open new terminal and enter:**

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

## OpenAPI documentation

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
