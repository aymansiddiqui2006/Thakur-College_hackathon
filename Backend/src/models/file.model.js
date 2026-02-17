import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  keyword: {
    type: [String],
    default: [],
    required: true,
  },
  searchText: {
    type: String,
    required: true
  },

  type: {
    type: String,
    enum: ["notes", "pyq", "research", "lecture"],
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  }

}, { timestamps: true });

export const File = mongoose.model('File', fileSchema);