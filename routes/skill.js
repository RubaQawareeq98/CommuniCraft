const express = require('express');
const router = express.Router()

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('CommuniCraft', 'root', '123456789', {
    host: 'localhost',
    dialect: 'mysql'
  });
  
  
  
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



  async function createTable() {
    try {
      await UserSkill.sync({force:true});
      console.log('Table created successfully');
    } catch (error) {
      console.error('Error creating table:', error);
    }
  }

  // createTable()
router.get('/info', async (req, res) => {

    try {
        const skill = await Skill.findAll();
        res.send(skill);
    } catch (error) {
        
        console.error("Error fetching users");
    }
});
router.get('/skills', async (req, res) => {

    try {
        const skill = await Skill.findAll();
        res.send(skill);
    } catch (error) {
        
        console.error("Error fetching users");
    }
});


// // Add new Skill
router.put('/addSkill', async (req, res) => {
  try {
    const newSkill = await Skill.create({
      id: Number(req.body.id),
      name: req.body.name,
      description: req.body.description,
    });
    const user_skill = await UserSkill.create({
      userId: Number(req.body.userId),
      skillId: Number(req.body.skillId),
    });
    res.send("New Skill created:");
  } catch (error) {
    res.status(500).send("Error creating new Skill");
  }
});

// const mysql = require('mysql2');

// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '123456789',
//   database: 'CommuniCraft'
// });

// connection.connect();

// const query = `
// SELECT u.*, s.name FROM users u 
// JOIN userSkills us ON u.id = us.userId
//  JOIN skills s ON us.skillId = s.id;`;

// connection.query(query, (error, results, fields) => {
//   if (error) {
//     console.error('Error executing query:');
//     return;
//   }
//   console.log('Users with their skills:', results);
// });

// connection.end();


module.exports =router;