import  { useState, useEffect } from 'react';
import axios from 'axios';
import { CookieJar } from 'tough-cookie';
// import Comments from './Comments';
// import Cookies from 'js-cookie';
// Create a new cookie jar instance
const cookieJar = new CookieJar();
import Comments from './Comments';
import CreatePost from './CreatePost';
// Configure axios to use cookie jar support
axios.defaults.jar = cookieJar;
axios.defaults.withCredentials = true;

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [editedPostId, setEditedPostId] = useState(null);
  const [editedPostContent, setEditedPostContent] = useState('');
  const [editedPostMedia, setEditedPostMedia] = useState('');


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        
        const response = await axios.get('http://localhost:5000/api/v1/post/allposts');
        // console.log(response.data.posts[0].Comments]) 
        setPosts(response.data.posts); // Assuming response.data is an array of posts
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
   
    try {
       
         await axios.get(`http://localhost:5000/api/v1/post/likepost/${postId}`)
      
     setPosts(prevPosts => prevPosts.map(post => post._id === postId ? { ...post, LikesCount: post.LikesCount + 1 } : post));
    //  console.log(posts[0].Comments);
    
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };
  const handleDelete = async (postId) => {
   
    try {
       
         await axios.delete(`http://localhost:5000/api/v1/post/deletepost/${postId}`)
         setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
      
         console.log("Post deleted successfully");
    
    } catch (error) {
      
      console.error('Error deleting post:', error);
    }
  };
const handlePostEdit = async (postId) => {
    setEditedPostId(postId);
    const postToEdit = posts.find(post => post._id === postId);
    console.log('Post to edit:', postToEdit)
    setEditedPostContent(postToEdit.content);

}
const handleSubmitEdit = async () => {
    try {
        const formData = new FormData();
        formData.append('content', editedPostContent);
        formData.append('media', editedPostMedia);
        
        const res=await axios.put(`http://localhost:5000/api/v1/post/editpost/${editedPostId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        const newmedia=res.data.post.media;
        const updatedPosts = posts.map(post =>
          post._id === editedPostId ? { ...post, content: editedPostContent, media: { 
            public_id:newmedia.public_id,secure_url: newmedia.secure_url } } : post
        );
        console.log(updatedPosts);
        setPosts(updatedPosts);
        setEditedPostId(null);
        setEditedPostContent('');
        setEditedPostMedia('');
        console.log("Post edited successfully");
      } catch (error) {
        console.error('Error editing post:', error);
      }
  };
  const handleCancelEdit = () => {
    setEditedPostId(null);
    setEditedPostContent('');
    setEditedPostMedia('');
  };
  return (
    <>

        <CreatePost setallpost={setPosts} />

    <div>
      <h2>All Posts</h2>
      {posts.map(post => (
        <div key={post.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          {/* <h3>{post.title}</h3> */}
          <p>{post.content}</p>
          {post.media && post.media.secure_url && <img src={post.media.secure_url} alt="Post Image" style={{ maxWidth: '100%' }} />}
          <button onClick={() => handleLike(post._id)}>Like</button>
       
          <span>Likes: {post.LikesCount}</span>
          <button onClick={() => handleDelete(post._id)}>Delete</button>
          <button onClick={() => handlePostEdit(post._id)}>Edit</button>
          {editedPostId && (
        <div>
          <input type="text" value={editedPostContent} onChange={(e) => setEditedPostContent(e.target.value)} />
          
          <input type="file" onChange={(e) =>{
console.log(e.target.files)
           setEditedPostMedia(e.target.files[0])}} />
         
          <button onClick={handleSubmitEdit}>Submit update post</button>
          <button onClick={handleCancelEdit}>Cancel</button>
        </div>
      )}
          <Comments comments={post.Comments} id={post._id} setpost={setPosts} />
          
         {/* <h2>{post.Comments[0]}</h2> */}
        </div>
         
      ))}
    </div>
    
    </>
  );
};

export default AllPosts;