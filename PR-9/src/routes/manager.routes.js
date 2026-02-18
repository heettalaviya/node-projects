const express = require("express");
const { loginmanager, managerprofile, addemployee, updateemployee, deleteemployee, getallemployee, getemployee, empregister, updatemanagerprofie } = require("../controller/manager.controller");
const uploadsImage = require("../middleware/uploadsimage");
const { verifiymanagertoken } = require("../middleware/verifytoken");


const routes = express.Router();


routes.post("/loginmanager",loginmanager);
routes.post("/manager-profile",verifiymanagertoken,uploadsImage.single("ProfileImage"),managerprofile);
// manager employee
routes.post("/add-employee",verifiymanagertoken,uploadsImage.single("ProfileImage"),addemployee)
routes.put("/update-employee/:id",verifiymanagertoken,uploadsImage.single("ProfileImage"),updateemployee)
routes.delete("/delete-employee/:id",verifiymanagertoken,uploadsImage.single("ProfileImage"),deleteemployee)
routes.get("/employee",verifiymanagertoken,getallemployee);
routes.get("/single-employee/:id",verifiymanagertoken,getemployee);
routes.post("/update-managerprofie",verifiymanagertoken,updatemanagerprofie);



module.exports = routes;