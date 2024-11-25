"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import Zohe from "../models/zohe.model"
import { connectToDB } from "../mongoose"

interface Params {
    text: string,
    author: string,
    communityId: string|null,
    path: string
}

export async function createZohe({text,author,communityId,path}: Params){
    try{
        connectToDB()

    const createdZohe = await Zohe.create({
        text,
        author,
        community: null
    });

    //Update user model
    await User.findByIdAndUpdate(author,{
        $push: {zohe: createdZohe._id}
    })

    revalidatePath(path)

    } catch (error:any){
        throw new Error(`Error creating thread:${error.message}`)
    };
    
}

export async function fetchPosts(pageNumber = 1, pageSize = 20){
    connectToDB()

    //cal(culate the number of posts to skip

    const skipAmount = (pageNumber -1) * pageSize

    const postQuery = Zohe.find({parentId: {$in:[null, undefined]}})
        .sort({createdAt: 'desc'})
        .skip(skipAmount)
        .limit(pageSize)
        .populate({ path: 'author', model: User})
        .populate({
            path:'children',
            populate:{
                path: 'author',
                model: User,
                select: "_id name parentId image"
            }
        })

        const totalPostCount = await Zohe.countDocuments({parentId: {$in:
            [null, undefined]}})

        const posts = await postQuery.exec()

        const isNext = totalPostCount > skipAmount + posts.length

        return { posts, isNext}
}

// todo  fetch community 
export async function fetchZoheById(id: string){
    connectToDB()

    try{
        
        const zohe = await Zohe.findById(id)
            .populate({
                path:'author',
                model: User,
                select: "_id id name image"
            })
            .populate({
                path: 'children',
                populate: [
                    {
                        path:'author',
                        model: User,
                        select: "_id id name parentId image"
                    },
                    {
                        path: 'children',
                        model: Zohe,
                        populate:{
                            path: 'author',
                            model: User,
                            select: "_id id name parentId image"
                        }
                    }
                ]
            }).exec()

            return zohe
    } catch (error: any) {
      throw new Error(`Error fetching zohe: ${error.message}`)
    }
}

export async function addCommentToZohe(
    zoheId: string,
    commentText: string,
    userId: string,
    path: string
) {
    connectToDB()

    try{
        // find original zohe by id
        const originalZohe = await Zohe.findById(zoheId)

        if(!originalZohe){
            throw new Error(" Zohe not found")
        }

        // Create a new zohe with the comment text
        const commentZohe = new Zohe({
            text: commentText,
            author: userId,
            parentId: zoheId
        })

        // save the new zohe
        const savedCommentZohe = await commentZohe.save()

        //update initial zohe to include the new comment
        originalZohe.children.push(savedCommentZohe._id)

        //save initial zohe
        await originalZohe.save()

        revalidatePath(path)
    } catch (error:any){
        throw new Error(`Error adding comment to Zohe: ${error.message}`)
    }
}