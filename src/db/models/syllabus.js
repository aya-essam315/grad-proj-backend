import { Schema, Types, model } from "mongoose";


const syllabusSchema = new Schema({
 
    courseId:{type:Types.ObjectId, ref:"Course", required:true},
    createdBy:{type:Types.ObjectId, ref:"User"},

},{  strict: false, _id:true });

export const SyllabusModel = model("Syllabus", syllabusSchema);