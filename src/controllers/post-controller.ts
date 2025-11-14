import { Request, RequestHandler } from "express";
import Post from "../models/post-model";
import User from "../models/user-model";
import cloudinary from "../config/cloudinary";

interface AuthRequest extends Request {
  user?: { id: string };
  files?: Express.Multer.File[]; // Add this for TypeScript
}

// Helper function to upload buffer to cloudinary
const uploadToCloudinary = (buffer: Buffer, folder = 'blog-images'): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'auto',
        transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};

export const createHandler: RequestHandler = async (req, res) => {
  try {
    const { title, content } = req.body;

    // Validate required fields
    if (!title || !content) {
      res.status(400).json({
        message: "Title and content are required",
        success: false
      });
      return;
    }

    const authorId = (req as AuthRequest).user?.id;

    // Handle image uploads if files are present
    let images: { url: string; publicId: string }[] = [];

    if ((req as AuthRequest).files && (req as AuthRequest).files!.length > 0) {
      try {
        // Files are already uploaded to Cloudinary via multer-storage-cloudinary
        // Extract the URLs and public IDs from the uploaded files
        images = (req as AuthRequest).files!.map((file: any) => ({
          url: file.path, // Cloudinary URL is stored in file.path
          publicId: file.filename // Cloudinary public_id is stored in file.filename
        }));
      } catch (uploadError) {
        console.error("Error processing images:", uploadError);
        res.status(500).json({
          message: "Failed to process images",
          success: false
        });
        return;
      }
    }

    // Create new post with images
    const newPost = new Post({
      title,
      content,
      authorId,
      images // Include the uploaded images
    });

    await newPost.save();

    res.status(201).json({
      message: "Post created successfully",
      success: true,
      post: {
        id: newPost._id,
        title: newPost.title,
        content: newPost.content,
        images: newPost.images,
        createdAt: newPost.createdAt
      }
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
};

export const myPostsHandler: RequestHandler = async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id; // safe cast
    const posts = await Post.find({ authorId: userId }).populate('authorId', 'name email').populate('comments.userId', 'name').sort({ updatedAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error("Error fetching user's posts:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const listHandler: RequestHandler = async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id; // Optional for public access

    // Pagination parameters
    const limit = parseInt(req.query.limit as string) || 10;
    const cursor = req.query.cursor as string;

    // Build query
    let query: any = {};

    // If authenticated, exclude user's own posts
    if (userId) {
      query.authorId = { $ne: userId };
    }

    // Cursor-based pagination
    if (cursor) {
      query._id = { $lt: cursor };
    }

    // Fetch posts
    const posts = await Post.find(query)
      .populate('authorId', 'name email')
      .populate('comments.userId', 'name')
      .sort({ updatedAt: -1 })
      .limit(limit + 1); // Fetch one extra to check if there are more

    const hasMore = posts.length > limit;
    const postsToReturn = hasMore ? posts.slice(0, limit) : posts;
    const nextCursor = hasMore ? postsToReturn[postsToReturn.length - 1]._id : null;

    res.json({
      posts: postsToReturn,
      nextCursor,
      hasMore,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const getByIdHandler: RequestHandler = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('authorId', 'name email')
      .populate('comments.userId', 'name');
    if (!post) {
      res.status(404).json({ message: "Post not found", success: false });
      return;
    }
    res.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const UpdatePostByIdHandler: RequestHandler = async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({ message: "Post not found", success: false });
      return;
    }
    post.title = title;
    post.content = content;
    await post.save();
    res.json({ message: "Post updated successfully", success: true });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const deletePostByIdHandler: RequestHandler = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({ message: "Post not found", success: false });
      return;
    }
    await post.deleteOne();
    res.json({ message: "Post deleted successfully", success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// LIKE/UNLIKE POST
export const likePostHandler: RequestHandler = async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Post not found", success: false });
      return;
    }

    const likeIndex = post.likes.indexOf(userId as any);

    if (likeIndex > -1) {
      // Unlike: remove user from likes array
      post.likes.splice(likeIndex, 1);
      post.likesCount = Math.max(0, post.likesCount - 1);
    } else {
      // Like: add user to likes array
      post.likes.push(userId as any);
      post.likesCount += 1;
    }

    await post.save();

    res.json({
      message: likeIndex > -1 ? "Post unliked" : "Post liked",
      success: true,
      liked: likeIndex === -1,
      likesCount: post.likesCount
    });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// COMMENT ON POST
export const commentPostHandler: RequestHandler = async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;
    const postId = req.params.id;
    const { text } = req.body;

    if (!text || text.trim() === "") {
      res.status(400).json({ message: "Comment text is required", success: false });
      return;
    }

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Post not found", success: false });
      return;
    }

    // Parse @mentions from text (e.g., @username)
    const mentionRegex = /@(\w+)/g;
    const mentionedUsernames = [...text.matchAll(mentionRegex)].map(match => match[1]);

    // Find mentioned users by name (simple approach)
    const mentionedUsers = await User.find({
      name: { $in: mentionedUsernames }
    });

    const mentionedUserIds = mentionedUsers.map(user => user._id);

    // Add comment to post
    post.comments.push({
      userId: userId as any,
      text: text.trim(),
      mentions: mentionedUserIds,
      createdAt: new Date(),
    } as any);

    post.commentsCount = post.comments.length;
    await post.save();

    // Populate the new comment for response
    const updatedPost = await Post.findById(postId)
      .populate('comments.userId', 'name');

    const newComment = updatedPost!.comments[updatedPost!.comments.length - 1];

    res.json({
      message: "Comment added successfully",
      success: true,
      comment: newComment,
      commentsCount: post.commentsCount
    });
  } catch (error) {
    console.error("Error commenting on post:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// SAVE/UNSAVE POST
export const savePostHandler: RequestHandler = async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Post not found", success: false });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found", success: false });
      return;
    }

    const saveIndex = user.savedPosts.indexOf(postId as any);

    if (saveIndex > -1) {
      // Unsave: remove post from saved array
      user.savedPosts.splice(saveIndex, 1);
    } else {
      // Save: add post to saved array
      user.savedPosts.push(postId as any);
    }

    await user.save();

    res.json({
      message: saveIndex > -1 ? "Post removed from saved" : "Post saved",
      success: true,
      saved: saveIndex === -1
    });
  } catch (error) {
    console.error("Error saving post:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// SHARE POST (increment counter)
export const sharePostHandler: RequestHandler = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Post not found", success: false });
      return;
    }

    post.sharesCount += 1;
    await post.save();

    res.json({
      message: "Post shared",
      success: true,
      sharesCount: post.sharesCount
    });
  } catch (error) {
    console.error("Error sharing post:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};
