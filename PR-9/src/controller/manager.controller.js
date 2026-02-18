const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { StatusCodes } = require("http-status-codes")
const Manager = require("../model/manager.model");
const Employee = require("../model/employee.model");
const sendMail = require("../middleware/sendmailconfig");


exports.loginmanager = async (req, res) => {
    try {
        let manager = await Manager.findOne({ Email: req.body.Email , isdelete: false});
        if (!manager) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Manager not found" });
        }
        let machpassword = await bcrypt.compare(req.body.Password, manager.Passsword);
        if (!machpassword) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "password not mach" });
        }
        let payload = {
            managerid: manager._id
        }
        let token = jwt.sign(payload, "role-web");
        return res.status(StatusCodes.OK).json({ message: "Manager login successfully", manager, token });
    }
    catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "something went wrong" });
    }
}

exports.managerprofile = async (req, res) => {
    try {
        let manager = req.manager;
        if (!manager || manager.isdelete == true) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "manager not found" });
        }
        return res.status(StatusCodes.OK).json({ message: "manager profile", manager });
    }
    catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "something went wrong" });
    }
}

exports.addemployee = async (req, res) => {
    try {
        const exist = await Employee.findOne({ Email: req.body.Email , isdelete: false});
        if (exist) {
            return res.status(StatusCodes.CONFLICT).json({ message: "employee already exist" });
        }
        let imagepath = req.file ? `/uploads/${req.file.filename}` : "";

        let hashpassword = await bcrypt.hash(req.body.Passsword, 10);
        let employee = await Employee.create({
            ...req.body,
            Passsword: hashpassword,
            ProfileImage: imagepath,
            createdBy: req.manager._id,
            createdByModel: "manager",
            updatedBy: req.manager._id,
            updatedByModel: "manager"
        })

        sendMail({
            from: "denishadashlani@gmail.com",
            to: employee.Email,
            subject: "Welcome Employee",
            html: `
                <h2>Welcome ${employee.Firstname}</h2>
                <p>You are added as Employee.</p>
                <p>Email: ${employee.Email}</p>
                <p>Password: ${req.body.Passsword}</p>
            `
        });

        if (!employee) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "employee not found" });
        }
        return res.status(StatusCodes.CREATED).json({ message: "employee added successfully", employee });
    }
    catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "something went wrong" });
    }
}


exports.updateemployee = async (req, res) => {
    try {
        const id = req.params.id;
        let employee = await Employee.findById(id);
        if (!employee || employee.isdelete == true) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "employee not found" });
        }
        let filepath = " ";
        if (req.file) {
            if (employee.ProfileImage != "") {
                let filepath = path.join(__dirname, "..", employee.ProfileImage);
                try {
                    await fs.unlinkSync(filepath);
                }
                catch (err) {
                    console.log("file is missing");
                }
            }
            filepath = `/uploads/${req.file.filename}`;
        }
        employee = await Employee.findByIdAndUpdate(id, { ...req.body, ProfileImage: filepath }, { new: true });
        return res.status(StatusCodes.OK).json({ message: "employee updated successfully", employee });
    }
    catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "something went wrong" });
    }
}

exports.deleteemployee = async (req, res) => {
    try {
        const id = req.params.id;
        let employee = await Employee.findById(id);
        if (!employee || employee.isdelete == true) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "employee not found" });
        }
        // if (employee.ProfileImage != "") {
        //     filepath = path.join(__dirname, "..", employee.ProfileImage);
        // }
        // try {
        //     fs.unlinkSync(filepath);
        // }
        // catch (err) {
        //     console.log("file is missing");
        // }
        await Employee.findByIdAndUpdate(employee._id, { isdelete: true }, { new: true });
        return res.status(StatusCodes.OK).json({ message: "employee deleted successfully" });
    }
    catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "something went wrong" });
    }
}

// get all employee

exports.getallemployee = async (req, res) => {
    try {
        let employee = await Employee.find({isdelete: false}).populate("createdBy").populate("updatedBy");
        if (!employee) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "employee not found" });
        }
        return res.status(StatusCodes.OK).json({ message: "employee found successfully", employee });
    }
    catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "something went wrong" });
    }
}
// single employee

exports.getemployee = async (req, res) => {
    try {
        const id = req.params.id;
        let employee = await Employee.findById(id).populate("createdBy").populate("updatedBy");
        if (!employee || employee.isdelete == true) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "employee not found" });
        }
        return res.status(StatusCodes.OK).json({ message: "employee found successfully", employee });
    }
    catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "something went wrong" });
    }
}

exports.updatemanagerprofie = async (req, res) => {
    try {
        const id = req.manager._id;
        let manager = await Manager.findById(id);
        if (!manager || manager.isdelete == true) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "manager not found" });
        }
        manager = await Manager.findByIdAndUpdate(id, { ...req.body }, { new: true });
        return res.status(StatusCodes.OK).json({ message: "manager updated successfully", manager });
    }
    catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "something went wrong" });
    }
}


// denu@gmail.com
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYW5hZ2VyaWQiOiI2OThiZjlmOTQ0YzE5ODU5ZWEwMDJhZGEiLCJpYXQiOjE3NzA3ODM0MjB9.iLmu-rfFbrWG2vx23A7FmKQvmw4BfBTrIeSDBKzSTpo 