const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 5000;

const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// Routes
app.get('/', (req, res) => res.render('pages/index'));

// API
app.get('/api/test', (req, res) => {
  console.log('got api call');
  res.status(200);
  res.send({ test: 'success' });
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
