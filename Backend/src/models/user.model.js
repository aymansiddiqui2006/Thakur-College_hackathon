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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (Password) {
  return await bcrypt.compare(Password, this.password);
}

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      Fullname: this.Fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  );
}


userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)