import { CourseModel } from "../../db/models/course.model.js";
import { LessonModel } from "../../db/models/lesson.model.js";
import { PlanModel } from "../../db/models/plan.model.js";
import { asyncHandler } from "../../utils/errors/async.handler.js";
import { successResponse } from "../../utils/success/success.response.js";






export const getAllLessons = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  const lessons = await LessonModel.find({ courseId});

  successResponse({
    res,
    message: "Fetched Successfally",
    data: lessons,
  });
});