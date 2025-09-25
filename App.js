import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [songs, setSongs] = useState([]); 
  const [form, setForm] = useState({ 
    song_name: '', 
    release_year: '', 
    album: '' 
  }); 
  const [editingId, setEditingId] = useState(null); 

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = () => {
    axios.get(`http://localhost:5000/songs/get`)
      .then(response => setSongs(response.data))
      .catch(error => console.error(error));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createSong = () => {
    console.log(form);
    axios.post(`http://localhost:5000/songs/create`, form)
      .then(response => {
        console.log(response.data);
        setForm({ song_name: '', release_year: '', album: '' });
        fetchSongs();
      })
      .catch(error => console.error(error));
  };

  const editSong = (id) => {
    axios.get(`http://localhost:5000/songs/get/${id}`)
      .then(response => {
        setForm(response.data);
        setEditingId(id);
      })
      .catch(error => console.error(error));
  };

  const updateSong = () => {
    axios.put(`http://localhost:5000/songs/update/${editingId}`, form)
      .then(response => {
        console.log(response.data);
        setForm({ song_name: '', release_year: '', album: '' });
        setEditingId(null);
        fetchSongs();
      })
      .catch(error => console.error(error));
  };

  const deleteSong = (id) => {
    axios.delete(`http://localhost:5000/songs/delete/${id}`)
      .then(response => {
        console.log(response.data);
        fetchSongs();
      })
      .catch(error => console.error(error));
  };

  return (
    <div className="song-management">
      <h2>Song Management System</h2>

      {/* Form */}
      <div>
        <input
          type="text"
          name="song_name"
          placeholder="Song Name"
          value={form.song_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="release_year"
          placeholder="Release Year"
          value={form.release_year}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="album"
          placeholder="Album"
          value={form.album}
          onChange={handleChange}
          required
        />

        {editingId ? (
          <button onClick={updateSong}>Update</button>
        ) : (
          <button onClick={createSong}>Add</button>
        )}
      </div>

      {/* Song List */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Song Name</th>
            <th>Release Year</th>
            <th>Album</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song) => (
            <tr key={song.song_id}>
              <td>{song.song_id}</td>
              <td>{song.song_name}</td>
              <td>{song.release_year}</td>
              <td>{song.album}</td>
              <td>
                <button onClick={() => editSong(song.song_id)}>Edit</button>
                <button onClick={() => deleteSong(song.song_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
