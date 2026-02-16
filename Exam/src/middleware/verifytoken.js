const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const Admin = require("../model/admin.model");
const User =  require("../model/user.model");


// admin Token

const verifyadmintoken = async (req, res, next) => {
    // console.log(req.headers.authorization);
    let authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "no authorization" });
    }
    let token =  authorization.split(" ")[1];
    const {adminid} = jwt.verify(token, "role-admin");
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
// user token
const verifyusertoken = async (req, res, next) => {
    // console.log(req.headers.authorization);
    let authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "no authorization" });
    }
    let token =  authorization.split(" ")[1];
    const {userid} = jwt.verify(token, "role-user");
    // console.log(userid);
    let user = await User.findById(userid);
    if(user){
        req.user = user,
        next();
    }
    else{
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"something went wrong"});   
    }
}


module.exports = {verifyadmintoken,verifyusertoken};

