const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes/index.route");

const app = express();

app.use(cors()); // add this line to production {origin: 'http://localhost:8080', credentials: true}
app.use(express.json());
app.use(cookieParser());

routes(app);

module.exports = app;
