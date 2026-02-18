const express = require('express');

const routes = express.Router();

routes.use("/admin",require("../routes/admin.routes"));
routes.use("/manager",require("../routes/manager.routes"));
routes.use("/employee",require("../routes/employee.routes"));

module.exports = routes;