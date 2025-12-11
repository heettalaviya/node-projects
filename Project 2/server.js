const express = require("express");
const server = express();

server.set("view engine", "ejs");

let Task = [
 
    {
        id: '102',
        Title: 'Water the Plants',
        Description: "Water indoor and balcony plants",
        Priority: "Low",
        // DueDate: "2025-11-10"
    },
    {
        id: '103',
        Title: "Clean Desktop Folder",
        Description: "Organize project files and delete unnecessary documents",
        Priority: "Medium",
        // DueDate: "2025-11-12"
    },
];

server.get("/", (req, res) => {
    res.render("index",{Task});
});

server.use(express.urlencoded());

server.post("/add-task",(req,res)=>{
    Task.push(req.body);
    return res.redirect("/");
})

server.get("/delete-task/:id",(req,res)=>{
    // console.log(req.params);
    let id = req.params.id;
    Task = Task.filter(task =>
        task.id !=id
    )    
    return res.redirect("/");
})

server.get("/edit-task/:id",(req,res)=>{
    // console.log(req.params);
    let record = Task.find(task => task.id == req.params.id);
    // console.log(record);
    return res.render("edittask",{Task:record});
})

server.post('/updatetask', (req, res) => {
    // console.log(req.body);
    // console.log(req.query);
    const { Taskid } = req.query;

    let updatetask = Task.map(task => 
        {
        if (task.id == Taskid) {
            return {
                ...req.body,
                id:Taskid
            }
        } else {
            return task;
        }
    });

    Task = updatetask;

    return res.redirect("/");
});


server.listen(2108, () => {
    console.log("Server is starting at http://localhost:2108");
});