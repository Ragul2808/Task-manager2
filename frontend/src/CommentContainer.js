import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommentContainer = ({ taskId }) => {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch comments from the API on component mount
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:3000/api/v1/tasks/${taskId}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [taskId]);

  const createInputBox = (parentId = null) => {
    return (
      <div className="comment-details">
        <input
          type="text"
          placeholder="add text here"
          className="input"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button className="btn submit" onClick={() => handleCommentSubmit(parentId)}>
          Submit
        </button>
      </div>
    );
  };

  const addReply = (comment) => {
    return (
      <div key={comment.id} className="all-comment">
        <div className="card">
          <span className="text">{comment.text}</span>
          <span className="reply" onClick={() => handleReplyClick(comment.id)}>
            Add Reply
          </span>
          {comment.replies && comment.replies.length > 0 && (
            <div className="nested-replies">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="nested-reply">
                  <span className="text">{reply.text}</span>
                  <span className="reply" onClick={() => handleReplyClick(comment.id)}>
                    Add Reply
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleReplyClick = (parentId) => {
    setComments([...comments, { id: Math.random(), text: '', parentId }]);
  };

  const handleCommentSubmit = async (parentId) => {
    if (newComment) {
      try {
        const response = await axios.post(`http://127.0.0.1:3000/api/v1/tasks/${taskId}/comments`, {
          text: newComment,
          parentId: parentId,
        });

        if (parentId) {
          // If it's a reply, find the parent comment and add the reply
          const updatedComments = comments.map((comment) => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), response.data],
              };
            }
            return comment;
          });
          setComments(updatedComments);
        } else {
          // If it's a top-level comment, just add it
          setComments([...comments, response.data]);
        }

        setNewComment('');
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  return (
    <div className="container">
      {loading ? (
        <p>Loading comments...</p>
      ) : (
        comments.map((comment) => addReply(comment))
      )}
      {createInputBox()}
    </div>
  );
};

export default CommentContainer;
