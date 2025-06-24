
import { Schema, Types, model } from "mongoose";

const courseSchema = new Schema({
    courseName:{type:String, required:true},
    courseCode:{type:String, required:true, unique:true},
    domain:{type:String},
    subdomain:{type:String},
    createdBy:{type:Types.ObjectId, ref:"User"},
    level:{type:String}
    // syllabus:[],
    

},
  
{timestamps:true, strict:false});

export const CourseModel = model("Course", courseSchema);