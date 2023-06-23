'use client'

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import { useState } from 'react';
import AuthForm from '@/components/AuthForm';
import { enqueueSnackbar, SnackbarProvider } from 'notistack'

export default function Login() {

  const { data: session } = useSession();
  const router = useRouter();

  if (session?.user) {
    router.push(`/`);
  }

  async function loginWithGoogle() {
    await signIn("google")
  }

  async function loginWithGithub() {
    await signIn("github")
  }

  async function loginWithTwitter() {
    await signIn("twitter")
  }

  return (
    <>
      <SnackbarProvider
        iconVariant={{
          success: '✅',
          error: '✖️',
          warning: '⚠️',
          info: 'ℹ️',
        }}
      />
      <div className='w-full max-w-full flex justify-center  items-center flex-col'>
        <AuthForm
          AuthType={"Login"}
          loginWithGoogle={loginWithGoogle}
          loginWithGithub={loginWithGithub}
          loginWithTwitter={loginWithTwitter}
        />
      </div>
    </>

  );
}
