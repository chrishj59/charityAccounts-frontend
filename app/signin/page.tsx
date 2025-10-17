'use client'
import { SignIn } from "@stackframe/stack";
import { Button } from "primereact/button";

export default function SigninPage() {
  
  return (
    <div className="flex  min-h-screen  justify-content-center align-items-center ">
      <div className="flex justify-content-center flex-wrap text-purple-500">
      <h1 className="text-primary">My Custom Sign In page</h1>
      
      <SignIn />
      </div>
    </div>
  );
}