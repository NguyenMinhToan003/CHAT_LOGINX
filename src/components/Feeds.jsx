import { useEffect, useState } from "react";
import FeedHeader from "./FeedHeader";
import Post from "./Post";
import { getPostByAuthorId, getPosts } from "../api/postAPI";
import { CircularProgress } from "@mui/material";


const Feeds = () => {
  const user = JSON.parse(localStorage.getItem("user"))
  const [ischange,setIsChange]=useState(false)
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchPost = async () => {
    setIsLoading(true)
    let res = await getPosts(user._id)
    setPosts(res)
    setIsLoading(false)
  }
  useEffect(() => {
    fetchPost()
  }, [])


  useEffect(() => {
   if(ischange )


    fetchPost()
  }, [ischange])
  return (
    <div className="feed">
      <FeedHeader setIsChange={setIsChange}/>

      <div className="posts-container">
        {
          isLoading ?
            <CircularProgress/>
            : <>
              {
                posts.map(post => {
                  return <Post post={post} />
                })
              }
          </>
        }
      </div>
    </div>
  );
};

export default Feeds