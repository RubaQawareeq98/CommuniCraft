const express = require("express");
const mysql = require("mysql2");
const app = express.Router();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456789",
  database: "CommuniCraft",
  connectionLimit: 10,
});

// Route to get all projects
app.get("/home", (req, res) => {
  connection.query(
    `SELECT project_id, title FROM projects`,
    (err, result, fields) => {
      if (err) {
        console.log("Error:", err);
        return res.status(500).send("Internal Server Error");
      }

      let responseString = ""; // Declare responseString variable here

      // Iterate over the result array
      result.forEach((item, index) => {
        responseString += `ID of project : ${item.project_id}, Name: ${item.title}`;
        if (index !== result.length - 1) {
          responseString += "\n"; // Add a newline if it's not the last item
        }
      });

      res.setHeader("Content-Type", "text/plain");
      res.send(responseString);
    }
  );
});

app.get("/home/project/:id/:action", (req, res) => {
  const projectId = req.params.id;
  const actionUser = req.params.action;
  // Check if the project ID is valid
  if (isNaN(projectId)) {
    return res.status(400).send("Invalid project ID");
  }

  // Parse the value sent in the request body
  //  const action = req.body.action;

  // Check the value of the action
  if (actionUser === "1") {
    // If action is "1", retrieve description of the project

    connection.query(
      `SELECT title, description, difficulty_level, materials FROM projects
      WHERE project_id = ?`,
      [projectId],
      (err, result, fields) => {
        if (err) {
          console.log("Error executing query:", err);
          return res.status(500).send("Internal Server Error");
        }

        if (result.length === 0) {
          return res.status(404).send("Project not found");
        }

        let responseString = ""; // Declare responseString variable here

        // Iterate over the result array
        result.forEach((item, index) => {
          const materials =
            typeof item.materials === "string"
              ? JSON.parse(item.materials)
              : item.materials;
          const formattedMaterials = Array.isArray(materials)
            ? materials.join(", ")
            : materials;

          responseString += `Name: ${item.title}, Description: ${item.description}, Difficulty Level: ${item.difficulty_level}, The Materials: ${formattedMaterials}`;
          if (index !== result.length - 1) {
            responseString += "\n"; // Add a newline if it's not the last item
          }
        });

        res.setHeader("Content-Type", "text/plain");
        res.send(responseString);
        //     res.send("The in formation about Project:" + result[0].description);
      }
    );
  } else if (actionUser === "2") {
    connection.query(
      `SELECT firstName ,lastName,email,phone
      FROM users 
      INNER JOIN projectcollaborators ON users.id = projectcollaborators.user_id 
      WHERE projectcollaborators.project_id = ? LIMIT 0, 25`,
      [projectId],
      (err, result, fields) => {
        if (err) {
          console.log("Error executing query:", err);
          return res.status(500).send("Internal Server Error");
        }

        if (result.length === 0) {
          return res.status(404).send("User not found for the project");
        }

        let responseString = "";
        result.forEach((item, index) => {
          const materials =
            typeof item.materials === "string"
              ? JSON.parse(item.materials)
              : item.materials;
          const formattedMaterials = Array.isArray(materials)
            ? materials.join(", ")
            : materials;

          responseString += `Name: ${
            item.firstName + " " + item.lastName
          }, Email: ${item.email}, Phone: ${item.phone}`;
          if (index !== result.length - 1) {
            responseString += "\n"; // Add a newline if it's not the last item
          }
        });

        res.setHeader("Content-Type", "text/plain");
        res.send(responseString);
        //     res.send("The in formation ab
      }
    );
  } else {
    // If action is not recognized, return an error response
    return res.status(400).send("Invalid action");
  }
});

// Start the server
module.exports = app;