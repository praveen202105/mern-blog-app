import {  useState } from 'react';
import axios from 'axios'; // Import axios

const Comments = ({ comments, id,setpost}) => {
  const [comment, setComment] = useState('');

  // useEffect(()=>{

  // })
  const handleComment = async () => {
    try {
      
       await axios.post(`http://localhost:5000/api/v1/post/comment/${id}`, { comment });
      // Create a new comment object
      const newComment = {
        commentorId: id,
        description: comment
      };

      // Create a new array with the updated comments
      const updatedComments = [...comments, newComment];

      // Update the post state with the new comments
      setpost(prevPosts => prevPosts.map(post => post._id === id ? { ...post, Comments: updatedComments } : post));
      alert('Comment added successfully');
    } catch (err) {
      alert(err.response.data.message);
      console.error(err);
    }
  };

  return (
    <div>
      <h3>Comments</h3>
      <input
        type="text"
        className="form-control"
        placeholder="Comment here"
        value={comment} // Use value instead of onChange
        onChange={(event) => setComment(event.target.value)}
        required
      />
      <button onClick={handleComment} className="btn btn-primary">Add comment</button>
      {comments.map((comment, index) => (
        <div key={index}>
          <p><strong>Commentor ID:</strong> {comment.commentorId}</p>
          <p><strong>Description:</strong> {comment.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Comments;
