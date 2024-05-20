# Feature Flag Service - Backend

Welcome to the backend repository of the Feature Flag Service, a project designed to revolutionize feature rollout management. This repository contains the server-side code that powers the Feature Flag Service, handling API requests and processing feature flag logic.

## Installation

Follow these steps to set up and run the backend service.

### 1. Copy `.env.example` to `.env` and Edit Environment Settings

First, copy the example environment configuration file and rename it to `.env`:
```bash
cp .env.example .env
```
Next, edit the `.env` file to configure your environment settings.

### 2. Setup Database Configuration

Configure the database by editing the `./src/config/database.js` file. The default configuration uses SQLite for development, testing, and production environments. Here is the provided configuration:

```javascript
const path = require('path');

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: path.resolve(__dirname, '../database.sqlite3')
  },
  test: {
    dialect: 'sqlite',
    storage: path.resolve(__dirname, '../database.test.sqlite3')
  },
  production: {
    dialect: 'sqlite',
    storage: path.resolve(__dirname, '../database.sqlite3')
  }
};
```

You can modify the configuration to use other databases supported by Sequelize, such as PostgreSQL, MySQL, or MSSQL, if needed.

### 3. Run Database Migration

To set up the database, run the following commands to create the database and apply migrations:

```bash
yarn sq db:create
yarn sq db:migrate
```

These commands will initialize the database and apply any existing migrations to set up the necessary tables and schema.

## Running the Server

After setting up the environment and database, you can start the backend server with:

```bash
yarn start
```

The server will start running, and you can begin using the API to manage feature flags.

## Documentation

For more detailed information on the API endpoints and usage, refer to the documentation in the [docs](../docs) folder. This includes comprehensive guides on how to interact with the backend service and integrate it with other parts of the Feature Flag Service.

## License

This project is licensed under the MIT License.
