import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './App.css';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsCheckLg } from 'react-icons/bs';
import CommentContainer from './CommentContainer';

const API_BASE_URL = 'http://127.0.0.1:3005/api/v1/tasks';

function App() {
  const [allTasks, setAllTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [completedTasks, setCompletedTasks] = useState([]);
  const [isCompletedScreen, setIsCompletedScreen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setAllTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const saveTasksToLocal = (tasks, key) => {
    localStorage.setItem(key, JSON.stringify(tasks));
  };

  const AddNewTask = async () => {
    try {
      const response = await axios.post(API_BASE_URL, {
        title: newTaskTitle,
        description: newDescription,
        completed: false,
      });
      setAllTasks([...allTasks, response.data]);
      setNewDescription('');
      setNewTaskTitle('');
      saveTasksToLocal([...allTasks, response.data], 'Tasklist');
    } catch (error) {
      console.error('Error adding new task:', error);
    }
  };

  const Complete = async (taskId, index) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${taskId}`, {
        completed: true,
      });

      let filteredTask = {
        ...response.data,
        completedOn: new Date().toISOString(),
      };

      let updatedCompletedList = [...completedTasks, filteredTask];
      setCompletedTasks(updatedCompletedList);

      TaskDelete(taskId, index);
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const TaskDelete = async (taskId, index) => {
    try {
      await axios.delete(`${API_BASE_URL}/${taskId}`);
      let reducedTasks = [...allTasks];
      reducedTasks.splice(index, 1);
      setAllTasks(reducedTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const CompletedTaskDelete = async (taskId, index) => {
    try {
      // Check if the task with the specified ID exists
      const existingTask = completedTasks.find((item) => item.id === taskId);
  
      if (!existingTask) {
        console.error('Task not found:', taskId);
        return;
      }
  
      await axios.delete(`${API_BASE_URL}/${taskId}`);
      let updatedCompletedList = [...completedTasks];
      updatedCompletedList.splice(index, 1);
      setCompletedTasks(updatedCompletedList);
    } catch (error) {
      console.error('Error deleting completed task:', error);
    }
  };
  
  

  return (
    <div className="App">
      <h1>Task Manager</h1>

      <div className="Task-wrapper">
        <div className="Task-input">
          <div className="Task-input-item">
            <label>Task:</label>
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="What's the title of your Task?"
            />
          </div>
          <div className="Task-input-item">
            <label>Description:</label>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="What's the description of your Task?"
            />
          </div>
          <div className="Task-input-item">
            <button
              className="primary-btn"
              type="button"
              onClick={AddNewTask}
            >
              Add
            </button>
          </div>
        </div>
        <div className="btn-area">
          <button
            className={`secondaryBtn ${!isCompletedScreen && 'active'}`}
            onClick={() => setIsCompletedScreen(false)}
          >
            To Do
          </button>
          <button
            className={`secondaryBtn ${isCompletedScreen && 'active'}`}
            onClick={() => setIsCompletedScreen(true)}
          >
            Completed
          </button>
        </div>
        <div className="Task-list">
          {isCompletedScreen === false &&
            allTasks.map((item, index) => (
              <div className="Task-list-item" key={index}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <div>
                  <CommentContainer />
                  <AiOutlineDelete
                    title="Delete?"
                    className="icon"
                    onClick={() => TaskDelete(item.id, index)}
                  />
                  <BsCheckLg
                    title="Completed?"
                    className=" check-icon"
                    onClick={() => Complete(item.id, index)}
                  />
                </div>
              </div>
            ))}
          {isCompletedScreen === true &&
            completedTasks.map((item, index) => (
              <div className="Task-list-item" key={item}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <p>
                    <i>Completed at: {item.completedOn}</i>
                  </p>
                </div>
                <div>
                  <AiOutlineDelete
                    className="icon"
                    onClick={() => CompletedTaskDelete(item.id, index)}
                  
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;