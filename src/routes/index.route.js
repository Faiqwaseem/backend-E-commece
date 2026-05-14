const authRoute = require("./auth.route");
const errorMiddleware = require("../middlewares/error.middleware");

const routes = (app) => {
  
  app.use("/api/v1/auth", authRoute);

  (app.use(errorMiddleware));
};

module.exports = routes;
