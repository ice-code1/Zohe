import ZoheCard from "@/components/cards/ZoheCard";
import Comment from "@/components/forms/Comment";
import { fetchUser } from "@/lib/actions/user.actions";
import { fetchZoheById } from "@/lib/actions/zohe.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {
  // Await params resolution to ensure it is available
  const { id } = params;

  if (!id) return null;

  // Fetch the current user
  const user = await currentUser();
  if (!user) return null;

  // Fetch the user info and ensure they are onboarded
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  // Fetch the Zohe by ID
  const zohe = await fetchZoheById(id);

  return (
    <section className="relative">
      <div>
        <ZoheCard
          key={zohe._id}
          id={zohe._id}
          currentUserId={user?.id || " "}
          parentId={zohe.parentId}
          content={zohe.text}
          author={zohe.author}
          community={zohe.community}
          createdAt={zohe.createdAt}
          comments={zohe.children}
        />
      </div>

      <div className="mt-7">
        <Comment
          zoheId={zohe.id}
          currentUserImg={userInfo.image}
          currentUserId={userInfo._id.toString()} // Serialize MongoDB ID to string
        />
      </div>

      <div className="mt-10">
        {zohe.children.map((childItem: any) => (
          <ZoheCard
            key={childItem._id}
            id={childItem._id}
            currentUserId={user?.id || " "}
            parentId={childItem.parentId}
            content={childItem.text}
            author={childItem.author}
            community={childItem.community}
            createdAt={childItem.createdAt}
            comments={childItem.children}
            isComment
          />
        ))}
      </div>
    </section>
  );
};

export default Page;
