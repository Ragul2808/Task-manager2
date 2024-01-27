import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './App.css';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsCheckLg } from 'react-icons/bs';

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
      const response = await axios.get('http://127.0.0.1:3004/api/v1/tasks');
      setAllFrontends(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAddNewfrontend = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:3004/api/v1/tasks', {
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

  useEffect (() => {
    let savedFrontends = JSON.parse (localStorage.getItem ('frontendlist'));
    let savedCompletedFrontends = JSON.parse (
      localStorage.getItem ('completedFrontends')
    );
    if (savedFrontends) {
      setAllFrontends (savedFrontends);
    }

    if (savedCompletedFrontends) {
      setCompletedFrontends (savedCompletedFrontends);
    }
  }, []);

  const handlefrontendDelete = index => {
    let reducedFrontends = [...allFrontends];
    reducedFrontends.splice (index,1);
    // console.log (index);

    // console.log (reducedFrontends);
    localStorage.setItem ('frontendlist', JSON.stringify (reducedFrontends));
    setAllFrontends (reducedFrontends);
  };

  const handleCompletedfrontendDelete = index => {
    let reducedCompletedFrontends = [...completedFrontends];
    reducedCompletedFrontends.splice (index);
    // console.log (reducedCompletedFrontends);
    localStorage.setItem (
      'completedFrontends',
      JSON.stringify (reducedCompletedFrontends)
    );
    setCompletedFrontends (reducedCompletedFrontends);
  };

  const handleComplete = index => {
    const date = new Date ();
    var dd = date.getDate ();
    var mm = date.getMonth () + 1;
    var yyyy = date.getFullYear ();
    var hh = date.getHours ();
    var minutes = date.getMinutes ();
    var ss = date.getSeconds ();
    var finalDate =
      dd + '-' + mm + '-' + yyyy + ' at ' + hh + ':' + minutes + ':' + ss;

    let filteredfrontend = {
      ...allFrontends[index],
      completedOn: finalDate,
    };

    // console.log (filteredfrontend);

    let updatedCompletedList = [...completedFrontends, filteredfrontend];
    console.log (updatedCompletedList);
    setCompletedFrontends (updatedCompletedList);
    localStorage.setItem (
      'completedFrontends',
      JSON.stringify (updatedCompletedList)
    );
    // console.log (index);

    handlefrontendDelete (index);
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
