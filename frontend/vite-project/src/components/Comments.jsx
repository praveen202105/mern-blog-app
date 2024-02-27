import { useState } from 'react';
import axios from 'axios'; // Import axios

const Reply = ({ comments, parentId }) => {
  const filteredReplies = comments.filter(comment => comment.parentId === parentId);

  if (filteredReplies.length > 0) {
    return (
      <div className="ms-3">
        {filteredReplies.map((reply, index) => (
          <div key={index} className="border p-3 ms-3">
            <p><strong>Replier ID:</strong> {reply.commenterId}</p>
            <p><strong>Description:</strong> {reply.description}</p>
            {/* Recursively render nested replies */}
            <Reply comments={comments} parentId={reply._id} />
          </div>
        ))}
      </div>
    );
  } else {
    return null; // No replies to render
  }
};




const Comments = ({ comments, id, setpost }) => {
  const [commentText, setCommentText] = useState('');
  const [editedCommentId, setEditedCommentId] = useState(null);
  const [editedCommentDescription, setEditedCommentDescription] = useState('');

  const handleComment = async () => {
    try {
      const res=await axios.post(`http://localhost:5000/api/v1/post/comment/${id}`, { description: commentText });
      
      
      const updatedComments = res.data.postdetails.Comments;
      setpost(prevPosts =>
        prevPosts.map(post => (post._id === id ? { ...post, Comments: updatedComments } : post))
      );

      alert('Comment added successfully');
    } catch (err) {
      alert(err.response.data.message);
      console.error(err);
    }
  };

  const handleCommentEdit = async (commentId) => {
    setEditedCommentId(commentId);
    const commentToEdit = comments.find(comment => comment._id === commentId);
    setEditedCommentDescription(commentToEdit.description);

}
const handleSubmitEdit = async (commentId) => {
    try {
      console.log(editedCommentId)
      const res = await axios.put(`http://localhost:5000/api/v1/post/${id}/comment/${editedCommentId}`, { description: editedCommentDescription });
      console.log(res);
      const updatedComments = res.data.post.Comments;
      setpost(prevPosts =>
        prevPosts.map(post => (post._id === id ? { ...post, Comments: updatedComments } : post))
      );
      setEditedCommentId(null); // Reset the editing state after successful edit
      setEditedCommentDescription(''); // Clear the edited comment text
      alert('Comment edited successfully');
    } catch (err) {
      alert(err.response.data.message);
      console.error(err);
    }

}
const handleCancelEdit = () => {
  setEditedCommentId(null);
  setEditedCommentDescription('');
  // setEditedPostMedia('');
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
        <div key={index} className="border p-3 mb-3">
          {!comment.parentId  && (
            <div>
              <p><strong>Commentor ID:</strong> {comment.commenterId}</p>
              <p><strong>Description:</strong> {comment.description}</p>
              {/* <button onClick={() => handleDelete(post._id)}>Delete</button> */}
              <button onClick={() => handleCommentEdit(comment._id)}>Edit</button>
             {editedCommentId === comment._id && (
             <div>
              <input type="text" value={editedCommentDescription} onChange={(e) => setEditedCommentDescription(e.target.value)} />
          
             
              <button onClick={handleSubmitEdit}>Submit updated comment</button>
            <button onClick={handleCancelEdit}>Cancel</button>
          
        </div>
      )}
              {/* Pass comments with matching parent ID to Reply component */}
              <Reply comments={comments} parentId={comment._id} />
            </div>
        )}
      </div>
    ))}
  </div>
  );
};

export default Comments;