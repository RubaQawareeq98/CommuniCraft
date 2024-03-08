const bcrypt = require('bcrypt'); // For password hashing
const jwt = require('jsonwebtoken'); // For token generation
const mysql = require('mysql2')
const express = require('express');
const router = express.Router()

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'CommuniCraft'
  });

const session = require('express-session');
router.use(session({
  secret: '123456', // Replace with a strong secret key
  resave: false,
  saveUninitialized: false
}));

  connection.connect();
// Register new user
router.put('/signup', async (req, res) => {
  try {
      const salt = await bcrypt.genSalt(10); // Generate a random salt
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      const user = {
          id: Number(req.body.id),
          lastName: req.body.lName,
          firstName: req.body.firstName,
          email: req.body.email,
          password: hashedPassword,
          phone: req.body.phone,
          address: req.body.address,
      };
      const sql = `INSERT INTO users (id, firstName, lastName, email, password, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      connection.query(sql, [user.id, user.firstName, user.lastName, user.email, user.password, user.phone, user.address], (error, result) => {
          if (error) {
              console.error("Error inserting user:", error);
              res.status(500).send("Error inserting user");
          } else {
              console.log(`User with ID ${result.insertId} inserted successfully!`);
              res.send("You signed up successfully!");
          }
      });
  } catch (error) {
      console.error("Error signing up:", error);
      res.status(500).send("Error signing up");
  }
});

  const secretKey = 'CommuniCraft12'; // Replace with a strong secret key
  var LoggeduserId = null;

/// Login route handler
router.post('/login', async (req, res) => {
  try {
      const sql = `SELECT * FROM users WHERE email = ?`;
      connection.query(sql, [req.body.email], async (error, results) => {
          if (error) {
              console.error(error);
              return res.status(500).json({ message: 'Internal Server Error' });
          } else {
              const user = results[0]; // Assuming the first result is the desired user

              if (!user) {
                  return res.status(401).json({ message: 'Invalid email or password' });
              }

              // Compare passwords using bcrypt
              const validPassword = await bcrypt.compare(req.body.password, user.password);
              if (!validPassword) {
                  return res.status(401).json({ message: 'Invalid email or password' });
              }

              // Store the user object in session
              req.session.user = user;

              // Generate JWT token
              const payload = { userId: user.id };
              const token = jwt.sign(payload, secretKey, { expiresIn: '3h' });

              res.json({ token });
          }
      });
  } catch (error) {
      console.error('Error in login:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Profile route handler
router.get('/profile', (req, res) => {
  // Access the logged-in user from the session
  const user = req.session.user;
  if (!user) {
      return res.status(401).json({ message: 'User not logged in' });
  }
  res.json({ user });
});

// Protected route using session
router.get('/protected', (req, res) => {
  const user = req.session.user;
  if (!user) {
      return res.status(401).json({ message: 'User not logged in' });
  }
  res.json({ message: 'Access granted to protected route' });
});

// Verify JWT middleware
const verifyJWT = (req, res, next) => {
  try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({ message: 'Unauthorized' });
      }
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, secretKey);
      req.user = decoded;
      next();
  } catch (error) {
      console.error('Error in JWT verification:', error);
      res.status(401).json({ message: 'Unauthorized' });
  }
};

// Portfolio route using JWT verification
router.get('/portfolio', verifyJWT, async (req, res) => {
  const user = req.session.user;
 
 const sql = `
 SELECT s.name
 FROM userSkills us
 JOIN skills s ON us.skillId = s.id
 WHERE us.userId = ?;
`;

connection.query(sql, [user.id], (error, results) => {
 if (error) {
     return [];
 }
 user["skills"] = results
 console.log(user)
 
 res.send(user);
});
});
router.post('/updateProfile', async(req,res)=>{
  const {firstName, lastName, phone ,address, password} = req.body
  let sql = `UPDATE users SET`;

  // Build the SQL query dynamically based on the provided fields
  const fieldsToUpdate = [];
  if (firstName) fieldsToUpdate.push(`firstName = '${firstName}'`);
  if (lastName) fieldsToUpdate.push(`lastName = '${lastName}'`);
  if (address) fieldsToUpdate.push(`address = ${address}`);
  if (phone) fieldsToUpdate.push(`phone = ${phone}`);
  if (password) {
    const hashedPassword = await bcrypt.hash(password, salt);
    fieldsToUpdate.push(`password = ${hashedPassword}`);
  }
  const user = getLoggedInUser(req.session);
  sql += ' ' + fieldsToUpdate.join(', ') + ` WHERE id = ${user.id}`;

  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.error('Error updating user: ' + error.message);
      return;
    }
    res.send('User information updated successfully');
  });
})




const isLoggedIn = (session) => {
  return session && session.user;
};
const getLoggedInUser = (session) => {
  return session.user || null;
};

module.exports = { verifyJWT, router,isLoggedIn, getLoggedInUser };
