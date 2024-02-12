// Task.js
import React from 'react';
import Comment from './Comment'; // Adjust the path based on your project structure

const Task = ({ task }) => {
  return (
    <div>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <Comment task_id={task.id} />
    </div>
  );
};

export default Task;
