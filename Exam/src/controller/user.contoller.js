const Admin = require("../model/admin.model");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const Task = require("../model/task.model");
const User =  require("../model/user.model");


exports.userregister = async (req, res) => {
    try {
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);

        let user = await User.findOne({ Email: req.body.Email });
        if (user) {
            return res.status(StatusCodes.CONFLICT).json({ message: "user already exist" });
        }
        let imagepath = req.file ? `/uploads/${req.file.filename}` : "";
        let hashpassword = await bcrypt.hash(req.body.Passsword, 10);
        user = await User.create({
            ...req.body,
            Passsword: hashpassword,
            ProfileImage: imagepath
        })
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "user not found" });
        }
        return res.status(StatusCodes.CREATED).json({ message: "user added successfully", user });
    }
    catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "something went wrong" });
    }
}

exports.userlogin = async (req, res) => {
    try {
        let user = await User.findOne({ Email: req.body.Email });
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "user not found" });
        }
        let machpassword = await bcrypt.compare(req.body.Passsword, user.Passsword);
        if (!machpassword) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "password not mach" });
        }
        let payload = {
            userid: user._id
        }
        let token = jwt.sign(payload, "role-user");
        return res.status(StatusCodes.OK).json({ message: "user login successfully", user, token });
    }
    catch (err) {
        console.log(err);

    }
}

exports.getsingletask = async (req, res) => {
    try {
        const id = req.params.id;
        let task = await Task.findById(id)
        if (!task) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "task not found" });
        }
        return res.status(StatusCodes.OK).json({ message: "task found successfully", task });
    }
    catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "something went wrong" });
    }
}

exports.getalltask = async (req, res) => {
    try {
        let task = await Task.find({  });
        if (!task) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "task not found" });
        }
        return res.status(StatusCodes.OK).json({ message: "task found successfully", task });
    }
    catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "something went wrong" });
    }
}

