//imports
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET;
// Mock user for example
const user = {
    id: 1,
    username: 'exampleuser',
    password: '$2a$10$...', // this should be a hashed password
  };
  

//middleware
app.use(express.json());
app.use(cors());

 //Load MongoDB URI
const URI = process.env.MONGO_URI

const port = process.env.PORT || 4000;



//models
const Journal = require('../models/journalSchema');
const Goal = require('../models/goalSchema');
const Habit = require('../models/habitSchema');
const User = require('../models/userSchema')

//Handle promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });


//Routes

//Register User
app.post('/register', async (req,res)=> {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username,
            password: hashedPassword
        })
        const savedUser = await user.save();
        res.status(201).send('User created');
    } catch (err) {
        res.status(500).send('Error registering user')
    }
});

// Login Route
app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username:req.body.username})
        if(user.username !== req.body.username) {
            return res.status(400).send('Invalid credentials');
        }
        if (!(await bcrypt.compare(req.body.password, user.password))) {
            return res.status(400).send('Invalid credentials')
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).send('Error logging in')

    }
});

//Middleware to authenticate

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token  = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401); //if no token, return unauthorized

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if(err) return res.sendStatus(403); //if token is not valid return forbidden
        req.user = user;
        next()
    });

}

// Protected Route
app.get('/protected', authenticateToken, (req, res) => {
    res.status(200).send(`Welcome User ${req.user.userId}`);
  });
  



//GET ONE JOURNAL
app.get('/journals/:id', async (req, res) => {
    try { 
        const oneJournal = await Journal.findById(req.params.id);
        res.json(oneJournal)
    } catch (err) {
        console.log(err)
    }
});

//GET JOURNALS
app.get('/journals', async (req,res) => {
    try {
        const allJournals = await Journal.find({});
        res.json(allJournals)
    } catch (err) {
        console.log(err)
    }
});

//CREATE JOURNAL
app.post('/journals', async (req, res) => {
    try {
        const createdJournal = await Journal.create(req.body)
        res.json(createdJournal)
    } catch (err) {
        console.log(err)
    }
});

//DELETE JOURNAL
app.delete('/journals/:id', async (req, res) => {
    try {
        const deletedJournal = await Journal.findByIdAndRemove(req.params.id)
        res.json(deletedJournal)
    } catch (err) {
        console.log(err)
    }
});

//UPDATE JOURNAL
app.put('/updatepost/:id', async (req, res) => {
    try {
        const updatedJournal = await Journal.findByIdAndUpdate(req.params.id, req.body, {new:true});
        res.json(updatedJournal)
    } catch (err) {
        console.log(err)
    }
});

//GET ONE GOAL
app.get('/goals/:id', async (req, res)=> {
    try {
        const oneGoal = await Goal.findById(req.params.id)
        res.json(oneGoal)
    } catch (err) {
        console.log(err)
    }
});


// GET GOALS
app.get('/goals', async (req,res) => {
    try {
        const allGoals = await Goal.find({});
        res.json(allGoals)
    } catch (err) {
        console.log(err)
    } 
});

//CREATE GOAL
app.post('/goals', async (req, res) => {
    try {
        const createdGoal = await Goal.create(req.body)
        res.json(createdGoal)
    } catch (err) {
        console.log(err)
    }
})

//UPDATE GOAL
app.put('/goals/:id', async (req,res)=> {
    try {
        const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {new:true});
        res.json(updatedGoal)
    } catch (err) {
        console.log(err)
    }
});

//DELETE GOAL
app.delete('/goals/:id', async (req,res) => {
    try {
        const deletedGoal = await Goal.findByIdAndRemove(req.params.id)
        res.json(deletedGoal)
    } catch(err) {
        console.log(err)
    }
});


//Get one habit
app.get('/habits/:id', async (req,res) => {
    try {
        const oneHabit = await Habit.findById(req.params.id)
        res.json(oneHabit)
    } catch(err) {
        console.log(err)
    }
});

//Get all habits
app.get('/habits', async (req,res) => {
    try {
        const allHabits = await Habit.find({})
        res.json(allHabits)
    } catch(err) {
        console.log(err)
    }
});

//Create Habit
app.post('/habits', async (req,res)=> {
    try {
        const newHabit = await Habit.create(req.body)
        res.json(newHabit)
    } catch(err) {
        console.log(err)
    }
});

//Update Habit
app.put('/habits/:id', async (req, res) => {
    try {
        const updatedHabit = await Habit.findByIdAndUpdate(req.params.id, req.body, {new:true})
        res.json(updatedHabit)
    } catch(err) {
        console.log(err)
    }
});

//Delete Habit
app.delete('/habits/:id', async (req,res) => {
    try {
        const deletedHabit = await Habit.findByIdAndRemove(req.params.id)
        res.json(deletedHabit)
    } catch(err) {
        console.log(err)
    }
});



//////////////////////////
//API CALLS
/////////////////////////
const apiKey = process.env.API_KEY;

//EXERCISE API
app.get('/exercises', (req, res)=> {
    const muscle = [
        "abdominals",
        "abductors",
        "adductors",
        "biceps",
        "calves",
        "chest",
        "forearms",
        "glutes",
        "hamstrings",
        "lats",
        "lower_back",
        "middle_back",
        "neck",
        "quadriceps",
        "traps",
        "triceps"
    ]
    const randomMuscleIndex = Math.floor(Math.random()* muscle.length)
    const randomMuscle = muscle[randomMuscleIndex]
    const randomNum = Math.floor(Math.random() * 10)

 axios.get(`https://api.api-ninjas.com/v1/exercises?muscle=${randomMuscle}`, {
    headers: {
        'X-Api-Key': apiKey
    }
    }).then(response => {
        res.send(response.data[randomNum]);
    }).catch(err => {
        console.log(err)
    })
});

//Jokes API
app.get('/jokes', (req, res) => {
    axios.get(`https://api.api-ninjas.com/v1/jokes?=limit=1`, {
        headers: {
            'X-Api-Key': apiKey
        }
    }).then(response => {
        res.send(response.data)
    }).catch(err => {
        console.log(err)
    })
});

mongoose.connect(URI)
mongoose.connection.once('open', () => {
    console.log('connection to mongoDB established.')
});



app.listen(port, () => {
    console.log('listening...')
});