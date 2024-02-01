import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './App.css';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsCheckLg } from 'react-icons/bs';

const API_BASE_URL = 'http://127.0.0.1:3000/api/v1/tasks';

function App() {
  const [allFrontends, setAllFrontends] = useState([]);
  const [newfrontendTitle, setNewfrontendTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [completedFrontends, setCompletedFrontends] = useState([]);
  const [isCompletedScreen, setIsCompletedScreen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      console.log('Fetched tasks:', response.data);
      setAllFrontends(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAddNewfrontend = async () => {
    try {
      const response = await axios.post(API_BASE_URL, {
        title: newfrontendTitle,
        description: newDescription,
        completed: false,
      });
      setAllFrontends([...allFrontends, response.data]);
      setNewDescription('');
      setNewfrontendTitle('');
    } catch (error) {
      console.error('Error adding new task:', error);
    }
  };

  const handlefrontendDelete = async (taskId) => {
    try {
      await axios.delete(`${API_BASE_URL}/${taskId}`);
      let reducedFrontends = allFrontends.filter((task) => task.id !== taskId);
      setAllFrontends(reducedFrontends);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleComplete = (index) => {
    const date = new Date();
    const formattedDate = date.toISOString(); // Convert the date to a format that the backend can understand

    let filteredfrontend = {
      ...allFrontends[index],
      completedOn: formattedDate,
    };

    let updatedCompletedList = [...completedFrontends, filteredfrontend];
    console.log(updatedCompletedList);
    setCompletedFrontends(updatedCompletedList);
    localStorage.setItem(
      'completedFrontends',
      JSON.stringify(updatedCompletedList)
    );
  };

  const handleCompletedfrontendDelete = async (index) => {
    try {
      const completedTask = completedFrontends[index];
      await axios.delete(`${API_BASE_URL}/${completedTask.id}`);
      let updatedCompletedList = [...completedFrontends];
      updatedCompletedList.splice(index, 1);
      setCompletedFrontends(updatedCompletedList);
    } catch (error) {
      console.error('Error deleting completed task:', error);
    }
  };
  return (
    <div className="App">
      <h1>Task Manager</h1>

      <div className="frontend-wrapper">

        <div className="frontend-input">
          <div className="frontend-input-item">
            <label>Task:</label>
            <input
              type="text"
              value={newfrontendTitle}
              onChange={e => setNewfrontendTitle (e.target.value)}
              placeholder="What's the title of your Task?"
            />
          </div>
          <div className="frontend-input-item">
            <label>Description:</label>
            <input
              type="text"
              value={newDescription}
              onChange={e => setNewDescription (e.target.value)}
              placeholder="What's the description of your Task?"
            />
          </div>
          <div className="frontend-input-item">
            <button
              className="primary-btn"
              type="button"
              onClick={handleAddNewfrontend}
            >
              Add
            </button>
          </div>
        </div>
        <div className="btn-area">
          <button
            className={`secondaryBtn ${isCompletedScreen === false && 'active'}`}
            onClick={() => setIsCompletedScreen (false)}
          >
            To Do
          </button>
          <button
            className={`secondaryBtn ${isCompletedScreen === true && 'active'}`}
            onClick={() => setIsCompletedScreen (true)}
          >
            Completed
          </button>
        </div>
        <div className="frontend-list">

          {isCompletedScreen === false &&
            allFrontends.map ((item, index) => (
              <div className="frontend-list-item" key={index}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>

                </div>
                <div>
                  <AiOutlineDelete
                    title="Delete?"
                    className="icon"
                    onClick={() => handlefrontendDelete (index)}
                  />
                  <BsCheckLg
                    title="Completed?"
                    className=" check-icon"
                    onClick={() => handleComplete (index)}
                  />
                </div>
              </div>
            ))}

          {isCompletedScreen === true &&
            completedFrontends.map ((item, index) => (
              <div className="frontend-list-item" key={index}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <p> <i>Completed at: {item.completedOn}</i></p>
                </div>
                <div>
                  <AiOutlineDelete
                    className="icon"
                    onClick={() => handleCompletedfrontendDelete (index)}
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
