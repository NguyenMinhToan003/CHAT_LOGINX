import { useEffect, useState } from "react";
import FeedHeader from "./FeedHeader";
import Post from "./Post";
import { getPosts } from "../api/postAPI";

const Feeds = () => {
  const user = JSON.parse(localStorage.getItem("user"))
  const [posts, setPosts] = useState([])

  const fetchPost = async () => {
    const res = await getPosts(user._id)
    setPosts(res)
  }
  useEffect(() => {
    fetchPost()
  }, [])

  return (
    <div className="feed">
      <FeedHeader/>

      <div className="posts-container">
        {posts.map(post => {
          
          return (
            <Post post={post}/>
          );
        })}
      </div>
    </div>
  );
};

export default Feeds