const Admin = require("../model/admin.model");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const Task = require("../model/task.model");

exports.adminregister = async (req, res) => {
    try {
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);

        let admin = await Admin.findOne({ Email: req.body.Email });
        if (admin) {
            return res.status(StatusCodes.CONFLICT).json({ message: "admin already exist" });
        }
        let imagepath = req.file ? `/uploads/${req.file.filename}` : "";
        let hashpassword = await bcrypt.hash(req.body.Passsword, 10);
        admin = await Admin.create({
            ...req.body,
            Passsword: hashpassword,
            ProfileImage: imagepath
        })
        if (!admin) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "admin not found" });
        }
        return res.status(StatusCodes.CREATED).json({ message: "admin added successfully", admin });
    }
    catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "something went wrong" });
    }
}

exports.adminlogin = async (req, res) => {
    try {
        let admin = await Admin.findOne({ Email: req.body.Email });
        if (!admin) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "admin not found" });
        }
        let machpassword = await bcrypt.compare(req.body.Passsword, admin.Passsword);
        if (!machpassword) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "password not mach" });
        }
        let payload = {
            adminid: admin._id
        }
        let token = jwt.sign(payload, "role-admin");
        return res.status(StatusCodes.OK).json({ message: "admin login successfully", admin, token });
    }
    catch (err) {
        console.log(err);

    }
}

exports.addtask = async (req, res) => {
    try {

        let imagepath = req.file ? `/uploads/${req.file.filename}` : "";
        let task = await Task.create({
            taskName: req.body.taskName,
            description: req.body.description,
            taskImage: imagepath,
            createdBy: req.admin._id,

        })

        if (!task) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "task not found" });
        }
        return res.status(StatusCodes.CREATED).json({ message: "task added successfully", task });
    }
    catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "something went wrong" });
    }
}

exports.updatetask = async (req, res) => {
    try {
        const id = req.params.id;
        let task = await Task.findById(id);
        if (!task) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "task not found" });
        }
        let filepath = " ";
        if (req.file) {
            if (task.taskImage != "") {
                let filepath = path.join(__dirname, "..", task.taskImage);
                try {
                    await fs.unlinkSync(filepath);
                }
                catch (err) {
                    console.log("file is missing");
                }
            }
            filepath = `/uploads/${req.file.filename}`;
        }
        task = await Task.findByIdAndUpdate(id, { ...req.body, taskImage: filepath }, { new: true });
        return res.status(StatusCodes.OK).json({ message: "task updated successfully", task });
    }
    catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "something went wrong" });
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

exports.deletetask = async (req, res) => {
    try {
        const id = req.params.id;
        let task = await Task.findById(id);
        if (!task) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "task not found" });
        }
        if (task.taskImage != "") {
            filepath = path.join(__dirname, "..", task.taskImage);
        }
        try {
            fs.unlinkSync(filepath);
        }
        catch (err) {
            console.log("file is missing");
        }
        await Task.findByIdAndDelete(id, { new: true });
        return res.status(StatusCodes.OK).json({ message: "task deleted successfully" });
    }
    catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "something went wrong" });
    }
}

exports.getalltask = async (req, res) => {
    try {
        let task = await Task.find({});
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

