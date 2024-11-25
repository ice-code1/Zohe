import AccountProfile from "@/components/forms/AccountProfile";
import { currentUser } from "@clerk/nextjs/server";
import User from "@/lib/models/user.model"; // Import the User model
import mongoose from "mongoose";

// Connect to MongoDB (make sure you have a connection file if needed)
await mongoose.connect(process.env.MONGODB_URL || "");

async function Page() {
    const user = await currentUser();
    let userInfo = null;

    if (user?.id) {
        // Fetch user info from your database
        try {
            userInfo = await User.findOne({ id: user.id }).exec();
        } catch (error) {
            console.error("Error fetching user info:", error);
        }
    }

    const userData = {
        id: user?.id || "",
        objectId: userInfo?._id || "",
        username: userInfo?.username || user?.username || "",
        name: userInfo?.name || user?.firstName || "",
        quote: userInfo?.quote || "",
        bio: userInfo?.bio || "",
        image: userInfo?.image || user?.imageUrl || "",
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
