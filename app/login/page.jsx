'use client'

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import { useState } from 'react';
import AuthForm from '@/components/AuthForm';

export default function Login() {

  const {data: session} = useSession();
  const router = useRouter();


  if(session?.user){
    router.push(`/`);
  }

  async function loginWithGoogle(){
    await signIn("google")

    
  }
 



  return (
    <div className='w-full max-w-full flex justify-center  items-center flex-col'>


      <AuthForm
      AuthType={"Login"}
      loginWithGoogle={loginWithGoogle}
      />


   


    </div>
  );
}
