if (process.env.NODE_ENV !== "production") {
  require("dotenv").config(); //load all variables in this file
}
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;

const express = require("express");
const app = express(); // create server
const fs = require("fs");

app.set("view engine", "ejs"); //set our frontend to use ejs in order to render its view
app.use(express.json());
app.use(express.static("client")); // tell the app where all of these frontend file are

app.get("/store", function (req, res) {
  fs.readFile("items.json", function (error, data) {
    if (error) {
      res.status(500).end();
    } else {
      res.render("store.ejs", {
        items: JSON.parse(data),
      });
    }
  });
});
app.listen(3000); //port to listen
