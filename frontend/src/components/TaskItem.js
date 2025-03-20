// src/components/TaskItem.js
import React, { useState } from 'react';

function TaskItem({ task, onTaskUpdated, onTaskDeleted }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [editedCompleted, setEditedCompleted] = useState(task.completed);

  const handleUpdate = () => {
    fetch(`/api/tasks/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        title: editedTitle,
        description: editedDescription,
        completed: editedCompleted,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to update task');
        return res.json();
      })
      .then((updatedTask) => {
        onTaskUpdated(updatedTask);
        setIsEditing(false);
      })
      .catch((error) => {
        console.error(error);
        alert('Error updating task');
      });
  };

  return (
    <div className="flex items-center justify-between py-2 border-b">
      {isEditing ? (
        <div className="flex flex-col flex-1">
          <input
            type="text"
            className="border p-1 mb-1"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <textarea
            className="border p-1 mb-1"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
          />
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={editedCompleted}
              onChange={(e) => setEditedCompleted(e.target.checked)}
            />
            <span className="ml-2">Completed</span>
          </label>
          <div className="mt-2">
            <button
              onClick={handleUpdate}
              className="bg-green-500 text-white px-3 py-1 rounded mr-2"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1">
          <h3 className={`font-bold ${task.completed ? 'line-through' : ''}`}>
            {task.title}
          </h3>
          <p>{task.description}</p>
        </div>
      )}
      {!isEditing && (
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Edit
          </button>
          <button
            onClick={() => onTaskDeleted(task.id)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default TaskItem;
