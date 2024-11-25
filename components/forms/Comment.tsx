"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { CommentValidation } from "@/lib/validations/zohe"
import { usePathname, useRouter } from "next/navigation"
import { addCommentToZohe, createZohe } from "@/lib/actions/zohe.actions"
import Image from "next/image"

interface Props {
  zoheId: string
  currentUserImg: string
  currentUserId: string
}

const Comment = ({ zoheId, currentUserImg, currentUserId }: Props) => {
  const router = useRouter()
  const pathname = usePathname()

  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      zohe: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addCommentToZohe(
    zoheId,
    values.zohe,
    JSON.parse(currentUserId),
    pathname
    )
    form.reset()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="comment-form"
      >
        <FormField
          control={form.control}
          name="zohe"
          render={({ field }) => (
            <FormItem className="flex  w-full items-center gap-3">
                <FormLabel >
                    <Image 
                       src={currentUserImg}
                       alt="Profile image"
                       width = {48}
                       height = {48}
                       className="rounded-full object-cover" 
                    />
                </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                  type="text"
                  placeholder="Comment..."
                  className="no-focus text-white outline-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="comment-form_btn">
          Reply
        </Button>
      </form>
    </Form>
  )
}

export default Comment
