const router = require('express').Router();
let Project = require('../models/Project');

// routes for all the projects 
router.route('/').get((req, res) => {
    Project.find()
        .then(projects => res.json(projects))
        .catch(err => res.status(400).json('Error: ' + err));
});

// new projects ...
router.route('/add').post((req, res) => {
    const { title, description, techStack, resources, deadline } = req.body;

    const techStackArray = techStack ? techStack.split(',').map(item => item.trim()) : [];
    const resourcesArray = resources ? resources.split(',').map(item => item.trim()) : [];

    const newProject = new Project({ 
        title, 
        description,
        techStack: techStackArray,
        resources: resourcesArray,
        deadline
    });

    newProject.save()
        .then(() => res.json('Project added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

// rpoejcts by their ids
router.route('/:id').get((req, res) => {
    Project.findById(req.params.id)
        .then(project => res.json(project))
        .catch(err => res.status(400).json('Error: ' + err));
});

// --- UPDATE PROJECT (BY ID) ---
router.route('/update/:id').post((req, res) => {
    Project.findById(req.params.id)
        .then(project => {
            project.title = req.body.title;
            project.description = req.body.description;
            project.deadline = req.body.deadline;
            
            project.techStack = req.body.techStack ? req.body.techStack.split(',').map(item => item.trim()) : [];
            project.resources = req.body.resources ? req.body.resources.split(',').map(item => item.trim()) : [];

            project.save()
                .then(() => res.json('Project updated!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

// --- DELETE PROJECT (BY ID) ---
router.route('/:id').delete((req, res) => {
    Project.findByIdAndDelete(req.params.id)
        .then(() => res.json('Project deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;

