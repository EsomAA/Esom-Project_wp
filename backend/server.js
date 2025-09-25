const express = require('express');
const mysql = require('mysql2'); 
const cors = require('cors');

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

const db = mysql.createPool({
  host: 'webcourse.cs.nuim.ie',
  user: 'u240268',
  password: 'aiNai9ooquiz3ooN',
  database: 'cs230_u240268'
}).promise();  // promise-based execution

console.log('SQL Connected');

app.get('/songs/get', (request, response) => {
  db.execute('SELECT * FROM Song1')
    .then(([rows]) => response.json(rows))
    .catch(error => response.status(500).send(error.message));
});

app.post('/songs/create', (request, response) => {
  const { song_name, release_year, album } = request.body;
  db.execute('INSERT INTO Song1 (song_name, release_year, album) VALUES (?, ?, ?)', [song_name, release_year, album])
    .then(() => response.send(`Song added!`))
    .catch(error => response.status(500).send(error.message));
});

app.get('/songs/get/:song_id', (request, response) => {
  db.execute('SELECT * FROM Song1 WHERE song_id = ?', [request.params.song_id])
    .then(([rows]) => response.json(rows[0]))
    .catch(error => response.status(500).send(error.message));
});

app.put('/songs/update/:song_id', (request, response) => {
  const { song_name, release_year, album } = request.body;
  db.execute(
    'UPDATE Song1 SET song_name = ?, release_year = ?, album = ? WHERE song_id = ?', 
    [song_name, release_year, album, request.params.song_id]
  )
    .then(() => response.send(`Song updated!`))
    .catch(error => response.status(500).send(error.message));
});

app.delete('/songs/delete/:song_id', (request, response) => {
  db.execute('DELETE FROM Song1 WHERE song_id = ?', [request.params.song_id])
    .then(() => response.send(`Song deleted!`))
    .catch(error => response.status(500).send(error.message));
});

app.use((request, response) => response.status(404).send('Path Not Found'));

app.listen(port, () => console.log(`Server running on port ${port}`));