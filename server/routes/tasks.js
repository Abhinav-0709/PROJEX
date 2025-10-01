const router = require('express').Router();
let Task = require('../models/Task'); // Import the Task model

// --- GET ALL TASKS ---
// Handles GET requests to http://localhost:5001/tasks/
router.route('/').get((req, res) => {
    Task.find()
        .then(tasks => res.json(tasks))
        .catch(err => res.status(400).json('Error: ' + err));
});

// --- ADD NEW TASK --- 
// Handles POST requests to http://localhost:5001/tasks/add
router.route('/add').post((req, res) => {
    const title = req.body.title;
    const newTask = new Task({ title });

    newTask.save()
        .then(() => res.json('Task added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

// --- UPDATE TASK (BY ID) ---
// This route is flexible. It can be used to update the title or the completion status.
router.route('/update/:id').post((req, res) => {
    Task.findById(req.params.id)
        .then(task => {
            // Check which fields are provided in the request and update them
            if (req.body.title) {
                task.title = req.body.title;
            }
            if (req.body.isCompleted !== undefined) {
                task.isCompleted = req.body.isCompleted;
            }
            
            task.save()
                .then(() => res.json('Task updated!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

// --- DELETE TASK (BY ID) ---
// Handles DELETE requests to http://localhost:5001/tasks/12345
router.route('/:id').delete((req, res) => {
    Task.findByIdAndDelete(req.params.id)
        .then(() => res.json('Task deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;

