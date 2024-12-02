"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";

import User from "../models/user.model";
import Zohe from "../models/zohe.model";
import Community from "../models/community.model";

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB();

  // Calculate the number of posts to skip based on the page number and page size.
  const skipAmount = (pageNumber - 1) * pageSize;

  // Create a query to fetch the posts that have no parent (top-level zohes) (a zohe that is not a comment/reply).
  const postsQuery = Zohe.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "community",
      model: Community,
    })
    .populate({
      path: "children", // Populate the children field
      populate: {
        path: "author", // Populate the author field within children
        model: User,
        select: "_id name parentId image", // Select only _id and username fields of the author
      },
    });

  // Count the total number of top-level posts (zohes) i.e., zohes that are not comments.
  const totalPostsCount = await Zohe.countDocuments({
    parentId: { $in: [null, undefined] },
  }); // Get the total count of posts

  const posts = await postsQuery.exec();

  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
}

interface Params {
  text: string,
  author: string,
  communityId: string | null,
  path: string,
}

export async function createZohe({ text, author, communityId, path }: Params
) {
  try {
    connectToDB();

    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const createdZohe = await Zohe.create({
      text,
      author,
      community: communityIdObject, // Assign communityId if provided, or leave it null for personal account
    });

    // Update User model
    await User.findByIdAndUpdate(author, {
      $push: { zohes: createdZohe._id },
    });

    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { zohes: createdZohe._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create zohe: ${error.message}`);
  }
}

async function fetchAllChildZohes(zoheId: string): Promise<any[]> {
  const childZohes = await Zohe.find({ parentId: zoheId });

  const descendantZohes = [];
  for (const childZohe of childZohes) {
    const descendants = await fetchAllChildZohes(childZohe._id);
    descendantZohes.push(childZohe, ...descendants);
  }

  return descendantZohes;
}

export async function deleteZohe(id: string, path: string): Promise<void> {
  try {
    connectToDB();

    // Find the zohe to be deleted (the main zohe)
    const mainZohe = await Zohe.findById(id).populate("author community");

    if (!mainZohe) {
      throw new Error("Zohe not found");
    }

    // Fetch all child zohes and their descendants recursively
    const descendantZohes = await fetchAllChildZohes(id);

    // Get all descendant zohe IDs including the main zohe ID and child zohe IDs
    const descendantZoheIds = [
      id,
      ...descendantZohes.map((zohe) => zohe._id),
    ];

    // Extract the authorIds and communityIds to update User and Community models respectively
    const uniqueAuthorIds = new Set(
      [
        ...descendantZohes.map((zohe) => zohe.author?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainZohe.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantZohes.map((zohe) => zohe.community?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainZohe.community?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    // Recursively delete child zohes and their descendants
    await Zohe.deleteMany({ _id: { $in: descendantZoheIds } });

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { zohes: { $in: descendantZoheIds } } }
    );

    // Update Community model
    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { zohes: { $in: descendantZoheIds } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete zohe: ${error.message}`);
  }
}

export async function fetchZoheById(zoheId: string) {
  connectToDB();

  try {
    const zohe = await Zohe.findById(zoheId)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      }) // Populate the author field with _id and username
      .populate({
        path: "community",
        model: Community,
        select: "_id id name image",
      }) // Populate the community field with _id and name
      .populate({
        path: "children", // Populate the children field
        populate: [
          {
            path: "author", // Populate the author field within children
            model: User,
            select: "_id id name parentId image", // Select only _id and username fields of the author
          },
          {
            path: "children", // Populate the children field within children
            model: Zohe, // The model of the nested children (assuming it's the same "Zohe" model)
            populate: {
              path: "author", // Populate the author field within nested children
              model: User,
              select: "_id id name parentId image", // Select only _id and username fields of the author
            },
          },
        ],
      })
      .exec();

    return zohe;
  } catch (err) {
    console.error("Error while fetching zohe:", err);
    throw new Error("Unable to fetch zohe");
  }
}

export async function addCommentToZohe(
  zoheId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDB();

  try {
    // Find the original zohe by its ID
    const originalZohe = await Zohe.findById(zoheId);

    if (!originalZohe) {
      throw new Error("Zohe not found");
    }

    // Create the new comment zohe
    const commentZohe = new Zohe({
      text: commentText,
      author: userId,
      parentId: zoheId, // Set the parentId to the original zohe's ID
    });

    // Save the comment zohe to the database
    const savedCommentZohe = await commentZohe.save();

    // Add the comment zohe's ID to the original zohe's children array
    originalZohe.children.push(savedCommentZohe._id);

    // Save the updated original zohe to the database
    await originalZohe.save();

    revalidatePath(path);
  } catch (err) {
    console.error("Error while adding comment:", err);
    throw new Error("Unable to add comment");
  }
}