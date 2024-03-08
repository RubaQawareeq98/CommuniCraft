const express = require('express');
const router = express.Router()
const mysql = require('mysql2')
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('CommuniCraft', 'root', '123456789', {
    host: 'localhost',
    dialect: 'mysql'
  });
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'CommuniCraft'
  });
  connection.connect()
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



router.get('/info', async (req, res) => {

    try {
        const skill = await Skill.findAll();
        res.send(skill);
    } catch (error) {
        
        console.error("Error fetching users");
    }
});

router.get('/mySkills', async (req, res) => {
  if (sessionUtils.isLoggedIn(req.session)) {
    const user = sessionUtils.getLoggedInUser(req.session);
    try {
      const sql = `
      SELECT s.name, s.description
      FROM userSkills us
      JOIN skills s ON us.skillId = s.id
      WHERE us.userId = ?;
`;

connection.query(sql, [user.id], (error, results) => {
 if (error) {
     return [];
 }
 else
  
    res.json( {results} );
}) 
    
}
catch (error) {
      
  console.error("Error fetching Skills  ", error);
}
  }
else {
  res.status(401).json({ message: 'User not logged in' });
}
});


// // Add new Skill
router.put('/addSkill', async (req, res) => {
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
      skillId: Number(req.body.skillId),
    });
    res.send("New Skill created:");
  } catch (error) {
    res.status(500).send("Error creating new Skill");
  }
} else {
  res.status(401).json({ message: 'User not logged in' });
}
});


router.post('/updateSkill/:skillId', async (req, res) => {
  const skillId = parseInt(req.params.skillId);
  if (sessionUtils.isLoggedIn(req.session)) {
    const {name, description} = req.body
    const sql = `update skills set name =?, description = ?
    where id = ?
    `

connection.query(sql, [name, description, skillId], (error, results) => {
 if (error) {
     console.log(error)
 }
  else
    res.send("Your skill information updated successffully")
})
  }
  else {
  res.status(401).json({ message: 'User not logged in' });
}
});

router.delete('/deleteSkill/:skillId', async (req, res) => {
  const skillId = parseInt(req.params.skillId);
  if (sessionUtils.isLoggedIn(req.session)) {
    const {name, description} = req.body
    const sql = `DELETE FROM skills WHERE id = ?
    `

connection.query(sql, [skillId], (error, results) => {
 if (error) {
     console.log(error)
 }
  else
    res.send("Your skill Deleted successfully")
})
  }
  else {
  res.status(401).json({ message: 'User not logged in' });
}
});

module.exports =router;