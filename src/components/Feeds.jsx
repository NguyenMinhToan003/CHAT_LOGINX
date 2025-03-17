import { useEffect, useState } from "react";
import FeedHeader from "./FeedHeader";
import Post from "./Post";
import { getPostByAuthorId, getPosts } from "../api/postAPI";

const Feeds = () => {
  const user = JSON.parse(localStorage.getItem("user"))
  const [posts, setPosts] = useState([])

  const fetchPost = async () => {
    let res = await getPosts(user._id)
    const postAuthor = await getPostByAuthorId({authorId:user._id, userId:user._id})
    res = [...res, ...postAuthor]
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