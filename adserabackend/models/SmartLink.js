const mongoose = require("mongoose");

const smartLinkSchema = new mongoose.Schema({

  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  name:{
    type:String,
    required:true
  },

  targetUrl:{
    type:String,
    required:true
  },

  smartCode:{
    type:String,
    unique:true
  },

  clicks:{
    type:Number,
    default:0
  },

  status:{
    type:String,
    enum:["pending","approved","rejected"],
    default:"pending"
  }

},{timestamps:true});

module.exports = mongoose.model("SmartLink",smartLinkSchema);