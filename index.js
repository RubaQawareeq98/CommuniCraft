const http = require('http')
const express = require('express')
const app = express()


app.use(express.json())
const t = require('./routes/authentication')
let auth = t.router
const workshop = require('./routes/workshop');
const skill = require('./routes/skill');
const login = require('./routes/login')
const project = require('./routes/project')
const activite = require('./routes/activite')
const task = require('./routes/task')
const resources = require('./routes/resources')
const eventRouter = require("./routes/events"); // Change to eventRouter
const homePage = require("./routes/home")
app.use('/events',eventRouter); // Mount the homeRouter
app.use('/users',auth,login)
app.use('/skills',auth,skill)
app.use('/project',auth, project)
app.use('/workshop',auth, workshop)
app.use('/activites',auth, activite)
app.use('/task',auth, task)
app.use('/resources',auth, resources)
app.use('/home',homePage)


app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})