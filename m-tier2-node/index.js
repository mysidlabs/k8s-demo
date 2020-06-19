const express = require("express");
const path = require("path");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const port = process.env.NODE_PORT || 3001;
const dbURL = process.env.DB_URL || 'mongodb://localhost:27016/tasks';
const app = express();

mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology',true);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/view/html'); // you can change '/views' to '/public',
app.set('view engine', 'html');

var taskRoutes = require('./services/task/task-routes');
taskRoutes.init(app);

mongoose.connect(dbURL,{useNewUrlParser: true}).then(function() {
    console.log("Connected to MongoDB @ "+dbURL);
}).catch(function(err) {
    taskRoutes.noDB(dbURL);
    console.log("Connection to MongoDB database failed @ "+dbURL);
    console.log(err);
})

app.get('/css/*', function(req,res) {
    res.sendFile(path.join(__dirname + '/view'+req.path));
});

app.get('/img/*', function(req,res) {
    res.sendFile(path.join(__dirname + '/view'+req.path));
});

app.get('/js/*', function(req,res) {
    res.sendFile(path.join(__dirname + '/view'+req.path));
});

app.get('/font/*', function(req,res) {
    res.sendFile(path.join(__dirname + '/view'+req.path));
});

app.listen(port,function(result) {

});