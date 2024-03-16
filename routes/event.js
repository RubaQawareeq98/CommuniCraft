const express = require("express");
const mysql = require("mysql");
const app = express.Router();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "advance",
  connectionLimit: 10,
});
app.get("/event", (req, res) => {
  connection.query(
    `SELECT title ,location,date_time,registrationFee FROM workshops`,
    (err, result, fields) => {
      if (err) {
        console.log("Error:", err);
        return res.status(500).send("Internal Server Error");
      }

      let responseString = ""; // Declare responseString variable here

      // Iterate over the result array
      result.forEach((item, index) => {
        responseString += `event : ${item.title}, location: ${item.location},at time : ${item.date_time},registration : ${item.registrationFee}`;
        if (index !== result.length - 1) {
          responseString += "\n"; // Add a newline if it's not the last item
        }
      });

      res.setHeader("Content-Type", "text/plain");
      res.send(responseString);
    }
  );
});
module.exports = app;
