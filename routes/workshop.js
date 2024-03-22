const express = require('express');
const router = express.Router()
const mysql = require('mysql2')
const getData = require('./weather')
const getLocation = require('./place')
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

  

  router.get('/workshops', async (req,res)=>{
    // SQL query to get all available workshops with trainers' names
      const sql = `SELECT w.*, GROUP_CONCAT(t.firstName, t.lastName, email) AS trainers
      FROM workshops w
      LEFT JOIN workshop_trainers wt ON w.eventId = wt.workshop_id
      LEFT JOIN users t ON wt.trainer_id = t.id
      WHERE w.status = 'upcoming'
      GROUP BY w.eventId`;
      
      
      // Execute the query
      connection.query(sql, async (error, results) => {
      if (error) {
      console.error('Error fetching workshops:', error);
      } else {
      console.log('Available Workshops with Trainers:');
      var workshops = []
        results.map(workshop=>{
          workshops.push({"Title":workshop.title,
          "Date":workshop.date_time, "Status": workshop.status
          })
          })
   
     res.send(workshops)
      
      
}
});
  })
 
async function getWeather(workshop){
 
    const dateString = String (workshop.date_time);
        const dateObj = new Date(dateString);
        const year = dateObj.getFullYear();
        const month = ("0" + (dateObj.getMonth() + 1)).slice(-2); // Adding 1 to month because month is zero-based
        const day = ("0" + dateObj.getDate()).slice(-2);
        const formattedDate = `${year}-${month}-${day}`;
        let data = await getData(workshop.location,formattedDate)
        console.log(data)
  return data
 }

router.get('/workshops/:workshopId', async(req,res)=>{
  let workshopId = Number (req.params.workshopId)
  const sql = `SELECT w.*, GROUP_CONCAT(t.firstName, t.lastName, email) AS trainers
  FROM workshops w
  LEFT JOIN workshop_trainers wt ON w.eventId = wt.workshop_id
  LEFT JOIN users t ON wt.trainer_id = t.id
  WHERE w.eventId = ${workshopId};`  
  
  // Execute the query
  connection.query(sql, async (error, results) => {
  if (error) {
  console.error('Error fetching workshops:', error);
  } else {
         const data = await getWeather(results[0]) 
        var weather = {"Workshop": results, "The weather at this day": data}
        
    res.send(weather)
  }
})
})
router.get('/location/:workshopId', async(req,res)=>{
  let workshopId = Number (req.params.workshopId)
  const sql = `SELECT w.*, GROUP_CONCAT(t.firstName, t.lastName, email) AS trainers
  FROM workshops w
  LEFT JOIN workshop_trainers wt ON w.eventId = wt.workshop_id
  LEFT JOIN users t ON wt.trainer_id = t.id
  WHERE w.eventId = ${workshopId};`  
  
  // Execute the query
  connection.query(sql, async (error, results) => {
  if (error) {
  console.error('Error fetching workshops:', error);
  } else {
         const data = getDetails(results[0].location, res) 
        
  }
})
})

function getDetails(location, res){
  getLocation(location)
    .then(locationInfo => res.send({"Location": locationInfo.displayName}))
    .catch(error => console.error(error));



}


  router.put('/workshop-register/:workshopId', (req,res)=>{
    // Assuming workshopId is the ID of the workshop the user is applying for
const workshopId = Number(req.params.workshopId);

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

  router.delete('/workshop/:workshopID', async (req,res)=>{
    const workshopId = Number(req.params.workshopID)
    const sql = `DELETE FROM workshops WHERE event_id = ?`;

  connection.query(sql, [workshopId], (error, results) => {
    if (error) {
      console.error('Error deleting workshop:', error);
      res.status(500).send('Error deleting workshop');
    } else {
      res.status(200).send('Workshop deleted successfully');
      console.log(`Workshop with ID ${workshopId} deleted successfully`); // Log a more informative message
    }
  });
  })


  module.exports =router;
