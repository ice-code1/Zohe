import { OrganizationSwitcher, SignedIn, SignOutButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { dark } from '@clerk/themes'

function Topbar(){
    
    return( 
    <nav className="topbar">
        <Link href ="/" className="flex items-center gap-4">
            <Image src="/assets/logo.svg" alt = "logo" width={28}
            height = {28} />
            <p className="text-heading3-bold text-light-1 max-xs:hidden">
                ZoHe
            </p>
        </Link>

        <div className="flex items-center gap-1">
        
            <div className="block md:hidden">
                <SignedIn>
                
                    <SignOutButton>
                        <div className = "flex cusor-pointer">
                            <Image
                                src = "/assets/logout.svg"
                                alt = "logout"
                                width = {24}
                                height = {24}
                            >

                            </Image>
                        </div>
                    </SignOutButton>
                    
                </SignedIn>
            </div>

            
            <OrganizationSwitcher 
                appearance = {{
                    baseTheme:dark,
                    elements : {
                        organisationSwitcherTrigger:
                        "bg-leftsidebar py-6 px-8"
                    }
                }}
            />
            
            
        </div>
    </nav>
 )
}

export default Topbar