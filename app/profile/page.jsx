"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Profile from "@/components/Profile";
import { Router } from "next/router";

const MyProfle = () => {

  const {data: session} = useSession();
  const router = useRouter();

  const [posts, setPosts] = useState()

  useEffect(()=>{
    const fecthPosts = async () =>{
      const response = await fetch(`/api/users/${session?.user.id}/posts`);

      const data = await response.json();

      setPosts(data)
    }
    if(session?.user.id)  fecthPosts();

  },[])

    const handleEdit = (post) =>{
      router.push(`/update-prompt?id=${post._id}`);
    }

    const handleDelete = async (post) => {
      const hasConfirmed = confirm(
        "Are you sure you want to delete this prompt?"
      );
  
      if (hasConfirmed) {
        try {
          await fetch(`/api/prompt/${post._id.toString()}`, {
            method: "DELETE",
          });
  
          const filteredPosts = posts.filter((item) => item._id !== post._id);
  
          setPosts(filteredPosts);
        } catch (error) {
          console.log(error);
        }
      }
    };


  return (
    <Profile
        name="My Profile"
        desc="Welcome to you profile"
        data={posts}
        handleEdit={handleEdit}
        handleDelete={handleDelete}    
    />
  )
}

export default MyProfle