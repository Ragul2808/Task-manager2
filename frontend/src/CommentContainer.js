
import React, { useState } from 'react';

const CommentContainer = () => {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);

  const createInputBox = () => {
    return (
      <div className="comment-details">
        <input
          type="text"
          placeholder="add text here"
          className="input"
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button className="btn submit" onClick={handleCommentSubmit}>
          Submit
        </button>
      </div>
    );
  };

  const addReply = (text) => {
    return (
      <div className="all-comment">
        <div className="card">
          <span className="text">{text}</span>
          <span className="reply" onClick={handleReplyClick}>
            Add Reply
          </span>
        </div>
      </div>
    );
  };

  const handleReplyClick = () => {
    setComments([...comments, createInputBox()]);
  };

  const handleCommentSubmit = () => {
    if (newComment) {
      setComments([...comments, addReply(newComment)]);
      setNewComment('');
    }
  };

  return (
    <div className="container">
      {comments.map((comment, index) => (
        <div key={index}>{comment}</div>
      ))}
      {createInputBox()}
    </div>
  );
};

export default CommentContainer;