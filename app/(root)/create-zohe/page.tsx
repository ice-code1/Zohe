import PostZohe from "@/components/forms/PostZohe"
import { fetchUser } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import mongoose from 'mongoose'

// Connect to MongoDB (make sure you have a connection file if needed)
await mongoose.connect(process.env.MONGODB_URL || "")

async function Page(){
    const user = await currentUser()

    if(!user)
        return null

    const userInfo = await fetchUser(user.id)

    if(!userInfo?.onboarded)
        redirect('/onboarding')

    return (
        <>
            <h1 className=" head-text">Create Life</h1>

            <PostZohe userId={userInfo._id} />
        </>
    )
      
}   

export default Page