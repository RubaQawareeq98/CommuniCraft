const http = require('http')
const express = require('express')
const app = express()


app.use(express.json())
const t = require('./routes/authentication')
let x = t.router
const workshop = require('./routes/workshop');
const skill = require('./routes/skill');
const login = require('./routes/login')
const project = require('./routes/project')
const activite = require('./routes/activite')
const task = require('./routes/task')
app.use('/api',x,skill,login)
app.use('/project',x, project)
app.use('/workshop',x, workshop)
app.use('/activite',x, activite)
app.use('/tast',x, task)


app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})