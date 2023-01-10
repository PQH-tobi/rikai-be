require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const { dateFormatter } = require('./common/dateFormat');

const app = express();

// Start express middleware
app.use(express.json());

// Routes
app.use('/api/admin', require('./routes/adminRouter'));

// Connet to DB
const URI = process.env.MONGODB_URL;
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (err) throw err;

    console.log(dateFormatter(new Date()), ': Connected to MongoDB');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(dateFormatter(new Date()), ': Server is running on port', PORT);
});