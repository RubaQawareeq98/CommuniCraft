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
const passport = require('passport');
router.use(session({
  name: process.env.SESSION_NAME,
  key: process.env.SESSION_KEY,
  secret: "123456",
  // store: sessionStore,
  resave: false,
  saveUninitialized: false
}))
router.get('/p', (req, res) => {
  if (sessionUtils.isLoggedIn(req.session)) {
      const user = sessionUtils.getLoggedInUser(req.session);
      res.json({ user });
  } else {
      res.status(401).json({ message: 'User not logged in' });
  }
});



connection.connect();
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('CommuniCraft', 'root', '123456789', {
    host: 'localhost',
    dialect: 'mysql'
  });
  const auth = require('./authentication')
  

  const Skill = sequelize.define('Skill', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    
});
const UserSkill = sequelize.define('UserSkill', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
   
    skillId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
   
    
});
  router.put('/addskills',auth.verifyJWT, async (req, res) => {
    if (sessionUtils.isLoggedIn(req.session)) {
      const user = sessionUtils.getLoggedInUser(req.session);
    
    try {
      const newSkill = await Skill.create({
        id: Number(req.body.id),
        name: req.body.name,
        description: req.body.description,
      });
      const user_skill = await UserSkill.create({
        userId: user.id,
        skillId: Number(req.body.id),
      });
      res.send("New Skill created:");
    } catch (error) {
      res.status(500).send("Error creating new Skill");
    }
  }
  else{
    res.send("You must loggin before")
  }
  });
    

  router.get('/sameskills', auth.verifyJWT, async (req, res) => {
    if (sessionUtils.isLoggedIn(req.session)) {
      const user = sessionUtils.getLoggedInUser(req.session);
      try {
        const userId = user.id;
        const sql = `
        SELECT u.firstName, u.email
        FROM users AS u
        INNER JOIN userskills AS us ON u.id = us.userId
        INNER JOIN userskills AS us2 ON us.skillID = us2.skillID
        WHERE us2.userId = ?;
        `;
        connection.query(sql, [userId], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            const userIDs = results.map(row => row.userID);
            res.send(results);
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }


    }
  else{
    res.send("You must loggin before")
  }
     
  })

 
  module.exports =router;

 