import { formatDateString } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

interface Props {
  id: string
  currentUserId: string
  parentId: string | null
  content: string
  author: {
    name: string
    image: string
    id: string
  }
  community: {
    id: string
    name: string
    image: string
  }
  createdAt: string
  comments: {
    author: {
      image: string
    }
  }[] 
  isComment?: boolean
}

const ZoheCard = ({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  isComment,
}: Props) => {
  return (
    <article className={`flex w-full flex-col rounded-xl bg-custom p-7 ${isComment ? "" : ""}`}>
      <div className={`${isComment ? "" : "p-7"}`}>
        <div className="flex items-start justify-between">
          <div className="flex w-full flex-1 gap-4">
            <div className="flex flex-col items-center">
              <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
                <Image
                  src={author.image}
                  alt="Profile image"
                  fill
                  className="cursor-pointer rounded-full"
                />
              </Link>
              {/* Conditional background color based on isComment */}
              <div className={`zohe-card_bar ${isComment ? "bg-white p-1" : "border-[#DAA520] p-1"}`} />
            </div>

            <div className="flex flex-col w-full">
              <Link href={`/profile/${author.id}`} className="w-fit">
                <h4 className="cursor-pointer text-base-semibold text-light-1">{author.name}</h4>
              </Link>

              <p className="mt-2 text-small-regular text-light-2">{content}</p>

              <div className={`${isComment ? 'mb-10' : ''} mt-5 flex flex-col gap-3`}>
                <div className="flex gap-3.5">
                  <Image
                    src="/assets/heart-g.svg"
                    alt="heart"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                  <Link href={`/zohe/${id}`}>
                    <Image
                      src="/assets/reply.svg"
                      alt="reply"
                      width={24}
                      height={24}
                      className="cursor-pointer object-contain"
                    />
                  </Link>
                  <Image
                    src="/assets/repost.svg"
                    alt="repost"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                  <Image
                    src="/assets/share.svg"
                    alt="share"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                </div>

                {isComment && comments.length > 0 && (
                  <Link href={`/zohe/${id}`}>
                    <p className="mt-1 text-subtle-medium text-gray-1">
                      {comments.length} replies
                    </p>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

       
        

         {!isComment && community && (
            <Link href={`/communities/${community.id}`} className="mt-5 flex items-center">
              <p className="text-subtle-medium text-gray-1">
                {formatDateString(createdAt)} {community && ` - ${community.name} Community`}
              </p>

              <Image
                src={community.image}
                alt={community.name}
                width={14}
                height={14}
                className="ml-1 rounded-full object-cover"
              />
            </Link>
          )}
      </div>
    </article>
  )
}

export default ZoheCard
