import  { useState, useEffect } from 'react';
import axios from 'axios';

const AllPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/post/allposts');
        console.log(response.data.posts)
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
      // Your logic to like a post, for example:
      // await axios.post(`http://localhost:5000/api/v1/post/${postId}/like`);
      // Then update the state to reflect the liked post
     // setPosts(prevPosts => prevPosts.map(post => post._id === postId ? { ...post, LikesCount: post.LikesCount + 1 } : post));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  return (
    <div>
      <h2>All Posts</h2>
      {posts.map(post => (
        <div key={post.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          {/* <h3>{post.title}</h3> */}
          <p>{post.content}</p>
          {post.media && post.media.secure_url && <img src={post.media.secure_url} alt="Post Image" style={{ maxWidth: '100%' }} />}
          <button onClick={() => handleLike(post._id)}>Like</button>
          <span>Likes: {post.LikesCount}</span>
        </div>
      ))}
    </div>
  );
};

export default AllPosts;