const fs = require('fs');
const path = require('path');
const cors = require('cors');
const express = require('express');
const app = express();
const getPuns = require('./getPuns');
const suggestKeywords = require('./suggestKeywords');

app.use(cors());

app.get('/suggest-keywords', (req, res) => {
  const q = req.query.q;
  const keywords = suggestKeywords(q);
  res.json({ keywords });
});

app.get('/puns', (req, res) => {
  const keywords = req.query.q ? req.query.q.split(',') : null;
  const puns = getPuns(keywords);
  res.json(puns);
});

app.listen(8888);

console.log("server running");