/* eslint-disable no-console */
const mongoose = require('mongoose');
const app = require('./app');
const bot = require('./bot');

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.DATABASE_CONNECTION_STRING_LOCAL || 'mongodb://db:27017/crud-node-mongo-docker';

// mongoose
//     .connect(MONGO_URL, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     })
//     .then(() => {
//         console.log('DB Connected');
//     })
//     .catch((error) => {
//         console.log(error);
//     });
bot.launch();
app.listen(PORT);

console.log('Personal BOT running!');