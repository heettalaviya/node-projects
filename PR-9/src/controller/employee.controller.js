const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes")
const Employee = require("../model/employee.model");

exports.loginemployee = async (req, res) => {
    try {
        let employee = await Employee.findOne({ Email: req.body.Email , isdelete: false});
        if (!employee) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "employee not found" });
        }
        let machpassword = await bcrypt.compare(req.body.Password, employee.Passsword);
        if (!machpassword) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "password not mach" });
        }
        let payload = {
            employeeid: employee._id
        }
        let token = jwt.sign(payload, "role-web");
        return res.status(StatusCodes.OK).json({ message: "employee login successfully", employee, token });
    }
    catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "something went wrong" });
    }
}

exports.employeeprofile = async (req, res) => {
    try {
        let employee = req.employee;
        if (!employee || employee.isdelete == true) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "manager not found" });
        }
        return res.status(StatusCodes.OK).json({ message: "manager profile", employee });
    }
    catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "something went wrong" });
    }
}

exports.updateemployeeprofie = async (req, res) => {
    try {
        const id = req.employee._id;
        let employee = await Employee.findById(id);
        if (!employee || employee.isdelete == true) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Employee not found" });
        }
        employee = await Employee.findByIdAndUpdate(id, { ...req.body }, { new: true });
        return res.status(StatusCodes.OK).json({ message: "Employee updated successfully", employee });
    }
    catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "something went wrong" });
    }
}


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZWlkIjoiNjk4YzYwNzZmOGQ3NGUxNGY4YzQ0YjIwIiwiaWF0IjoxNzcwODE0NDM1fQ.l74wAMyA2AYheZ9_zX9PH6Kbm0kt__OO3jVPEZxbNQ8