// src/components/ToDoList.js
import React, { useState, useEffect } from 'react';
import TaskItem from './TaskItem';

function ToDoList({ user, setUser }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const fetchTasks = () => {
    fetch('/api/tasks', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = () => {
    fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ title: newTask }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to add task');
        return res.json();
      })
      .then(() => {
        setNewTask('');
        fetchTasks();
      })
      .catch((error) => {
        console.error("Error adding task:", error);
        alert('Error adding task');
      });
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const handleTaskDeleted = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Welcome, {user.username}</h2>
        <button
          onClick={() => {
            fetch('/logout', { method: 'POST', credentials: 'include' }).then(() =>
              setUser(null)
            );
          }}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
      <div className="bg-white p-4 rounded shadow mb-4">
        <div className="flex">
          <input
            type="text"
            placeholder="New Task"
            className="border p-2 flex-1 mr-2"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button
            onClick={handleAddTask}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onTaskUpdated={handleTaskUpdated}
            onTaskDeleted={handleTaskDeleted}
          />
        ))}
      </div>
    </div>
  );
}

export default ToDoList;
