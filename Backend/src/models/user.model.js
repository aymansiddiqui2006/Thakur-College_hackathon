import mongoose from "mongoose";
import jwt from "jsonwebtoken";



const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true

  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["student", "faculty"],
    required: true
  },
  // Student-only fields
  rollNo: {
    type: Number,
    required: function () {
      return this.role === "student";
    }
  },

  branch: {
    type: String,
    required: function () {
      return this.role === "student";
    }
  },

  semester: {
    type: String,
    required: function () {
      return this.role === "student";
    }
  },

  // Faculty-only fields
  department: {
    type: String,
    required: function () {
      return this.role === "faculty";
    }
  },

  facultyPosition: {
    type: String,
    required: function () {
      return this.role === "faculty";
    }
  }
}, {
  timestamps: true
})

import bcrypt from "bcrypt";

// Password hash before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate JWT tokens
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, username: this.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};


export const User = mongoose.model("User", userSchema)