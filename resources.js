const express = require('express');
const router = express.Router()
const mysql=require ("mysql");
const { Sequelize, DataTypes } = require('sequelize');

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

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'CommuniCraft'
  });
  connection.connect();

/*
  // Create Sequelize instance
  const sequelize = new Sequelize('CommuniCraft', 'root', '123456789', {
    host: 'localhost',
    dialect: 'mysql', // or any other dialect
  });
  */
  /*
  // Define your model
  const resources = sequelize.define('resources', {
    // Define your table columns here
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Price: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      Borrowed: {
        type: DataTypes.BOOLEAN,
        allowNull:false
      },
      OwnerID: {
      type : DataTypes.INTEGER,
      allowNull:false
      },
      BorrowerID: {
        type : DataTypes.INTEGER,
        allowNull:true
        }

  });
  
  // Synchronize the model with the database
  const resourcesSync=(async () => {
    try {
      // Sync your model with the database
      await resources.sync({ force: true }); // This will drop the table if it already exists and create a new one
      console.log('Table created successfully');
    } catch (error) {
      console.error('Error creating table:', error);
    } finally {
      // Close the Sequelize connection
      sequelize.close();
    }
  });
  resourcesSync();
  */
  router.post('/add-resource', async (req, res) => {
    if (sessionUtils.isLoggedIn(req.session)) {
      const user = sessionUtils.getLoggedInUser(req.session);
     // res.sendStatus(200)
      userID=user.id
      console.log(userID)   
    try {
       
        const resource = req.body
        console.log(resource)
        
       const sql = `INSERT INTO resources 
          (Name, Description , Price, Borrowed, OwnerID) 
          VALUES (?, ?, ?, ?, ?)`;
    let workshopId = 0
// Execute the query
    connection.query(sql, [
        resource.Name,
        resource.Description,
        resource.Price,
        false,
        user.id,
       
    ], (error, results) => {
      if (error) {
        res.send('Error inserting resource:'+ error);
      } else {
        res.send('resource inserted successfully:'+ results.insertId);
        
      }
    })}
    catch {}
  }
    else {
      res.send("you must log in")
   }
});
  router.get('/', async (req, res) => {
    try {
       
        const sql =`SELECT ID,Name,Description,Price,Borrowed,OwnerID  FROM resources`;
        
        connection.query(sql, (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            results.forEach(resource => {
              console.log('Name:', resource.Name);
              console.log('Description:', resource.Description);
              console.log('Owner ID:', resource.ownerID);
              if(resource.Borrowed) {
                console.log("Not Available");
              }
              else console.log("Available")
              console.log("Price =",resource.Price)
              console.log('---');
              });
              res.send(results)

        });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
        
    }
});
router.get('/:resourceID', async (req, res) => {
    try {
        let {resourceID}=req.params;
       
        const sql =`SELECT ID,Name,Description,Price,Borrowed,OwnerID  FROM resources WHERE ID=?`;
        
        connection.query(sql,[resourceID] ,(error, results) => {
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
router.post('/:resourceID/Borrow', async (req, res) => {
  if (sessionUtils.isLoggedIn(req.session)) {
    const user = sessionUtils.getLoggedInUser(req.session);
    const BorrowerID=user.id
        var Borrowed
        let {resourceID}=req.params;
        let {operation}=req.body
       
      //  console.log(resourceID)
      //  console.log(operation)
        try {
        const sql =`SELECT Borrowed FROM resources WHERE ID=?`;
        connection.query(sql,[resourceID] ,(error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
           
          Borrowed=results[0].Borrowed
          if(operation==="Borrow" && Borrowed===0 )
          {
             let  updateQuery = 'UPDATE resources SET Borrowed = 1,BorrowerID=? WHERE ID = ?';
               connection.query(updateQuery,[BorrowerID,resourceID],(err,res)=>{
                if(err)
                {
                   console.error(err);
                   return res.status(500).json({ message: 'Internal Server Error' });
                }
       
                })
              
              res.send("Done")
          }
           else if(operation==="Borrow" &&Borrowed===1)
           {
              res.send("It's already borrowed")
           }
          else if(operation==="Return" &&Borrowed===1 )
           {
              let  updateQuery = 'UPDATE resources SET Borrowed = 0 WHERE ID = ?';
                connection.query(updateQuery,[resourceID],(err,res)=>{
                    if(err)
                    {
                       console.error(err);
                       return res.status(500).json({ message: 'Internal Server Error' });
                    }
           
                    })
               res.send("the resource is returned")
           }
            else if(operation==="Return" &&Borrowed===0)
            {
               res.send("It's not borrowed")
            }
        });
      
       
         
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
        
    }
  }
  else{
    res.send("you must log in before")
  }
});
router.delete('/:resourceID',async (req,res) => {
  
  let resourseID  = req.params.resourceID;
  if (sessionUtils.isLoggedIn(req.session)) {
    const user = sessionUtils.getLoggedInUser(req.session);
    let ownerID=user.id
    try {
    const sql =`SELECT OwnerID  FROM resources WHERE ID=?`;
        
    connection.query(sql,[resourseID] ,(error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        ownerID=results[0]

        
    });
  }
  catch(err){res.send("resource not found")}
   if(user.id===ownerID){

let sql=`DELETE FROM resources WHERE ID=?`
try {
    connection.query(sql,[resourseID],(err,res)=>{
    if(err)
    {    res.send("error")
        console.log(err)
        
    }
  
    })
    res.send("deleted successfully")
}
catch(err)
{
    console.log(err)
    res.status(500).send("error")
}
  }

else{res.send("you are not the owner")}
}
else{
res.send("you must log in ")
  }
})
router.put('/:resourceID',async(req,res)=>{
  let resourceID=req.params.resourceID;
  if (sessionUtils.isLoggedIn(req.session)) {
    const user = sessionUtils.getLoggedInUser(req.session);
    let ownerID=user.id
    try {
      const sql =`SELECT OwnerID  FROM resources WHERE ID=?`;
          
      connection.query(sql,[resourceID] ,(error, results) => {
          if (error) {
              console.error(error);
              return res.status(500).json({ message: 'Internal Server Error' });
          }
          ownerID=results[0] 
      });
    }
    catch(err){res.send("resource not found")}
     if(user.id===ownerID){
let {Name,Description,Price}=req.body
let sql=`UPDATE resources SET Name=?,Description=?,Price=? WHERE ID=?` 
try{
connection.query(sql,[Name,Description,Price,resourceID],(err,result)=>{
if(err)
{
   return res.send("err") 
   console.log(err)
}
res.send("updated successfully")
}
)


}
catch(err)
{
    res.send(err)
}
  }

else {
  res.send("you are not the owner")
}
  }
  else{
    res.send("you must log in")
  }
})




module.exports=router;

