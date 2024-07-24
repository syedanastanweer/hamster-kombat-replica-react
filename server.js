const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5173;

app.use(cors());
app.use(bodyParser.json());

const usersFilePath = path.join(__dirname, 'users.txt');

app.post('/save-user', (req, res) => {
  const user = req.body.user;
  fs.appendFile(usersFilePath, `${user}\n`, (err) => {
    if (err) {
      console.error('Failed to save user:', err);
      res.status(500).send('Failed to save user.');
    } else {
      res.send('User saved.');
    }
  });
});

app.get('/get-users', (req, res) => {
  fs.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Failed to read users:', err);
      res.status(500).send('Failed to read users.');
    } else {
      const users = data.trim().split('\n').filter(line => line.length > 0);
      res.json({ users });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
