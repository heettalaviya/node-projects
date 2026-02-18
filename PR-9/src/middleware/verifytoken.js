const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const Admin = require("../model/admin.model");
const Manager = require("../model/manager.model");
const Employee = require("../model/employee.model");


// admin Token

const verifyadmintoken = async (req, res, next) => {
    // console.log(req.headers.authorization);
    let authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "no authorization" });
    }
    let token =  authorization.split(" ")[1];
    const {adminid} = jwt.verify(token, "role-web");
    // console.log(adminid);
    let admin = await Admin.findById(adminid);
    if(admin){
        req.admin = admin,
        next();
    }
    else{
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"something went wrong"});   
    }
}

// manager Token

const verifiymanagertoken = async (req, res, next) => {
    // console.log(req.headers.authorization);
    let authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "no authorization" });
    }
    let token =  authorization.split(" ")[1];
    const {managerid} = jwt.verify(token, "role-web");
    // console.log(managerid);
    let manager = await Manager.findById(managerid);
    if(manager){
        req.manager = manager,
        next();
    }
    else{
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"something went wrong"});   
    }
}
const verifiyemployeetoken = async (req, res, next) => {
    // console.log(req.headers.authorization);
    let authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "no authorization" });
    }
    let token =  authorization.split(" ")[1];
    const {managerid} = jwt.verify(token, "role-web");
    // console.log(managerid);
    let employee = await Employee.findById(managerid);
    if(employee){
        req.employee = employee,
        next();
    }
    else{
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"something went wrong"});   
    }
}


module.exports = {verifyadmintoken,verifiymanagertoken,verifiyemployeetoken};

