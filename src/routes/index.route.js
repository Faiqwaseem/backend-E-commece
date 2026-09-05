const authRoute = require("./auth.route");
const adminRoute = require("./admin.route");
const categoryRoute = require("./category.route");
const errorMiddleware = require("../middlewares/error.middleware");

const routes = (app) => {
  
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/categories", categoryRoute);
  app.use("/api/v1/admin", adminRoute);

  app.use(errorMiddleware);
};

module.exports = routes;
