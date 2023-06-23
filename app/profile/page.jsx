"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Profile from "@/components/Profile";

const MyProfle = () => {


  const {data: session} = useSession();
  const router = useRouter();



  if(!session?.user){
    router.push(`/`);
  }




  return (
    <Profile
        name={session?.user.name ||session?.username }
        profilePicture={session?.user.image}
        desc="Welcome to your profile"
      
    /> 
  )
}

export default MyProfle