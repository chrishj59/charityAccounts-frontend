'use client'
import { useRouter } from "next/navigation";

export default function SignOutPage() {
  const router = useRouter()
  return (
  <div className="flex  min-h-screen  justify-content-center align-items-center ">
    
    
    <div className="grid ">
      <div className="col-12"><h1>Signed out </h1></div>
      <div className="col-12"><h2>Thank you for using Rationes Charitatis for you charity accounting</h2></div>
      <div className=""></div>
    </div>
    
  </div>
  )
}