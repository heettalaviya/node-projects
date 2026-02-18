const express = require("express");
const { addadmin, updateadmin, deleteadmin, getalladmin, getadmin, registeradmin, loginadmin, adminprofile, changeadminpass, addmanger, updatemanager, deletemanager, getallmanager, getmanager } = require("../controller/admin.controller");
const {verifyadmintoken} = require("../middleware/verifytoken");
const routes = express.Router();
const uploadsImage = require("../middleware/uploadsimage");

routes.get("/",verifyadmintoken,getalladmin);
routes.get("/single-admin/:id",verifyadmintoken,getadmin);
routes.get("/my-profile",verifyadmintoken,adminprofile);
routes.post("/add-admin",verifyadmintoken,uploadsImage.single("ProfileImage"),addadmin);
routes.put("/update-admin/:id",verifyadmintoken,uploadsImage.single("ProfileImage"),updateadmin);
routes.delete("/delete-admin/:id",verifyadmintoken,uploadsImage.single("ProfileImage"),deleteadmin);
routes.post("/change-password",verifyadmintoken,changeadminpass);
routes.post("/register",uploadsImage.single("ProfileImage"),registeradmin);
routes.post("/login",loginadmin);


// admin manager 


routes.post("/add-manager",verifyadmintoken,uploadsImage.single("ProfileImage"),addmanger);
routes.put("/update-manager/:id",verifyadmintoken,uploadsImage.single("ProfileImage"),updatemanager);
routes.delete("/delete-manager/:id",verifyadmintoken,uploadsImage.single("ProfileImage"),deletemanager);
routes.get("/manager",verifyadmintoken,getallmanager);
routes.get("/single-manager/:id",verifyadmintoken,getmanager);



module.exports = routes;


