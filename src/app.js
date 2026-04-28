const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();


app.use(cors());                          // add this line to production {origin: 'http://localhost:8080', credentials: true}
app.use(express.json());
app.use(cookieParser());


module.exports = app;