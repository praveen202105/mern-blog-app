import { useState } from 'react';
import axios from 'axios';

const CreatePost = ({setallpost}) => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('content', description);
      if (image) {
        formData.append('media', image);
      }

      const response= await axios.post('http://localhost:5000/api/v1/post/createpost', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const newPost=response.data.post;
      // const updatedpost={...allpost,newpost}
      // setallpost(updatedpost);
      setallpost(prevPosts => [...prevPosts, newPost]);
      // post(newpost);
      // onPostCreated(response.data.posts);

      // Optionally, you can perform additional actions after the post is created, such as updating the UI
      // if (onPostCreated) {
      //   onPostCreated(response.data.post);
      // }

      alert('Post created successfully');
    } catch (error) {
      alert('Error creating post');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Create a New Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description:</label>
          <textarea 
            className="form-control" 
            id="description" 
            rows="3" 
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">Upload Image:</label>
          <input 
            className="form-control" 
            type="file" 
            id="image" 
            accept="image/*" 
            onChange={handleImageChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Create Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
