const http = require('http')
const express = require('express')
const app = express()


//   Update an employee record
//   (async () => {
//     try {
//       const employeeToUpdate = await Employee.findOne({ where: { email: 'john.doe@example.com' } });
//       if (employeeToUpdate) {
//         await employeeToUpdate.update({ department: 'Marketing' });
//         console.log("Employee updated successfully");
//       } else {
//         console.log("Employee not found");
//       }
//     } catch (error) {
//       console.error("Error updating employee:", error);
//     }
//   })();
  
  // Delete an employee record
//   (async () => {
//     try {
//       const employeeToDelete = await Employee.findOne({ where: { email: 'john.doe@example.com' } });
//       if (employeeToDelete) {
//         await employeeToDelete.destroy();
//         console.log("Employee deleted successfully");
//       } else {
//         console.log("Employee not found");
//       }
//     } catch (error) {
//       console.error("Error deleting employee:", error);
//     }
//   })();

app.use(express.json())
const t = require('./routes/authentication')
let x = t.router
const workshop = require('./routes/workshop');
const skill = require('./routes/skill');
const login = require('./routes/login')
const project = require('./routes/project')
app.use('/api',x,skill,login)
app.use('/project',x, project)
app.use('/workshop',x, workshop)


app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})