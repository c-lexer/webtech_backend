let express = require("express");
let cors = require("cors");
const app = express();
app.use(express.static("public"));
app.use(cors());
let bodyParser = require("body-parser");
app.use(bodyParser.json());

const authRoutes = require("./auth");
app.use("/api/auth", authRoutes);
const bikestationRoutes = require("./bikestations");
app.use("/api/bikestations", bikestationRoutes);
const bikemodelRoutes = require("./bikemodels");
app.use("/api/bikemodels", bikemodelRoutes);
const bikecategorysRoutes = require("./bikecategorys");
app.use("/api/bikecategorys", bikecategorysRoutes);
const bikesRoutes = require("./bikes");
app.use("/api/bikes", bikesRoutes);
const usersRoutes = require("./users");
app.use("/api/users", usersRoutes);

app.get("/api", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res
    .status(200)
    .send("This is the backend for my project of Web Technologies WS23");
});

let port = 3000;
app.listen(port);
console.log("Server running at: http://localhost:" + port);
