const Admin = require("../model/admin.model");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const Manager = require("../model/manager.model");
const sendMail = require("../middleware/sendmailconfig");

exports.getalladmin = async (req, res) => {
    try {
        let admin = await Admin.find({ isdelete: false });
        if (!admin) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "admin not found" });
        }
        return res.status(StatusCodes.OK).json({ message: "admin found successfully", admin });
    }
    catch (err) {
        console.log(err);
    }
}

exports.getadmin = async (req, res) => {
    try {
        let id = req.params.id;
        let admin = await Admin.findById(id);
        if (!admin || admin.isdelete == true) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "admin not found" });
        }
        return res.status(StatusCodes.OK).json({ message: "admin found successfully", admin });
    }
    catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "something went wrong" });
    }
}

exports.addadmin = async (req, res) => {
    try {
        let imagepath = req.file ? `/uploads/${req.file.filename}` : "";
        let hashpassword = await bcrypt.hash(req.body.Passsword, 10);
        let admin = await Admin.create({
            ...req.body,
            Passsword: hashpassword,
            ProfileImage: imagepath
        })
        if (!admin || admin.isdelete == true) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "admin not found" });
        }
        return res.status(StatusCodes.CREATED).json({ message: "admin added successfully", admin });
    }
    catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "something went wrong" });
    }
}

exports.updateadmin = async (req, res) => {
    try {
        let id = req.params.id;
        let admin = await Admin.findById(id);
        if (!admin || admin.isdelete == true) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "admin not found" });
        }
        let filepath = "";
        if (req.file) {
            if (admin.ProfileImage != "") {
                let filepath = path.join(__dirname, "..", admin.ProfileImage);
                try {
                    await fs.unlinkSync(filepath);
                }
                catch (err) {
                    console.log("file is missing");
                }
            }
            filepath = `/uploads/${req.file.filename}`;
        }
        else {
            filepath = admin.ProfileImage;
        }
        admin = await Admin.findByIdAndUpdate(id, { ...req.body, ProfileImage: filepath }, { new: true });
        if (admin) {
            return res.status(StatusCodes.OK).json({ message: "admin upadted sucessfully", admin });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "something went wrong" });
    }
}

exports.deleteadmin = async (req, res) => {
    try {
        let id = req.params.id;
        let admin = await Admin.findById(id);
        if (!admin || admin.isdelete == true) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "admin not found" });
        }
        // let filepath = "";
        // if (admin.ProfileImage != "") {
        //     filepath = path.join(__dirname, "..", admin.ProfileImage);
        // }
        // try {
        //     await fs.unlinkSync(filepath);
        // }
        // catch (err) {
        //     console.log("file is missing");
        // }
        await Admin.findByIdAndUpdate(admin._id, { isdelete: true }, { new: true });
        return res.status(StatusCodes.OK).json({ message: "admin deleted successfully" });

    }
    catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "something went wrong" });
    }
}

exports.registeradmin = async (req, res) => {
    try {
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);

        let admin = await Admin.findOne({ Email: req.body.Email, isdelete: false });
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

exports.loginadmin = async (req, res) => {
    try {
        let admin = await Admin.findOne({ Email: req.body.Email, isdelete: false });
        if (!admin) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "admin not found" });
        }
        let machpassword = await bcrypt.compare(req.body.Password, admin.Passsword);
        if (!machpassword) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "password not mach" });
        }
        let payload = {
            adminid: admin._id
        }
        let token = jwt.sign(payload, "role-web");
        return res.status(StatusCodes.OK).json({ message: "admin login successfully", admin, token });
    }
    catch (err) {
        console.log(err);

    }
}

exports.adminprofile = async (req, res) => {
    try {
        let admin = req.admin;
        if (!admin || admin.isdelete == true) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "admin not found" });
        }
        return res.status(StatusCodes.OK).json({ message: "admin profile", admin });
    }
    catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "something went wrong" });
    }
}

exports.changeadminpass = async (req, res) => {
    try {
        const { oldpass, newpass, cpassword } = req.body;
        let admin = req.admin;
        if (!admin || admin.isdelete == true) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "admin not found" });
        }
        let matchpass = await bcrypt.compare(oldpass, admin.Passsword);
        if (!matchpass) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "old password is incorrect" });
        }
        if (newpass == cpassword) {
            let hashpassword = await bcrypt.hash(newpass, 10);
            await Admin.findByIdAndUpdate(admin._id, { Passsword: hashpassword }, { new: true });
            return res.status(StatusCodes.OK).json({ message: "password changed successfully" });
        }
        else {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "new password and confirm password is not same" });
        }

    }
    catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong"
        });
    }
};

// add manager 

exports.addmanger = async (req, res) => {
    try {
        const exist = await Manager.findOne({ Email: req.body.Email, isdelete: false });
        if (exist) {
            return res.status(StatusCodes.CONFLICT).json({ message: "manager already exist" });
        }
        let imagepath = req.file ? `/uploads/${req.file.filename}` : "";

        let hashpassword = await bcrypt.hash(req.body.Passsword, 10);
        let manager = await Manager.create({
            ...req.body,
            Passsword: hashpassword,
            ProfileImage: imagepath,
            createdBy: req.admin._id,
            updatedBy: req.admin._id
        })

        await sendMail({
            from: "denishadashlani@gmail.com",
            to: manager.Email,
            subject: "Welcome Manager",
            html: `
                <h2>Welcome ${manager.Firstname}</h2>
                <p>You are added as Manager.</p>
                <p>Email: ${manager.Email}</p>
                <p>Password: ${req.body.Passsword}</p>
            `
        });

        if (!manager) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "manager not found" });
        }
        return res.status(StatusCodes.CREATED).json({ message: "manager added successfully", manager });
    }
    catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "something went wrong" });
    }
}


// update manager

exports.updatemanager = async (req, res) => {
    try {
        const id = req.params.id;
        let manager = await Manager.findById(id);
        if (!manager || manager.isdelete == true) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "manager not found" });
        }
        let filepath = " ";
        if (req.file) {
            if (manager.ProfileImage != "") {
                let filepath = path.join(__dirname, "..", manager.ProfileImage);
                try {
                    await fs.unlinkSync(filepath);
                }
                catch (err) {
                    console.log("file is missing");
                }
            }
            filepath = `/uploads/${req.file.filename}`;
        }
        manager = await Manager.findByIdAndUpdate(id, { ...req.body, ProfileImage: filepath }, { new: true });
        return res.status(StatusCodes.OK).json({ message: "manager updated successfully", manager });
    }
    catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "something went wrong" });
    }
}

// delete manager

exports.deletemanager = async (req, res) => {
    try {
        const id = req.params.id;
        let manager = await Manager.findById(id);
        if (!manager || manager.isdelete == true) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "manager not found" });
        }
        // if (manager.ProfileImage != "") {
        //     filepath = path.join(__dirname, "..", manager.ProfileImage);
        // }
        // try {
        //     fs.unlinkSync(filepath);
        // }
        // catch (err) {
        //     console.log("file is missing");
        // }
        await Manager.findByIdAndUpdate(manager._id, { isdelete: true }, { new: true });
        return res.status(StatusCodes.OK).json({ message: "manager deleted successfully" });
    }
    catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "something went wrong" });
    }
}

// get all manager

exports.getallmanager = async (req, res) => {
    try {
        let manager = await Manager.find({isdelete: false}).populate("createdBy").populate("updatedBy");
        if (!manager) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "manager not found" });
        }
        return res.status(StatusCodes.OK).json({ message: "manager found successfully", manager });
    }
    catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "something went wrong" });
    }
}

// single manager

exports.getmanager = async (req, res) => {
    try {
        const id = req.params.id;
        let manager = await Manager.findById(id).populate("createdBy").populate("updatedBy");
        if (!manager || isdelete == true) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "manager not found" });
        }
        return res.status(StatusCodes.OK).json({ message: "manager found successfully", manager });
    }
    catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "something went wrong" });
    }
}




// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbmlkIjoiNjk4YjJlZTdkNWM4YzhhOWM5MmUzYTlhIiwiaWF0IjoxNzcwNzI5ODg4fQ.GzeWY8WR4CoX77B4eTTJKWwvyM7PwTpnXrr-UCjEg4c

// denisha
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbmlkIjoiNjk4YjZkMDRlODcxN2I4Mzc3ZWRjN2I4IiwiaWF0IjoxNzcwNzQ1MTMyfQ.DjkevzKKCpdgGPdD7refkxgIDn48ypsCPDEwAdEy48M