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

  
  router.get('/users-by-skill', async (req, res) => {
    try {
        const { skillName } = req.body;
        const sql = `
            SELECT  u.firstName, u.lastName, email, phone, address
            FROM users u
            JOIN userSkills us ON u.id = us.userID
            JOIN skills s ON us.skillID = s.id
            WHERE s.name = ?
        `;
        connection.query(sql, [skillName], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            res.json(results);
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



  router.post('/newWorkshops', async(req,res)=>{
          const workshop = req.body.workshop
          const sql = `INSERT INTO workshops 
            (title, description , date_time, location, duration, organizer, capacity, registrationDeadline, registrationFee, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      let workshopId = 0
// Execute the query
      connection.query(sql, [
        workshop.title,
        workshop.description,
        workshop.date_time,
        workshop.location,
        workshop.duration,
        workshop.organizer,
        workshop.capacity,
        workshop.registrationDeadline,
        workshop.registrationFee,
        workshop.status
      ], (error, results) => {
        if (error) {
          console.error('Error inserting workshop:', error);
        } else {
          console.log('Workshop inserted successfully:', results.insertId);
          workshopId = results.insertId
        }
});
      const emails = req.body.trainer
     

      emails.map(col=>{
        const sql = `SELECT id FROM users WHERE email = ?`;
        connection.query(sql, [col], async (error, results) => {
          if (error) {
            console.error(error);
          }
          let user_id = results[0].id
          
          const query = `INSERT INTO workshop_trainers 
            (workshop_id,trainer_id) 
            VALUES (?, ?)`;
      
// Execute the query
      connection.query(query, [
        workshopId,
        user_id
      ], (error, results) => {
        if (error) {
          console.error('Error inserting workshop:', error);
        } else {
          console.log('Workshop inserted successfully:', results.insertId);
          workshopId = results.insertId
        }
});
  
      })
    })

  })

  

  router.get('/workshops', (req,res)=>{
    // SQL query to get all available workshops with trainers' names
      const sql = `SELECT w.*, GROUP_CONCAT(t.firstName, t.lastName, email) AS trainers
      FROM workshops w
      LEFT JOIN workshop_trainers wt ON w.eventId = wt.workshop_id
      LEFT JOIN users t ON wt.trainer_id = t.id
      WHERE w.status = 'upcoming'
      GROUP BY w.eventId`;
      
      
      // Execute the query
      connection.query(sql, (error, results) => {
      if (error) {
      console.error('Error fetching workshops:', error);
      } else {
      console.log('Available Workshops with Trainers:');
      results.forEach(workshop => {
      console.log('Workshop:', workshop.title);
      console.log('Trainers:', workshop.trainers);
      console.log('---');
      });
      res.send(results)
}
});
  })
 
 

  router.put('/workshop-register', (req,res)=>{
    // Assuming workshopId is the ID of the workshop the user is applying for
const workshopId = req.body.workshopId;

// Retrieve the current number of available seats for the workshop
const sqlSelect = 'SELECT available_seats FROM workshops WHERE eventId = ?';
connection.query(sqlSelect, [workshopId], (error, results) => {
  if (error) {
    console.error('Error retrieving available seats:', error);
    // Handle error appropriately
    return;

  }
  if (results.length === 0) {
    console.error('Workshop not found');
    // Handle case where workshop with given ID doesn't exist
    return;
  }

  const currentAvailableSeats = results[0].available_seats;

  // Check if there are available seats
  if (currentAvailableSeats > 0) {
    if (sessionUtils.isLoggedIn(req.session)) {
      const user = sessionUtils.getLoggedInUser(req.session);
      connection.query(
        'INSERT INTO workshop_applications (workshop_id, name, email, contact_info) VALUES (?, ?,?,?)',
        [workshopId, user.firstName, user.email,user.phone],
        (error, results) => {
          if (error) {
            console.error('Error inserting workshop application:', error);
            // Handle error appropriately
          } else {
            console.log('Workshop application inserted successfully');
          }
        }
      );
    }
    else
    res.send("You must login before")


    
    


    // Decrement the number of available seats by 1
    const newAvailableSeats = currentAvailableSeats - 1;

    // Update the available_seats column in the workshops table
    const sqlUpdate = 'UPDATE workshops SET available_seats = ? WHERE eventId = ?';
    connection.query(sqlUpdate, [newAvailableSeats, workshopId], (updateError, updateResults) => {
      if (updateError) {
        console.error('Error updating available seats:', updateError);
        // Handle error appropriately
        return;
      }

      console.log('Available seats updated successfully');
      // Proceed with the user's application process
    });
  } else {
    res.send('No available seats');
    // Handle case where there are no available seats
  }
});

  })

  module.exports =router;
