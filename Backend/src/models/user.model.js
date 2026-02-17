import mongoose from "mongoose";

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
    department:{
        type: String,
        required: true
    },
    role: {
      type: String,
      enum: ["student", "faculty"],
      required: true
    },
    RollNo:{
        type:Number,
        required: function() {
            return this.role === "student";
        }
    },
    FacultyPos:{
        type:String,
        required: function() {
            return this.role === "faculty";
        }
    }
},{
    timestamps: true
})

import bcrypt from "bcrypt";

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


export const USer=mongoose.model("User",userSchema)