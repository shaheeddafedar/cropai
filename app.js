const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://CROPAI:CROPAI123@database.lmlg9ez.mongodb.net/CROPAI?retryWrites=true&w=majority&appName=database';

const pageRouter = require('./routes/pageRouter');
const apiRouter = require('./routes/apiRouter');
const errorController = require('./controllers/errorController');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); 
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api', apiRouter);
app.use('/', pageRouter);


app.use(errorController.get404);

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("Successfully connected to MongoDB.");
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error("❌ Error while connecting to the database:", err);
    });


    
// Windows:

// Open terminal (CMD or PowerShell)

// Run:

// netstat -ano | findstr :3000


// You'll get a list like:

// TCP    127.0.0.1:3000    ...   PID:12345


// Kill the process:

// taskkill /PID 12345 /F