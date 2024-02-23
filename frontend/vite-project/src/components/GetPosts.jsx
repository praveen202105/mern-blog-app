import axios from 'axios'
// import React from 'react'

const GetPosts = () => {
   async function allposts(){
    const response =await axios.get("http://localhost:5000/api/v1/post/allposts");
     console.log(response.data)
   }
   allposts();
    return (
    <div>
          <h1>posts</h1>
    </div>
  )
}

export default GetPosts;
