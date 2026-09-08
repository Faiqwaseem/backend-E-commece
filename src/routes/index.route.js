const authRoute = require("./auth.route");
const adminRoute = require("./admin.route");
const categoryRoute = require("./category.route");
const productRoute = require("./product.route");
const errorMiddleware = require("../middlewares/error.middleware");

const routes = (app) => {
  
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/categories", categoryRoute);
  app.use("/api/v1/admin", adminRoute);
  app.use("/api/v1/products", productRoute)

  app.use(errorMiddleware);
};

module.exports = routes;
