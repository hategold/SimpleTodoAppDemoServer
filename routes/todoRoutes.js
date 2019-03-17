const express = require('express');
const todoRoutes = express.Router();
const calendarApi = require('../apiControllers/calendarApiController');

let TodoSummary = require('../todoSummary.model'); 
let TodoDetail = require('../todoDetail.model');

todoRoutes.route('/').get(function (req, res) {
    TodoSummary.find(function (err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
});

todoRoutes.route('/:id').get(function (req, res) {
    let id = req.params.id;
    TodoSummary.findById(id, function (err, todo) {
        res.json(todo);
    });
});

todoRoutes.route('/detail/:id').get(function (req, res) {
    let id = req.params.id;
    TodoDetail.findById(id, function (err, todoDetail) {
        res.json(todoDetail);
    });
});

todoRoutes.route('/complete/:summaryId').get(function (req, res) {
    let summaryId = req.params.summaryId;
    TodoSummary.findById(summaryId, function (err, todoSummary) {
        TodoDetail.findById(todoSummary.todo_detail, function (err, todoDetail) {
            res.json({ todoSummary: todoSummary, todoDetail: todoDetail });
        });
    });
});


todoRoutes.route('/update/:id').post(function (req, res) {
    TodoSummary.findById(req.params.id, (err, todoSummary) => {
        if (!todoSummary)
            res.status(404).send("data is not found");
        else {
            todoSummary = Object.assign(todoSummary, req.body.todoSummary);
            TodoDetail.findById(todoSummary.todo_detail, (err, todoDetail) => {
                todoDetail = Object.assign(todoDetail, req.body.todoDetail);
                todoDetail.save().then(err => {
                    todoSummary.save().then(err => {
                        var insertEventDate = {
                            "todoSummary":todoSummary,
                            "todoDetail": todoDetail
                        }
                        calendarApi.update(insertEventDate)
                        res.json('Todo updated!');
                    })
                })
            })
                .catch(err => {
                    res.status(400).send("Update not possible");
                });
        }
    });
});


todoRoutes.route('/delete/:id').get(function (req, res) {
    let id = req.params.id;
    TodoSummary.findById(id, function (err, todoSummary) {
        var toDeleteSummary = todoSummary;
        TodoDetail.findOneAndRemove(todoSummary.todo_detail, (err) => {
            if (err)
                res.status(400).send("Update not possible");
            TodoSummary.remove(toDeleteSummary, (err) => {
                if (err)
                    res.status(400).send("Update not possible");
                try{calendarApi.destroy(todoSummary._id);
                }catch(e){
                    console.log(e); 
                }
                res.json('Todo deleted!');
            });
        });
    });

});

todoRoutes.route('/add').post(function (req, res) {

    let todoDetail = new TodoDetail(req.body.todoDetail);
    
    todoDetail.save()
        .then(todoDetail => {
            req.body.todoSummary.todo_detail = todoDetail;
            let todoSummary = new TodoSummary(req.body.todoSummary);
            todoSummary.save()
                .then(err => { 
                    var insertEventDate = {
                        "todoSummary":todoSummary,
                        "todoDetail": todoDetail
                    }
                    calendarApi.create(insertEventDate)
                    
                    res.status(200).json({ 'todo': 'todo added successfully' }); })
                .catch(err => {
                    res.status(400).send('adding new todo failed');
                });

        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });

});


module.exports = todoRoutes;
