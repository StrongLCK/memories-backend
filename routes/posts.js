import express from "express";
//in node must include .js, in React, no need .js
import { getPostsBySearch, getPosts, getPost, createPost, updatePost, deletePost, likePost, commentPost } from "../controllers/posts.js";
import auth from "../middleware/auth.js";

const router = express.Router();
//export const fetchPostsBySearch = (searchQuery) => API.get(`/posts/search?searchQuery=${searchQuery.search || "none"}&tags=${searchQuery.tags}`);
router.get("/search", getPostsBySearch);
//export const fetchPosts = (page) => API.get(`/posts?page=${page}`);
router.get("/", getPosts);
router.get("/:id", getPost);// :id = dynamic id
router.post("/", auth, createPost); //auth passing req.userId to the next i.e. controllers
router.patch("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);
router.patch("/:id/likePost", auth, likePost);
router.post("/:id/commentPost", auth, commentPost);
//likePost is done by backend, deletePost,updatePost are done by frontend


export default router;
//const express = require("express");
//module.exports = router;
