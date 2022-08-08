
import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

export const getPost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await PostMessage.findById(id);
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPosts = async (req, res) => {
    const { page } = req.query;
    //console.log(req.query);

    try {
        const LIMIT = 4;
        const startIndex = (Number(page) - 1) * LIMIT //get the starting index of every package
        const total = await PostMessage.countDocuments({});
        //.sort({_id:-1}) give newest post first
        const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
        res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }

}
/*
export const getPosts = async (req, res) => {
    try {
        const postMessages = await PostMessage.find();

        res.status(200).json(postMessages);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
*/

//Query: /posts?page=1 => page = 1
//Params: /posts/123 => id = 123
//"i" ignore case //Test test TEST => test
export const getPostsBySearch = async (req, res) => {
    //console.log(req.query);
    const { searchQuery, tags } = req.query;
    try {
        const title = new RegExp(searchQuery, "i")
        const posts = await PostMessage.find({ $or: [{ title: title }, { tags: { $in: tags.split(",") } }] });
        res.json(posts);
    } catch (error) {
        res.status(404).json({ message: error.message });

    }
}
/*
export const getPostsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query;
    try {
        const title = new RegExp(searchQuery, "i")
        const posts = await PostMessage.find({ $or: [{ title }, { tags: { $in: tags.split(",") } }] });
        res.json({ data: posts });
    } catch (error) {
        res.status(404).json({ message: error.message });

    }
}
*/
export const createPost = async (req, res) => {
    const post = req.body;
    //console.log(req.body);
    //console.log(req.userId);
    //req.userId: from ../middleware/auth.js
    const newPost = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() });  //userId due to middleware/auth.js
    try {
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({ message: error.message })
    }
}

export const updatePost = async (req, res) => {
    const { id } = req.params;
    //console.log(req.params)
    const post = req.body;
    //const { title, message, creator, selectedFile, tags } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    // const updatedPost = { creator, title, message, tags, selectedFile, _id: id };
    //await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });
    //const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
    const updatedPost = await PostMessage.findByIdAndUpdate(id, { ...post, id }, { new: true });
    //adding {new: true} better
    res.json(updatedPost);
}

export const deletePost = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No post with that id");
    await PostMessage.findByIdAndRemove(id);
    res.json({ message: "Post deleted successfully" });

}

export const likePost = async (req, res) => {
    const { id } = req.params;
    if (!req.userId) return res.json({ message: "Unauthenticated" }); // req.userId ../middleware/auth.js
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No post with that id");
    const post = await PostMessage.findById(id);
    const index = post.likes.findIndex((a) => a === String(req.userId));
    if (index === -1) {
        //like the post
        post.likes.push(req.userId);
    } else {
        //dislike a post
        post.likes = post.likes.filter((a) => a !== String(req.userId));
    }
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
    // const updatedPost = await PostMessage.findByIdAndUpdate(id, { likeCount: post.likeCount + 1 }, { new: true });
    //const updatedPost = await PostMessage.findByIdAndUpdate(id, { likeCount: post.likeCount + 1 });
    res.json(updatedPost);
}

export const commentPost = async (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;
    //console.log(comment);
    const post = await PostMessage.findById(id);
    post.comments.push(comment);
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
    res.json(updatedPost);
    // console.log(updatedPost);

}
