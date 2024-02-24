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
  
  
  return (
    <>
    <div>
        <CreatePost setallpost={setPosts} />
    </div>
    <div>
      <h2>All Posts</h2>
      {posts.map(post => (
        <div key={post.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          {/* <h3>{post.title}</h3> */}
          <p>{post.content}</p>
          {post.media && post.media.secure_url && <img src={post.media.secure_url} alt="Post Image" style={{ maxWidth: '100%' }} />}
          <button onClick={() => handleLike(post._id)}>Like</button>
       
          <span>Likes: {post.LikesCount}</span>
          <Comments comments={post.Comments} id={post._id} setpost={setPosts} />
          
         {/* <h2>{post.Comments[0]}</h2> */}
        </div>
      ))}
    </div>
    </>
  );
};

export default AllPosts;