const express = require('express');
const Model = require('../models/model');
const router = express.Router()

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('ruba', 'root', '123456789', {
    host: 'localhost',
    dialect: 'mysql'
  });
  
  
  const Employee = sequelize.define('Employee', {
      first_name: {
          type: DataTypes.STRING,
          allowNull: false
      },
      last_name: {
          type: DataTypes.STRING,
          allowNull: false
      },
      email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
      },
      hire_date: {
          type: DataTypes.DATE,
          allowNull: false
      },
      department: {
          type: DataTypes.STRING,
          allowNull: false
      }
  });
router.get('/getAll', async (req, res) => {
    
    
    try {
        const allEmployees = await Employee.findAll();
        res.send(allEmployees);
    } catch (error) {
        
        console.error("Error fetching employees:");
    }
});


// Define the 'employees' model
router.put('/addEmployee', async (req, res) => {
    try {
        const newEmployee = await Employee.create({
          first_name: req.body.fName,
          last_name: req.body.lName,
          email: req.body.email,
          hire_date: '2024-02-25',
          department: 'Marketting'
        });
        console.log("New employee created:");
      } catch (error) {
        console.error("Error creating new employee:");
  }});
module.exports = router;