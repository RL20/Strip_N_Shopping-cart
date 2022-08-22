const express = require("express");
const app = express(); // create server
app.set("view engine", "ejs");
app.use(express.static("client")); // the public site
app.listen(3000); //port to listen
