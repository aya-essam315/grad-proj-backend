
import { Schema, model,Types } from "mongoose";


const lessonSchema = new Schema({
 
    courseId:{type:Types.ObjectId, ref:"Course", required:"true"},
     createdBy:{type:Types.ObjectId, ref:"User"},

},{  strict: false, _id:true });

export const LessonModel = model("Lesson", lessonSchema);