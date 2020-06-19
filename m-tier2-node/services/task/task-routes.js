const Task = require("./task-model");
var noDatabase = null;

module.exports = {
    noDB: function(url) {
        noDatabase = url;
    },
    init: function(app) {
        app.get('/', (req, res) => {
            if(noDatabase !== null) {
                res.render('nodatabase',{url: noDatabase});
            } else {
                var promises = [];
                promises.push(Task.find().lean().exec());
                Promise.all(promises).then(function(results) {
                    res.render('tasks',{tasks: results[0]});
                });
            }
        })

        app.post('/tasks',(req,res) => {
            var task = new Task(req.body);
            task.save().then(function(result){
                res.json({ok:true});
            },function(err){
                res.status(400).send(JSON.stringify(err));
            });
        })

        app.get('/tasks/:id', (req,res) => {
            Task.findById(req.params.id).lean().exec(function(err,task) {
                if(err !== undefined) {
                    res.json(JSON.stringify(task));
                } else {
                    res.status(400).send("Failed to find result");
                }
            });
        });

        app.patch('/tasks',(req,res) => {
            Task.findById({_id: req.body._id},
                function(err,doc) {
                    if(err !== undefined && err) {
                        res.status(400).send(JSON.stringify(err));
                    } else {
                        doc.name = req.body.name;
                        doc.duration = req.body.duration;
                        doc.save(function(er2) {
                            if(er2 !== undefined && er2) {
                                res.status(400).send(JSON.stringify(er2));
                            } else {
                                res.json({ok:true});
                            }
                        });
                        
                    }
                }
            );
        });

        app.delete('/tasks/:id', (req,res) => {
            Task.find({_id: req.params.id}).deleteOne().exec().then(function(result){
                if(result.n === 1) {
                    res.json({ok:true});
                } else if(result.n > 1) {
                    res.status(400).send("Unexpectedly deleted more than 1 item. Multiple unique ids?");
                } else {
                    res.status(400).send("Deletion failed");
                }
            },function(err){
                res.status(400).send(JSON.stringify(err));
            });
        });
    }
}