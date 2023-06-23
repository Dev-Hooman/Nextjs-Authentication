'use client'
import React from 'react'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

function ProtectedRoute({children}) {
    const {status} = useSession({
        required: true,
        onUnauthenticated(){
            redirect('/login')
        }
    })
    if(status === "loading"){
        return "Loading..."
    }
  return (
    <div>{children}</div>
  )
}

export default ProtectedRoute