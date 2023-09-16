const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());


const loginRoute = require('./routes/login');
const signupRoute = require('./routes/signup');


app.use('/login', loginRoute);
app.use('/signup', signupRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
