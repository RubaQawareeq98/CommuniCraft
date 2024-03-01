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
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('CommuniCraft', 'root', '123456789', {
    host: 'localhost',
    dialect: 'mysql'
  });
  const auth = require('./authentication')
  


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



  router.put('/addProject', auth.verifyJWT, async(req,res)=>{
    if (sessionUtils.isLoggedIn(req.session)) {
      const user = sessionUtils.getLoggedInUser(req.session);
    try {
    const newProject = new Project(req.body);
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
    let collaborators = req.body["collabrators"]
    collaborators.push(user.email)
    addCollaborator(savedProject.project_id,collaborators)
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating project' });
  }

}
else{
  res.send("You must login before")
}
  })


  function addCollaborator(project_id, collaborators){
    collaborators.map(col=>{
      const sql = `SELECT id FROM users WHERE email = ?`;
      connection.query(sql, [col], async (error, results) => {
        if (error) {
          console.error(error);
        }
        console.log(results[0])
        let user_id = results[0].id
        
        try {
          const newProject = new ProjectCollaborator({project_id, user_id});
          const savedProject = await newProject.save();
         
        } catch (err) {
          console.error(err);
        }

    })
  })}


    // Endpoint for users to send a request to join a project
router.post('/request', async (req, res) => {
  const  projectId  = req.body.projectId;
  if (sessionUtils.isLoggedIn(req.session)) {
    const user = sessionUtils.getLoggedInUser(req.session);
    const userId = user.id

  try {

    const sql = 'SELECT * FROM collaboration_requests WHERE project_id = ? AND user_id = ?'

    connection.query(sql, [projectId, userId], async (error, results) => {
      if (error) {
        console.error(error);
      }
      
    // Check if the request already exists
    
    if (results.length > 0) {
      return res.status(400).json({ message: 'Request already exists' });
    }

    else{

    const query = 'INSERT INTO collaboration_requests (project_id, user_id) VALUES (?, ?)'

    connection.query(query, [projectId, userId], async (error, results) => {
      if (error) {
        console.error(error);
      }
  })

    res.json({ message: 'Request sent successfully' });
   
}
})
}
catch(err){
  res.send("There is a problem")
}
  }
else{
  res.send("You must login before")
}
  }
);

// Endpoint for project collaborators to accept or reject requests
router.put('/projects/:projectId/request/:requestId', async (req, res) => {
  const { projectId, requestId} = req.params;
  const { status } = req.body;

  try {
    const sql = 'UPDATE collaboration_requests SET status = ? WHERE id = ? AND project_id = ?';
    connection.query(sql, [status, requestId, projectId], async (error, results) => {
      if (error) {
        console.error('Error updating request:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
      res.json({ message: 'Request updated successfully' });
    });
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
  
});

  router.get('/myProjects', (req,res)=>{
    if (sessionUtils.isLoggedIn(req.session)) {
      const user = sessionUtils.getLoggedInUser(req.session);
      const sql = `SELECT p.*
                  FROM projects p
                  INNER JOIN projectcollaborators pc ON p.project_id = pc.project_id
                  WHERE pc.user_id = ?
      `
      connection.query(sql, [user.id], async (error, results) => {
        if (error) {
          console.error(error);
        }
        
        
        try {
          res.send(results)
         
        } catch (err) {
          console.error(err);
        }
    })

  }
    else{
      res.send("You must login before")
    }
  })

  
    
  router.get('/search', async (req, res) => {
    const validation = req.body;
    if (validation.error) {
      return res.status(400).json({ message: validation.error.details[0].message });
    }
  
    const { query, skills, materials, categories } = validation;
    let searchQuery = 'SELECT * FROM projects WHERE ';
    let searchParams = [];
  
    if (query) {
      searchQuery += `(title LIKE ? OR description LIKE ?)`;
      searchParams.push(`%${query}%`, `%${query}%`);
    }
  
    if (skills && skills.length > 0) {
      searchQuery += ' AND skills && ?';
      searchParams.push(skills); // Assuming skills are already validated as an array of strings
    }
  
    if (materials && materials.length > 0) {
        const sql = 'SELECT * FROM projects WHERE JSON_CONTAINS(materials, ?)'
        connection.query(sql, [JSON.stringify(materials)], (error, results) => {
            res.send(results)
        });


    } 
    if (categories && categories.length > 0) {
        searchQuery += `OR difficulty_level LIKE ?`;
        searchParams.push(`%${categories}%`, `%${categories}%`);
    }
  
    
  
    try {
      connection.query(searchQuery, searchParams, (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.send(results);
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error searching projects' });
    }
  });
  

  module.exports =router;

 