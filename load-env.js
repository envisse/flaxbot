"use strict";

const path = require('path');

const NODE_ENV = process.env.NODE_ENV || 'dev';

const DEV_ENV_FILE_NAME = 'dev.env';
const PROD_ENV_FILE_NAME = 'prod.env';

const PATH_DEV_ENV = path.resolve(process.cwd(), DEV_ENV_FILE_NAME);
const PATH_DEV_PROD = path.resolve(process.cwd(), PROD_ENV_FILE_NAME);

module.exports = require('dotenv').config({
    path: NODE_ENV === 'dev' ? PATH_DEV_ENV : PATH_DEV_PROD
});
