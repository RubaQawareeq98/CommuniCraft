const express = require('express');
const router = express.Router()

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('CommuniCraft', 'root', '123456789', {
    host: 'localhost',
    dialect: 'mysql'
  });
  
  
const ProjectCategory = sequelize.define('ProjectCategory', {
  category_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true  // Ensure unique category names
  }
});

  
  const User = sequelize.define('User', {
      id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
      },
      firstName: {
          type: DataTypes.STRING,
          allowNull: false
      },
      lastName: {
          type: DataTypes.STRING,
          allowNull: false
      },
      email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
        
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false
      },
  });
  const Category = sequelize.define('Category', {
      skillId: {
          type: DataTypes.INTEGER,
          allowNull: false,
      },
      size: {
        type: DataTypes.JSON,
          allowNull: false,
      },
      color: {
        type: DataTypes.JSON,
        allowNull: false
      }
    
  });


  
  

  const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456789',
  database: 'CommuniCraft'
});

connection.connect();
router.get('/users', async (req, res) => {
    
let query = `
SELECT u.*, s.name FROM users u 
JOIN userSkills us ON u.id = us.userId
 JOIN skills s ON us.skillId = s.id;`;
let result

connection.query(query, (error, results, fields) => {
  if (error) {
    console.error('Error executing query:');
    return;
  }
  result = results
  // res.send(results);
});

 query = `
  SELECT s.*, c.*
  FROM skills s
  JOIN categories c ON s.id = c.skillId
`;

connection.query(query, (error, resu, fields) => {
  if (error) {
    console.error('Error executing query:', error);
    return;
  }
  result.push(resu[0])
  console.log(result)
  res.send(result);
});


// connection.end();

    // try {
    //     const users = await User.findAll();
    //     res.send(users);
    // } catch (error) {

    //     console.error("Error fetching users");
    // }
});


// // Add new User
router.put('/addUser', async (req, res) => {
  try {
    const newUser = await User.create({
      id: Number(req.body.id),
      lastName: req.body.lName,
      firstName: req.body.fName,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      address: req.body.address
    });
    res.send("New User created:");
    console.log("New User created:");
  } catch (error) {
    console.error("Error creating new employee:", error);
    res.status(500).send("Error creating new user");
  }
});


  // //Get by ID Method
router.get('/getUser', async (req, res) => {
    try {
        let k = Number(req.body.id)
      
       const user = await User.findOne({ where: { id } });
        if (user) {
          res.send('User found:', user.toJSON());
        } else {
          res.send('User not found');
        }
      } catch (error) {
        console.error('Error retrieving user:', error);
      }
})

router.put('/cat', async (req, res) => {
  try {
    const cat = await Category.create({
      skillId: Number(req.body.skillId),
      size: req.body.size,
      color: req.body.color
    });
    console.log("New Category created:", cat);
    res.status(201).json(cat); // Send created category as response
  } catch (error) {
    console.error("Error creating new cat:", error);
    res.status(500).send("Error creating new category");
  }
});

// ////////////////

// Define the Project model
const Project = sequelize.define('Project', {
  project_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  materials: {
    type:DataTypes.JSON,
    allowNull:false
  },
  // category_id: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false,
  //   references: {
  //     model: 'Category', // Assuming you have a Category table
  //     key: 'category_id'
  //   }
  // },
  difficulty_level: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    allowNull: false
  },
  estimated_time: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  group_size: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  }
}, {
  // Add timestamps for automatic creation and update timestamps (optional)
  timestamps: true
});


const ProjectCollaborator = sequelize.define('ProjectCollaborator', {
  project_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'Projects',
      key: 'project_id'
    },
    onDelete: 'CASCADE' // Delete collaborators when project is deleted
  },
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE' // Delete collaborators when user is deleted
  },
  joined_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  }
}, {
  // Add timestamps for automatic creation and update timestamps (optional)
  timestamps: true
});

// Create the table (synchronizes the model with the database)
// (async () => {
//   try {
//     await ProjectCollaborator.sync();
//     console.log('ProjectCollaborator table created successfully!');
//   } catch (error) {
//     console.error('Error creating ProjectCollaborator table:');
//   }
// })();
// async function createTable() {
//   try {
//     await Project.sync();
//     console.log('Table created successfully');
//   } catch (error) {
//     console.error('Error creating table:', error);
//   }
// }

// createTable()


// Project.update({
//   attributes: {
//     ...Project.attributes, // Include existing attributes
//     materials: {
//       type: DataTypes.ARRAY(DataTypes.STRING),
//       allowNull: true, // Adjust as needed
//     }
//   }
// }, {
//   where: {} // Empty where clause to update all existing projects
// });

router.post('/projects', async (req, res) => {
  try {
    const newProject = new Project(req.body);
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating project' });
  }
});
module.exports = router;