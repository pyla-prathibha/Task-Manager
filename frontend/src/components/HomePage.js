// src/components/HomePage.js
import React, { useState } from 'react';

function HomePage({ setUser }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ username: '', password: '' });
  
  const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value});
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const endpoint = isRegister ? '/register' : '/login';
    
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    .then(res => res.json())
    .then(data => {
      if (!data.error) {
        setUser(data.user || { username: form.username });
      } else {
        alert(data.error);
      }
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Task Manager</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <input
          className="border p-2 w-full mb-4"
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
        />
        <input
          className="border p-2 w-full mb-4"
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded">
          {isRegister ? 'Register' : 'Login'}
        </button>
      </form>
      <button onClick={() => setIsRegister(!isRegister)} className="mt-4 text-blue-600">
        {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
      </button>
    </div>
  );
}

export default HomePage;
