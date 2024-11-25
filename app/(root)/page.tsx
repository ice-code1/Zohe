import ZoheCard from "@/components/cards/ZoheCard";
import { fetchPosts } from "@/lib/actions/zohe.actions";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {

  const result = await fetchPosts(1,30)
  const user = await currentUser()

  console.log(result)

  return (
      <>
          <h1 className="head-text text-left">Abode</h1>

          <section className="mt-9 flex flex-col gap-10">
            {result.posts.length === 0? (
              <p className="no-result">No life found</p>
            ):(
              <>
                {result.posts.map((post) => (
                  <ZoheCard 
                    key={post._id}
                    id={post._id}
                    currentUserId = {user?.id || " "}
                    parentId = {post.parentId}
                    content = {post.text}
                    author={post.author}
                    community ={post.community}
                    createdAt={post.createdAt}
                    comments={post.children}
                  />
                ))}
              </>
            )}
          </section>
      </>
  );
}
