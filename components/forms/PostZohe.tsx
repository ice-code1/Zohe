"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { ZoheValidation } from "@/lib/validations/zohe"
// import { updateUser } from "@/lib/actions/user.actions"
import { usePathname, useRouter } from "next/navigation"
import { createZohe } from "@/lib/actions/zohe.actions"
import { useOrganization } from "@clerk/nextjs"


interface Props{
    user:{
        id:string
        objectId:string
        username:string
        name:string
        quote:string
        bio:string
        image:string
    }
    btnTitle:string
}  


    


function PostZohe({userId}: {userId:string }){
    const router = useRouter()
    const  pathname  = usePathname()
    const { organization } = useOrganization()


    const form = useForm({
        resolver: zodResolver(ZoheValidation),
        defaultValues:{
            zohe:'',
            accountId: userId
            
        }
    })

    const onSubmit = async (values: z.infer<typeof ZoheValidation>) =>{
     // console.log('ORG ID ',organization )
      await createZohe({
        text: values.zohe,
        author: userId,
        communityId: organization ? organization.id: null,
        path: pathname
        })

     router.push("/")
    }

    return (
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} 
        className="mt-10 flex flex-col justify-start gap-10 ">

        <FormField
          control={form.control}
          name="zohe"
          render={({ field }) => (
            <FormItem className = "flex flex-col  w-full gap-3">
              <FormLabel className="text-base-semibold text-light-2 ">
                Content
                </FormLabel>
              <FormControl className="no-focus border
              border-white bg-custom text-light-1">
                <Textarea 
                  rows={15}
                  {...field}
                 />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

          <Button type="submit"
          className="custom-submit-button">
            Post Life
          </Button>

        </form>
    </Form>
    )
}

export default PostZohe