import { Request, Response } from "express";
import {
  LearningPostService,
  LearningResourceService,
  LearningCommentService,
  SavedItemService,
} from "./services";

const postService = new LearningPostService();
const resourceService = new LearningResourceService();
const commentService = new LearningCommentService();
const savedItemService = new SavedItemService();

// Learning Posts
export async function getAllPosts(req: Request, res: Response) {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 20;
    const posts = await postService.paginate({ page, limit });
    return res.status(200).json({
      success: true,
      posts,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function getPostById(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide post ID",
      });
    }

    const post = await postService.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    return res.status(200).json({
      success: true,
      post,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function createPost(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.author_user_id || !data.title || !data.content_type || !data.scope_type) {
      return res.status(400).json({
        success: false,
        message: "author_user_id, title, content_type, and scope_type are required",
      });
    }

    const post = await postService.create(data);
    return res.status(201).json({
      success: true,
      post,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function updatePost(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    const data = req.body;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide post ID",
      });
    }

    const post = await postService.updateById(id, data);
    return res.status(200).json({
      success: true,
      post,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function deletePost(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide post ID",
      });
    }

    await postService.deleteById(id);
    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

// Resources
export async function createResource(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.learning_post_id || !data.resource_type) {
      return res.status(400).json({
        success: false,
        message: "learning_post_id and resource_type are required",
      });
    }

    const resource = await resourceService.create(data);
    return res.status(201).json({
      success: true,
      resource,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

// Comments
export async function getAllComments(req: Request, res: Response) {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 20;
    const comments = await commentService.paginate({ page, limit });
    return res.status(200).json({
      success: true,
      comments,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function createComment(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.learning_post_id || !data.user_id || !data.content) {
      return res.status(400).json({
        success: false,
        message: "learning_post_id, user_id, and content are required",
      });
    }

    const comment = await commentService.create(data);
    return res.status(201).json({
      success: true,
      comment,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

// Saved Items
export async function toggleSaveItem(req: Request, res: Response) {
  try {
    const { userId, itemType, itemId, studentId, metadata } = req.body;
    if (!userId || !itemType || !itemId) {
      return res.status(400).json({
        success: false,
        message: "userId, itemType, and itemId are required",
      });
    }

    const result = await savedItemService.toggleSave(
      userId,
      itemType,
      itemId,
      studentId,
      metadata
    );
    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function checkIsSaved(req: Request, res: Response) {
  try {
    const { userId, itemType, itemId } = req.query;
    if (!userId || !itemType || !itemId) {
      return res.status(400).json({
        success: false,
        message: "userId, itemType, and itemId query params are required",
      });
    }

    const saved = await savedItemService.isSaved(
      String(userId),
      String(itemType),
      String(itemId)
    );
    return res.status(200).json({
      success: true,
      saved,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function getSavedItems(req: Request, res: Response) {
  try {
    const userId = req.params['userId'] as string;
    const itemType = req.query['itemType'] as string | undefined;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Please provide user ID",
      });
    }

    const items = await savedItemService.getSavedItems(userId, itemType);
    return res.status(200).json({
      success: true,
      items,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

