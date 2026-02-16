const express = require("express");
const routes = express.Router();
const uploadimage = require("../middleware/uploadsimage");
const {verifyusertoken}  = require("../middleware/verifytoken");
const { getsingletask, getalltask, userregister, userlogin } = require("../controller/user.contoller");

routes.post("/user-resigister", uploadimage.single("ProfileImage"), userregister);
routes.post("/user-login", userlogin);
routes.get("/single-task/:id",verifyusertoken, getsingletask);
routes.get("/", verifyusertoken, getalltask);

module.exports = routes;  



