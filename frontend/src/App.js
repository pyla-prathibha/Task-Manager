// src/App.js
import React, { useState } from 'react';
import HomePage from './components/HomePage';
import ToDoList from './components/ToDoList';

function App() {
  const [user, setUser] = useState(null);
  
  return (
    <div>
      {user ? <ToDoList user={user} setUser={setUser} /> : <HomePage setUser={setUser} />}
    </div>
  );
}

export default App;
