const express = require("express");
const uploadsImage = require("../middleware/uploadsimage");
const { verifiyemployeetoken } = require("../middleware/verifytoken");
const { loginemployee, employeeprofile, updateemployeeprofie } = require("../controller/employee.controller");
const routes = express.Router();

routes.post("/loginemployee",loginemployee);
routes.post("/employee-profile",verifiyemployeetoken,employeeprofile);
routes.post("/update-employeeprofile",verifiyemployeetoken,updateemployeeprofie);

module.exports = routes;

