import { fetchUser, fetchUsers } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import mongoose from 'mongoose'
import ProfileHeader from "@/components/sheared/ProfileHeader"

import Image from "next/image"
import { profileTabs } from "@/constants"
import ZoheTab from "@/components/sheared/ZoheTab"
import UserCard from "@/components/cards/UserCard"

async function Page() {
  // Connect to MongoDB within the async function to avoid top-level await
  if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URL || "", {
      });
  }

  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  
  if (!userInfo?.onboarded) 
      redirect('/onboarding')
  
    //fetch users
    const result = await fetchUsers({
      userId: user.id,
      searchString:"",
      pageNumber:1,
      pageSize:25
    })


  return (
    <section>
      <h1 className="head-text mb-10">
        {/* Search Bar */}

        <div className="mt-14 flex flex-col gap-9">
          {result.users.length === 0? (
            <p className="no-result"> No users</p>
          ): (
            <>
            {result.users.length === 0 ? (
              <p className="no-result"> No users</p>
            ):(
              <>
              {result.users.map((person) => (
                <UserCard 
                  key={person.id}
                  id= {person.id}
                  name = {person.name}
                  username={person.username}
                  imgUrl = {person.image}
                  personType = 'User'
                />
              ))}
              </>
            )}
            </>
          )}
        </div>
      </h1>
    </section>
  )
}

export default Page;