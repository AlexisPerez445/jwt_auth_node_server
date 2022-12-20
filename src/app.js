const express = require('express');
const app = express();
const port = 3000;

const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRoutes = require('./routes/AuthRoutes');

app.listen(port, () =>{
    console.log('Server run');
});

app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(morgan('tiny'));
app.use(authRoutes);