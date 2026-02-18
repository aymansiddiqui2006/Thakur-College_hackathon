import express from "express";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";


const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error("generateAccessAndRefreshToken error:", error);
        throw new ApiError(500, error.message || "something went wrong");
    }
};


const RegisterUser = asyncHandler(async (req, res) => {
    const { username, email, password, role } = req.body;

    // Correct field validation
    if ([username, email, password, role].some(field => !field || field.toString().trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) throw new ApiError(400, "Username or email already exists");

    if (role !== "student" && role !== "faculty") throw new ApiError(400, "Role must be 'student' or 'faculty'");

    let userData = { username: username.toLowerCase(), email, password, role };

    if (role === "student") {
        const { rollNo, branch, semester } = req.body;
        if ([rollNo, branch, semester].some((field) => !field || field.toString().trim() === "")) {
            throw new ApiError(400, "All student fields are required");
        }
        userData = { ...userData, rollNo, branch, semester };
    } else if (role === "faculty") {
        const { department, facultyPosition } = req.body;
        if ([department, facultyPosition].some((field) => !field || field.trim() === "")) {
            throw new ApiError(400, "All faculty fields are required");
        }
        userData = { ...userData, department, facultyPosition };
    }

    const user = await User.create(userData);
    const createdUser = await User.findById(user._id).select("-password");
    if (!createdUser) throw new ApiError(500, "Failed to create user");

    return res.status(201).json(new ApiResponse(201, createdUser, "User registered"));
});


const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || email.trim() === "" || !password || password.trim() === "") {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found");

    // Use correct method name
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) throw new ApiError(401, "Invalid credentials");

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = { httpOnly: true, secure: false };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
});


const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined,
            },
        },
        {
            new: true,
        },
    );

    const options = {
        httpOnly: true,
        secure: false,
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "user Logged Out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRfeshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!incomingRfeshToken) {
        throw new ApiError(401, "unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRfeshToken,
            process.env.REFRESH_TOKEN_SECRET,
        );

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "unauthorized user and invalid refresh token");
        }

        if (incomingRfeshToken !== user?.refreshToken) {
            throw new ApiError(401, "refresh token is used");
        }

        const options = {
            httpOnly: true,
            secure: false,
        };
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
            user._id,
        );

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: refreshToken },
                    "Accessed token refreshed",
                ),
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "invalid refresh token");
    }
});



export {
    RegisterUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}