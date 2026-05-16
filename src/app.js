const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");

const routes = require("./routes/index.route");
const app = express();

app.use(cors({ origin: "http://localhost:8080", credentials: true })); // add this line to production {origin: 'http://localhost:8080', credentials: true}
app.use(express.urlencoded({ extended: true }));
app.use(helmet()); // Helmet multiple headers set karta hai attackers ko r
app.use(compression()); // data ko compress kar deta hai ager 500 to usy 80 kar deta hai
app.use(morgan("dev")); // Errors track karne me help. Console Me Logs Show karta hai
app.use(express.json()); // express.json() is a middleware express ko bata hai data json formate me hai
app.use(cookieParser()); // cookieParser is a middleware
app.use(hpp()); // HPP duplicate params remove karta hai.  Prevent HTTP Parameter Pollution ..HPP = URL Cleaner
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  }),
); // 15 minutes me 100 requests le sakte hai.

routes(app);

module.exports = app;
