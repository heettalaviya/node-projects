const express = require("express");
let port = 7016;
const app = express();

const dbconnect = require("./config/db.connect");
dbconnect();

app.use(express.urlencoded());
app.use(express.json());

app.use("/uploads",express.static("src/uploads"));
app.use("/api",require("./routes/index.routes"));

app.listen(port, () => {
    console.log(`server is starting http://localhost:${port}`);
})