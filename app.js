const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

// Middleware to inject header on each page
app.use((req, res, next) => {
  res.locals.cookies = req.cookies;
  next();
});

// Task 1: /cookie1
app.get('/cookie1', (req, res) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const lastVisit = req.cookies.last_visit_timestamp;
  const secondsSinceLastVisit = lastVisit ? currentTime - parseInt(lastVisit) : 'N/A';

  res.cookie('token', 'abc123');
  res.cookie('last_visit_timestamp', currentTime.toString());

  res.render('cookie1', {
    token: req.cookies.token || 'Not set',
    lastVisit,
    secondsSinceLastVisit
  });
});

// Task 2: /add-cookie
app.get('/add-cookie', (req, res) => {
  res.render('add-cookie');
});

app.post('/add-cookie', (req, res) => {
  const { name, value } = req.body;
  if (name && value) {
    res.cookie(name, value);
  }
  res.redirect('/cookie1');
});

// Task 3: /remove-cookie
app.get('/remove-cookie', (req, res) => {
  res.render('remove-cookie');
});

app.post('/remove-cookie', (req, res) => {
  const { name } = req.body;
  if (name) res.clearCookie(name);
  res.redirect('/cookie1');
});

// Task 4: AJAX-Based cookie removal
app.get('/remove-cookie-ajax', (req, res) => {
  res.render('remove-cookie-ajax');
});

app.post('/remove-cookie-ajax', (req, res) => {
  const { name } = req.body;
  if (name && req.cookies[name]) {
    res.clearCookie(name);
    res.json({ success: true, message: `Cookie '${name}' removed.` });
  } else {
    res.json({ success: false, message: `Cookie '${name}' not found.` });
  }
});

// Task 5: Show All Cookies
app.get('/show-cookies', (req, res) => {
  res.render('show-cookies', { cookies: req.cookies });
});

// Root
app.get('/', (req, res) => res.redirect('/cookie1'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
