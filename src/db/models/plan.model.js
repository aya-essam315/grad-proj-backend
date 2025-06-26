import { Schema, Types, model } from "mongoose";

const planSchema = new Schema(
  {
    courseId: { type: Types.ObjectId, ref: "Course" },
    createdBy: { type: Types.ObjectId, ref: "User" },
    // syllabusId: { type: Types.ObjectId, ref: "Syllabus" },
  },
  { strict: false, _id: true }
);

export const PlanModel = model("Plan", planSchema);
