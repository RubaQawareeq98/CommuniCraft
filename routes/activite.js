const express = require('express');
const router = express.Router()
const mysql = require('mysql2')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456789',
  database: 'CommuniCraft'
});
const sessionUtils = require('./authentication')
const session = require('express-session');
router.use(session({
  name: process.env.SESSION_NAME,
  key: process.env.SESSION_KEY,
  secret: "123456",
  // store: sessionStore,
  resave: false,
  saveUninitialized: false
}))
connection.connect();
  //do action of project  or do modifay
router.post('/newactivites', async(req,res)=>{

  const Activities = req.body.router.post('/newactivites', async(req,res)=>{
          const activites = req.body.Activities
          const sql = `INSERT INTO activites
            (  action_description , data_occure, time_occure,project_id, user_id ) 
            VALUES ( ?, ?, ?, ?, ?)`;
      let activitiesId = 0
// Execute the query
      connection.query(sql, [
        
        activites.action_description,
        activites.data_occure,
        activites.time_occure,
        activites.project_id,
        activites.user_id
      ], (error, results) => {
        if (error) {
          console.error('Error performing activity:', error);
          res.status(500).send('Error creating activity'); // Return error to client
        }
         else {
          const affectedRows = results.affectedRows || 0; // Handle potential undefined value

          if (affectedRows === 1) {
            console.log(`Someone do action of project : ${Activities.project_id}`);
            res.status(201).send({ message: 'Activity created successfully', project_id: Activities.project_id }); // Return success with project ID
          } else {
            console.log('No activities inserted.'); // Handle unexpected scenario
            res.status(500).send('Unexpected error during activity creation'); // Return error
          }
        }
       });
      }
     );
});
 
//to show all action of project
router.get('/get-activities-by-project-id', async (req, res) => {
  const projectId = parseInt(req.body.projectId); // Extract project ID from request body

  if (isNaN(projectId)) { // Validate project ID
    return res.status(400).send('Invalid project ');
  }

  // Use a prepared statement to prevent SQL injection
  const sql = `SELECT * FROM activities WHERE project_id = ?`;

  connection.query(sql, [projectId], (error, results) => {
    if (error) {
      console.error('Error fetching activities:', error);
      res.status(500).send('Error retrieving activities');
    } else {
      res.status(200).json(results); // Send the activities as a JSON response
    }
  });
});

//delete action 
router.delete('/delete-activity/:activityId', async (req, res) => {
  const activityId = parseInt(req.params.activityId); // Extract activity ID from URL params

  if (isNaN(activityId)) { // Validate activity ID
    return res.status(400).send('Invalid activity ID');
  }

  // Use a prepared statement to prevent SQL injection
  const sql = `DELETE FROM activities WHERE id = ?`;

  connection.query(sql, [activityId], (error, results) => {
    if (error) {
      console.error('Error deleting activity:', error);
      res.status(500).send('Error deleting activity');
    } else {
      res.status(200).send('Activity deleted successfully');
      console.log(`Activity with ID ${activityId} deleted successfully`); // Log a more informative message
    }
  });
});

router.put('/update-activity', async (req, res) => {
  const activityId = parseInt(req.body.user_id); // Extract activity ID from request body
  const updatedActivity = req.body; // Updated activity data

  if (isNaN(activityId)) { // Validate activity ID
    return res.status(400).send('Invalid activity ID');
  }

  // Validate any other required fields in `updatedActivity` based on your schema

  // Use a prepared statement to prevent SQL injection
  const sql = `UPDATE activities SET action_description = ?, data_occure = ? time_occure = ? 
  WHERE id = ?`;

  connection.query(sql, [updatedActivity, activityId], (error, results) => {
    if (error) {
      console.error('Error updating activity:', error);
      res.status(500).send('Error updating activity');
    } else if (results.affectedRows === 0) { // Check if any rows were affected
      res.status(404).send('Activity not found'); // Inform about missing activity
    } else {
      res.status(200).send('Activity updated successfully');
      console.log(`Activity with ID ${activityId} updated successfully`); // Log a more informative message
    }
  });
});
    