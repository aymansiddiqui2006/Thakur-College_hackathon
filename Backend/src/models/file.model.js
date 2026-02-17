import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  title:{
    type: String,
    required: true,
  },
  description:{
    type: String,
    required: true,
  },
  keyword:[{
    type: String,
    required: true,
  }],
  type:{
    type: String,
    enum:["notes", "pyq", "research", "lecture"],
    required: true,
  }


});

export const File = mongoose.model('File', fileSchema);