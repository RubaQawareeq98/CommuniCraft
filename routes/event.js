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
app.get("/home/event", (req, res) => {
  connection.query(
    `SELECT title ,location,date_time,registrationFee,description,duration,date_time,status FROM workshops`,
    (err, result, fields) => {
      if (err) {
        console.log("Error:", err);
        return res.status(500).send("Internal Server Error");
      }

      let responseString = ""; // Declare responseString variable here

      // Iterate over the result array
      result.forEach((item, index) => {
        responseString += `event : ${item.title}, location: ${item.location},at time : ${item.date_time},registration : ${item.registrationFee},description: ${item.description},duration: ${item.duration},Day : ${item.date_time},status:${item.status}`;
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

