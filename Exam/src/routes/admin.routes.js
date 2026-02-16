const express = require("express");
const { adminregister, adminlogin, addtask, updatetask, getsingletask, deletetask, getalltask } = require("../controller/admin.controller");
const uploadimage = require("../middleware/uploadsimage");
const {verifyadmintoken} = require("../middleware/verifytoken");
const routes = express.Router();

routes.post("/admin-resigister",uploadimage.single("ProfileImage"),adminregister);
routes.post("/admin-login",adminlogin);
routes.post("/add-task", verifyadmintoken, uploadimage.single("taskImage"), addtask);
routes.put("/upadte-task/:id", verifyadmintoken, uploadimage.single("taskImage"), updatetask);
routes.get("/single-task/:id", getsingletask);
routes.get("/", verifyadmintoken, getalltask);
routes.delete("/delete-task/:id", verifyadmintoken, uploadimage.single("taskImage"), deletetask);

module.exports = routes;
