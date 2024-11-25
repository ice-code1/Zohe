import ZoheCard from "@/components/cards/ZoheCard"
import Comment from "@/components/forms/Comment";
import { fetchUser } from "@/lib/actions/user.actions";
import { fetchZoheById } from "@/lib/actions/zohe.actions";
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";

const Page = async ({params}: {params: {id?: string}}) => {
    if(!params.id) return null;
    
    const user = await currentUser();
    if(!user) return null;

    const userInfo = await fetchUser(user.id);
    if(!userInfo?.onboarded) redirect('/onboarding')

    const zohe = await fetchZoheById(params.id)

    return(
    <section className="relative">
        <div>
        <ZoheCard 
            key={zohe._id}
            id={zohe._id}
            currentUserId = {user?.id || " "}
            parentId = {zohe.parentId}
            content = {zohe.text}
            author={zohe.author}
            community ={zohe.community}
            createdAt={zohe.createdAt}
            comments={zohe.children}
        />  
        </div>

        <div className="mt-7">
            <Comment
                zoheId = {zohe.id}
                currentUserImg = {userInfo.image}
                currentUserId = {JSON.stringify(userInfo._id)}
            />
        </div>

        <div className="mt-10">
            {zohe.children.map((childItem: any) =>(
                <ZoheCard 
                    key={childItem._id}
                    id={childItem._id}
                    currentUserId = {user?.id || " "}
                    parentId = {childItem.parentId}
                    content = {childItem.text}
                    author={childItem.author}
                    community ={childItem.community}
                    createdAt={childItem.createdAt}
                    comments={childItem.children}
                    isComment
            />  
            ))}
        </div>

    </section>
    )
}

export default Page