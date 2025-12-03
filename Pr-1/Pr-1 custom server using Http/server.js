const http = require('http');
const fs = require('fs');
const server = http.createServer(
    (req, res) => {
        let filepath = "";
        // console.log(req.url);

        switch (req.url) {
            case "/":
                filepath = "./home.html";
                break;
            case "/home.html":
                filepath = "./home.html";
                break;
            case "/about.html":
                filepath = "./about.html";
                break;
            case "/contect.html":
                filepath = "./contect.html";
                break;
            default:
                filepath = "./notfound.html";
                break;
        }

        let data = fs.readFileSync(filepath, 'utf-8')
        res.end(data)
    }
)
//3rd step : server creat thayu
server.listen(8005, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log("server start at http://localhost:8005")
    }

}
);                                                                                     //server create


