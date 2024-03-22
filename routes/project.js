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
  
  const Activities = sequelize.define('activities', {
    activity_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    action_description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    data_occure: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    time_occure: {
      type: DataTypes.INTEGER, // Adjust data type if needed
      allowNull: false
    },
    project_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'projects',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    }
  });

  const Task = sequelize.define('task', {
    task_id:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title_task:{
    type: DataTypes.STRING,
    allowNull: false
  },
  description:{
    type: DataTypes.TEXT,
      allowNull: false
},
status:{
  type: DataTypes.ENUM('To_Do', ' In_Progress', 'completed'),
  allowNull: false
},
due_date:{
  type: DataTypes.DATEONLY,
      allowNull: false
},
created_at:{
  type: DataTypes.DATE,
  allowNull: false,
  defaultValue: Sequelize.NOW
},
updated_at:{
  type: DataTypes.DATE,
  allowNull: false,
  defaultValue: Sequelize.NOW
},
project_id: {
  type: DataTypes.INTEGER,
  references: {
    model: 'projects',
    key: 'id'
  },
  onDelete: 'CASCADE'
},
assigned_to: {
  type: DataTypes.INTEGER,
  references: {
    model: 'users',
    key: 'id'
  },
  onDelete: 'CASCADE'
}

 });

  router.put('/addProject', auth.verifyJWT, async(req,res)=>{
    if (sessionUtils.isLoggedIn(req.session)) {
      const user = sessionUtils.getLoggedInUser(req.session);
    try {
    const newProject = new Project(req.body);
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
    let collaborators = req.body["collabrators"]
    console.log(collaborators)
    collaborators.push(user.email)
    addCollaborator(2,collaborators)
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating project' });
  }
}
else{
  res.send("You must login before")
}
 } )
  function addCollaborator(project_id, collaborators){
    
    collaborators.map(col=>{
      
      const sql = `SELECT id FROM users where email =?`;
      
      connection.query(sql, [col], async (error, results) => {
        if (error) {
          console.error(error);
        }
      
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
router.post('/request/:projectId', async (req, res) => {
  const  projectId  = parseInt(req.params.projectId);
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
  if (sessionUtils.isLoggedIn(req.session)) {
    const user = sessionUtils.getLoggedInUser(req.session);
  
  const { projectId, requestId} = req.params;
  const { status } = req.body;
  var users =[]
  const query = `select user_id from projectcollaborators where project_id =?`
  connection.query(query, [projectId], async (error, results) => {
    if (error) {
      console.error('Error getting collaborators:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    for(let id of results){
      users.push(id["user_id"])
    }
    if(users.includes(user.id)){
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
    }
    else{
      res.send("You don't have previlage to access this project")
    }
  });
}
else{
  res.send("You must login")
}
 
  
  
});

  router.get('/myProjects', (req,res)=>{
    if (sessionUtils.isLoggedIn(req.session)) {
      const user = sessionUtils.getLoggedInUser(req.session);
      const sql = `SELECT p.title
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

  
    
  router.post('/updateProject/:projectID', async (req, res) => {
    const projectID = Number(req.params.projectID)
    const {title, descriptio, estimated_time ,collabrators, group_size} = req.body
  let sql = `UPDATE projects SET`;

  // Build the SQL query dynamically based on the provided fields
  const fieldsToUpdate = [];
  if (title) fieldsToUpdate.push(`title = '${title}'`);
  if (descriptio) fieldsToUpdate.push(`description = '${descriptio}'`);
  if (estimated_time) fieldsToUpdate.push(`estimated_time = ${estimated_time}`);
  if (collabrators) fieldsToUpdate.push(`collabrators = ${collabrators}`);
  if (group_size)  fieldsToUpdate.push(`group_size = ${group_size}`);
  
  sql += ' ' + fieldsToUpdate.join(', ') + ` WHERE id = ${projectID}`;

  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.error('Error updating user: ' + error.message);
      return;
    }
    res.send('Project information updated successfully');
  });
  });
  router.get('/search', async (req, res) => {
    const validation = req.body;
    if (validation.error) {
      return res.status(400).json({ message: validation.error.details[0].message });
    }
  
    const { title, skills, materials, categories } = validation;
    let searchQuery = 'SELECT * FROM projects WHERE ';
    let searchParams = [];
  
    if (title) {
      searchQuery += `(title LIKE ? OR description LIKE ?)`;
      searchParams.push(`%${title}%`, `%${title}%`);
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
  
  router.delete('/project/:projectId', async (req,res)=>{
    const projectId = Number(req.params.projectId)
    const sql = `DELETE FROM projects WHERE project_id = ?`;

  connection.query(sql, [projectId], (error, results) => {
    if (error) {
      console.error('Error deleting project:', error);
      res.status(500).send('Error deleting activity');
    } else {
      res.status(200).send('Project deleted successfully');
      console.log(`PRoject with ID ${projectId} deleted successfully`); // Log a more informative message
    }
  });
  })


  module.exports =router;

 