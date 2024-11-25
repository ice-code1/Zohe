"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Zohe from "../models/zohe.model";
import { getJsPageSizeInKb } from "next/dist/build/utils";
import { FilterQuery, SortOrder } from "mongoose";

interface Params {
    userId: string;
    username: string;
    name: string;
    quote: string;
    bio: string;
    image: string;
    path: string;
}

export async function updateUser({
    userId,
    username,
    name,
    quote,
    bio,
    image,
    path,
}: Params): Promise<void> {
     connectToDB(); // Ensure the connection is awaited

    try {
        const updatedUser = await User.findOneAndUpdate(
            { id: userId }, // Ensure this matches your schema
            {
                username: username.toLowerCase(),
                name,
                quote,
                bio,
                image,
                onboarded: true,
            },
            {
                upsert: true, // This will create the document if it doesn't exist
                new: true, // Returns the updated document
            }
        );

        if (!updatedUser) {
            console.log('No user was updated or created.');
        }

        if (path === '/profile/edit') {
            revalidatePath(path);
        }
    } catch (error: any) {
        console.error(`Failed to create/update user: ${error.message}`); // Improved error logging
        throw new Error(`Failed to create/update user: ${error.message}`);
    }
}

export async function fetchUser(userId: string){
    try{
        connectToDB()

        return await User
            .findOne({id: userId})
            // .populate({
            //     path: 'communities',
            //     model: Community
            // })
    } catch (error: any) {
        throw new Error(`Failed to fetch user: ${error.message}`)
    }
}

export async function fetchUserPosts(userId: string){
    try{
        connectToDB()

        //zohe authored by user with user id

        //Todo: populate community
        const zohe = await User.findOne({ id:userId })
            .populate({
                path: 'zohe',
                model:Zohe,
                populate:{
                    path: 'children',
                    model: Zohe,
                    populate:{
                        path:'author',
                        model: User,
                        select:'name image id'
                    }
                }
            })

            return zohe
    }
    catch (error: any) {
    throw new Error(`Failed to fetch user posts: ${error.message}`)
    }
}

export async function fetchUsers({
    userId,
    searchString = "",
    pageNumber = 1,
    pageSize = 20,
    sortBy = "desc"
}:{
    userId: string
    searchString?: string
    pageNumber?: number
    pageSize?: number
    sortBy: SortOrder
}){
    try{
        connectToDB()

        const skipAmount = (pageNumber - 1) * pageSize

        const regex = new RegExp(searchString, "i")

        const query:FilterQuery<typeof User> = {
            id: {$ne: userId }
        }

        if(searchString.trim() !== ''){
            query.$or = [
                {username: { $regex: regex}},
                {name: {$regex: regex}}
            ]
        }

        const sortOptions = { createdAt: sortBy}

        const usersQuery = User.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize)

        const totalUsersCount = await User.countDocuments(query)

        const users = await usersQuery.exec()

        const isNext = totalUsersCount > skipAmount + users.length

        return {users, isNext}
    } catch (error: any){
        throw new Error(` Failed to fetch users: ${error.message}`)
    }
}

export async function getActivity(userId: string){
    try{
        connectToDB()

        //find all zohe created by the user
        const userZohe = await Zohe.find({author: userId})

        // retrive all child zohe ids (replies) from the clildren field
        const childZoheIds = userZohe.reduce((acc, userZohe) => {
            return acc.concat(userZohe.children)
        }, [])

        const replies = await Zohe.find({
            _id:{$in: childZoheIds},
            author: {$ne: userId}
        }).populate({
            path:'author',
            model: User,
            select: 'name image _id'
        })

        return replies
    } catch (error:any) {
        throw new Error(`Failed to fetch activity: ${error.message}`)
    }
}