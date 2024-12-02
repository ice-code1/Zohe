import AccountProfile from "@/components/forms/AccountProfile";
import { currentUser } from "@clerk/nextjs/server";
import User from "@/lib/models/user.model"; // Import the User model
import mongoose from "mongoose";
import { redirect } from "next/navigation"; // Correct import for redirect

// Ensure MongoDB connection
if (!mongoose.connection.readyState) {
    await mongoose.connect(process.env.MONGODB_URL || "");
}

async function Page() {
    // Fetch the authenticated user
    const user = await currentUser();
    if (!user) return null;

    // Check onboarding status and redirect if not onboarded
    const isOnboarded = await User.findOne({ id: user.id }, "onboarded").exec();
    if (!isOnboarded?.onboarded) {
        redirect("/");
    }

    // Fetch user info from your database
    let userInfo;
    try {
        userInfo = await User.findOne({ id: user.id }).exec();
    } catch (error) {
        console.error("Error fetching user info:", error);
    }

    // Create the user data object
    const userData = {
        id: user.id,
        objectId: userInfo?._id || "",
        username: userInfo ? userInfo?.username : user.username || "",
        name: userInfo ? userInfo?.name : user.firstName || "",
        quote: userInfo ? userInfo?.quote : "",
        bio: userInfo ? userInfo?.bio : "",
        image: userInfo?.image || user.imageUrl || "",
    };

    return (
        <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
            <h1 className="head-text">Onboarding</h1>
            <p className="mt-3 text-base-regular text-light-2">
                Complete your profile now to use ZoHe
            </p>

            <section className="mt-9 bg-custom p-10">
                <AccountProfile user={userData} btnTitle="Continue" />
            </section>
        </main>
    );
}

export default Page;
