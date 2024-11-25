import { fetchUser } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import mongoose from 'mongoose'
import ProfileHeader from "@/components/sheared/ProfileHeader"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { profileTabs } from "@/constants"
import ZoheTab from "@/components/sheared/ZoheTab"

async function Page({ params }: { params: { id: string } }) {
    // Connect to MongoDB within the async function to avoid top-level await
    if (!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGODB_URL || "", {
        });
    }

    const user = await currentUser();

    if (!user) return null;

    const userInfo = await fetchUser(params.id);

    if (!userInfo?.onboarded) {
        redirect('/onboarding');
    }

    return (
        <section>
            <ProfileHeader
                accountId={userInfo.id}
                authUserId={user.id}
                name={userInfo.name}
                username={userInfo.username}
                imgUrl={userInfo.image}
                quote={userInfo.quote}
                bio={userInfo.bio}
            />

            <div className="mt-9">
                <Tabs defaultValue="zohe" className="w-full">
                    <TabsList className="tab">
                        {profileTabs.map((tab) => (
                            <TabsTrigger key={tab.label} value={tab.value} className="tab">
                                <Image
                                    src={tab.icon}
                                    alt={tab.label}
                                    width={24}
                                    height={24}
                                    className="object-contain"
                                />
                                <p className="max-sm:hidden">{tab.label}</p>
                                {tab.label === 'Zohe' && (
                                    <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                                        {userInfo?.zohe?.length}
                                    </p>
                                )}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {profileTabs.map((tab) => (
                        <TabsContent key={`content-${tab.label}`} value={tab.value} className="w-full text-light-1">
                            <ZoheTab
                                currentUserId={user.id}
                                accountId={userInfo.id}
                                accountType="User"
                            />
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </section>
    );
}

export default Page;
