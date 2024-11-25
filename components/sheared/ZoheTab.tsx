import { fetchUserPosts } from "@/lib/actions/user.actions"
import { redirect } from "next/navigation"
import ZoheCard from "../cards/ZoheCard"

interface Props {
  currentUserId: string
  accountId: string
  accountType: string
}


const ZoheTab = async({currentUserId, accountId, accountType}:
   Props) => {
    let result = await fetchUserPosts(accountId)

    if (!result) redirect('/')
    return (
        <section className="mt-9 flex flex-col gap-10">
          {result.zohe.map((zohe:any) => (
             <ZoheCard 
              key={zohe._id}
              id={zohe._id}
              currentUserId = {currentUserId}
              parentId = {zohe.parentId}
              content = {zohe.text}
              author={
                accountType === 'User'
                  ? {name: result.name, image: result.image, 
                    id: result.id}
                  :{name: zohe.author.name, image: zohe.author.image,
                    id: zohe.author.id
                  }} //todo
              community ={zohe.community} //todo
              createdAt={zohe.createdAt}
              comments={zohe.children}
         /> 
          ))}
          ZoheTab
        </section>  
    )
}

export default ZoheTab