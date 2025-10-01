const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); 


const app = express();
const port = process.env.PORT || 5000; 


app.use(cors());

app.use(express.json());

const uri = process.env.MONGO_URI;
mongoose.connect(uri);

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("✅ MongoDB database connection established successfully");
});

// --- API Routes ---
const projectsRouter = require('./routes/projects');
const tasksRouter = require('./routes/tasks'); 

app.use('/projects', projectsRouter);
app.use('/tasks', tasksRouter); 


app.get('/', (req, res) => {
  res.send('Projex API is running...');
});


app.listen(port, () => {
    console.log(`🚀 Server is running on port: ${port}`);
});


