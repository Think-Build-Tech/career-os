import { Router } from "express";
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  createResource,
  getAllComments,
  createComment,
  toggleSaveItem,
  checkIsSaved,
  getSavedItems,
} from "./learning.controller";

export const learningRouter = Router();

// Saved Items
learningRouter.post("/saves/toggle", toggleSaveItem);
learningRouter.get("/saves/check", checkIsSaved);
learningRouter.get("/saves/:userId", getSavedItems);

// Posts
learningRouter.get("/posts", getAllPosts);
learningRouter.post("/posts", createPost);
learningRouter.get("/posts/:id", getPostById);
learningRouter.put("/posts/:id", updatePost);
learningRouter.delete("/posts/:id", deletePost);

// Resources
learningRouter.post("/resources", createResource);

// Comments
learningRouter.get("/comments", getAllComments);
learningRouter.post("/comments", createComment);

