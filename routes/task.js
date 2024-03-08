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
router.post('/newtask', async (req, res) => {
    const task = req.body.task; // Assuming the task data is sent in the request body
  
    const sql = `INSERT INTO tasks
      (title, description,  status, due_date,created_at, updated_at,project_id,assigned_to )
      VALUES (?, ?, ?, ?, ?, ?,?,?)`;

    connection.query(sql, [
    
      task.title_task,
      task.description,
      task.status,
      task.due_date,
      task.created_at,
      task.updated_at,
      task.project_id,
      task.assigned_to
    ], (error, results) => {
      if (error) {
        console.error('Error creating task:', error);
        res.status(500).send('Error creating task'); // Return error to client
      } else {
        const affectedRows = results.affectedRows || 0; // Handle potential undefined value
  
        if (affectedRows === 1) {
          console.log(`New task added with ID: ${results.insertId}`);
          res.status(201).send({ message: 'Task created successfully', task_id: results.insertId }); // Return success with task ID
        } else {
          console.log('No task inserted.'); // Handle unexpected scenario
          res.status(500).send('Unexpected error during task creation'); // Return error
        }
      }
    });
});

    router.get('/tasks/:userId', async (req, res) => {
        const userId = req.params.userId; // Get the user ID from the request parameters
      
        const sql = `SELECT * FROM tasks WHERE assigned_to = ?`;
      
        connection.query(sql, userId, (error, results) => {
          if (error) {
            console.error('Error fetching tasks:', error);
            res.status(500).send('Error fetching tasks'); // Return error to client
          } else {
            if (results.length > 0) {
              console.log(`Tasks for user ID ${userId}:`);
              console.log(results);
              res.status(200).send(results); // Return tasks for the user ID
            } else {
              console.log('No tasks found for the user ID.'); // Handle scenario where no tasks are found
              res.status(404).send('No tasks found for the user ID');
            }
          }
        });
     
        router.put('/tasks/:taskId/status', async (req, res) => {
            const taskId = req.params.taskId; // Get the task ID from the request parameters
        
            // Check if the request body contains a new status
            if (!req.body.status) {
                res.status(400).send({ message: 'Missing required field: status' });
                return; // Exit the function if status is missing
            }
        
            const updatedStatus = req.body.status; // Get the updated status from the request body
        
            const sql = `
                UPDATE tasks
                SET status = ?
                WHERE task_id = ?
            `;
        
            connection.query(sql, [updatedStatus, taskId], (error, results) => {
                if (error) {
                    console.error('Error updating task status:', error);
                    res.status(500).send('Error updating task status'); // Return error to client
                } else {
                    if (results.affectedRows > 0) {
                        console.log(` task with ID ${taskId} is "${updatedStatus}".`);
                      
                        res.status(200).send({ message: 'Task status updated successfully', task_id: taskId });
                    } else {
                        console.log(`Task with ID ${taskId} either not found or no changes made.`);
                        res.status(404).send('Task not found or no changes made.');
                    }
                }
            });
        });

  });

  module.exports = router