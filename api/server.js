const express = require('express');

const Router = require('../routers/router.js');

const server = express();

server.use(express.json());
server.use('/api/posts', Router);

module.exports = server;