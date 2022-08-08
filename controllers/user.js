
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.js";

export const signin = async (req, res) => {
    const { email, password } = req.body; //req.body = formData in client
    try {
        const existingUser = await User.findOne({ email });

        if (!existingUser) return res.status(404).json({ message: "User doesn't exist" });

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });
        //_id from database
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.TOKEN_SECRET, { expiresIn: "1h" });

        res.status(200).json({ result: existingUser, token });// result is for client
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const signup = async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });
        if (password !== confirmPassword) return res.status(400).json({ message: "Password don't match" });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });
        //_id from database
        const token = jwt.sign({ email: result.email, id: result._id }, process.env.TOKEN_SECRET, { expiresIn: "1h" });
        res.status(200).json({ result, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }

};

/*
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import UserModal from "../models/user.js";

const secret = 'test';

export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const oldUser = await UserModal.findOne({ email });

        if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

        const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "1h" });

        res.status(200).json({ result: oldUser, token });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const signup = async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    try {
        const oldUser = await UserModal.findOne({ email });

        if (oldUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await UserModal.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });

        const token = jwt.sign({ email: result.email, id: result._id }, secret, { expiresIn: "1h" });

        res.status(201).json({ result, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });

        console.log(error);
    }
};
*/