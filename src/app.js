/* eslint-disable no-console */
const express = require('express');
const app = express();

const router = express.Router();

app.use('/', router.get('/', (req, res) => res.status(200).json({
    message: 'Welcome to Personal BOT!',
})));

module.exports = app;
