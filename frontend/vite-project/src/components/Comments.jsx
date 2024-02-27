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

  const handleComment = async () => {
    try {
      const res=await axios.post(`http://localhost:5000/api/v1/post/comment/${id}`, { description: commentText });
      // const newComment = { commenterId: id, description: commentText };
      // console.log(res.data.postdetails.Comments);
      const AllCommentsIncludingReply =res.data.postdetails.Comments;
      // const onlycomments = AllCommentsIncludingReply.filter(comment => !comment.parentId );
      // console.log(onlycomments)
      const updatedComments = AllCommentsIncludingReply;
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
        <div key={index} className="border p-3 mb-3">
          {!comment.parentId  && (
            <div>
              <p><strong>Commentor ID:</strong> {comment.commenterId}</p>
              <p><strong>Description:</strong> {comment.description}</p>
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
