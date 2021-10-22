const auth = require("./auth");
const user = require("./user");
const event = require("./event");
const category = require("./category");
const order = require("./order");

const authenticate = require("../middlewares/authenticate");

module.exports = (app) => {
  app.get("/", (req, res) => {
    res.status(200).send({
      message:
        "Welcome to the AUTHENTICATION API. Register or Login to test Authentication.",
    });
  });

  app.use("/api/auth", auth);
  app.use("/api/user", authenticate, user);
  app.use("/api/event", authenticate, event);
  app.use("/api/category", authenticate, category);
  app.use("/api/order", authenticate, order);
  app.use("/api/download", order);
};
