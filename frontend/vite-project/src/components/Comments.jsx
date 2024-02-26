import { useState } from 'react';
import axios from 'axios'; // Import axios

const Reply = ({ comment, pid }) => {
  const filteredReplies = comment.filter(com => com.parentId === pid);

  if (filteredReplies.length === 0) return null;

  return (
    <div className="ms-3">
      {filteredReplies.map(reply => (
        <div key={reply._id} className="border p-3 ms-3">
          {/* <p><strong>Replier ID:</strong> {reply.commenterId}</p> */}
          <p><strong>Reply:</strong> {reply.description}</p>
          {/* Render replies recursively */}
          <Reply comment={comment} pid={reply._id} />
        </div>
      ))}
    </div>
  );
};

const Comments = ({ comments, id, setpost }) => {
  const [commentText, setCommentText] = useState('');

  const handleComment = async () => {
    try {
      await axios.post(`http://localhost:5000/api/v1/post/comment/${id}`, { description: commentText });
      const newComment = { commenterId: id, description: commentText };
      const updatedComments = [...comments, newComment];
      setpost(prevPosts =>
        prevPosts.map(post => (post._id === id ? { ...post, Comments: updatedComments } : post))
      );
      alert('Comment added successfully');
    } catch (err) {
      alert(err.response.data.message);
      console.error(err);
    }
  };

  return (
    <div>
      <h3>Comments</h3>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Comment here"
          value={commentText}
          onChange={(event) => setCommentText(event.target.value)}
          required
        />
      </div>
      <button onClick={handleComment} className="btn btn-primary mb-3">Add comment</button>
      {comments.map((comment, index) => (
        !comment.parentId && (
          <div key={index} className="border p-3 mb-3">
            <p><strong>Commentor ID:</strong> {comment.commenterId}</p>
            <p><strong>Description:</strong> {comment.description}</p>
            {/* Pass parent id and comments array to Reply component */}
            <Reply pid={comment._id} comment={comments} />
          </div>
        )
      ))}
    </div>
  );
};

export default Comments;
