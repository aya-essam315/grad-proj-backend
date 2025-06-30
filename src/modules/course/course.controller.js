import { Router } from "express";
import * as courseServices from "./course.service.js";
import { authentication } from "../../middleware/authentication.js";
import { authorization } from "../../middleware/authorization.js";
import { endpoint } from "./end.point.js";
import { isValidate } from "../../middleware/validation/validation.js";
import * as courseValidation from "./course.validation.js";
const router = Router();

router.post(
  "/add-course",
  authentication,
  authorization(endpoint.course),
  isValidate(courseValidation.addCourseValidation),
  courseServices.addCourse
);

router.get(
  "/:courseId",
  authentication,
  authorization(endpoint.course),
  courseServices.getCourse
);

router.get("/",
  authentication,
  authorization(endpoint.course),
  courseServices.getAllCourse
);
router.delete(
  "/:courseId",
  authentication,
  authorization(endpoint.course),
  courseServices.deleteCourse
);

//syllabus
router.post(
  "/:courseId/createSyllabus",
  authentication,
  authorization(endpoint.course),
  courseServices.createSyllabus
);

router.post(
  "/:courseId/savesyllabus",
  authentication,
  authorization(endpoint.course),
  courseServices.saveSyllabus
);

router.get(
  "/:courseId/syllabus/",
  authentication,
  authorization(endpoint.course),
  courseServices.getSyllabus
);

router.post(
  "/:courseId/createPlan",
  authentication,
  authorization(endpoint.course),
  courseServices.createPlan
);

router.put(
  "/:courseId/savePlan",
  authentication,
  authorization(endpoint.course),
  courseServices.savePlan
);

router.get(
  "/:courseId/coursePlan",
  authentication,
  authorization(endpoint.course),
  courseServices.getCoursePlan
);

//lesson
router.post(
  "/:courseId/createLessonContent",
  authentication,
  authorization(endpoint.course),
  courseServices.createLessonContent
);

router.put(
  "/:courseId/save-lesson-content/:lessonId",
  authentication,
  authorization(endpoint.course),
  courseServices.saveLessonContent
);

router.get(
  "/lessons/:id",
  authentication,
  authorization(endpoint.course),
  courseServices.getAllLessons
);

router.get(
  "/:courseId/:lessonId",
  authentication,
  authorization(endpoint.course),
  courseServices.getContent
);

//assignment
router.post(
  "/:courseId/create-assignment",
  authentication,
  authorization(endpoint.course),
  courseServices.createAssignment
);

router.put(
  "/:courseId/save-assignment",
  authentication,
  authorization(endpoint.course),
  courseServices.saveAssignment
);

//exam
router.post(
  "/:courseId/create-exam",
  authentication,
  authorization(endpoint.course),
  courseServices.createExam
);

router.put(
  "/:courseId/save-exam",
  authentication,
  authorization(endpoint.course),
  courseServices.saveExam
);

router.get(
  "/:cousreId/get-exam/:examId",
  authentication,
  authorization(endpoint.course),
  courseServices.getExam
);

router.delete(
  "/:couresId/delete-exam/:examId",
  authentication,
  authorization(endpoint.course),
  courseServices.deleteExam
);

//activitis
router.post(
  "/:courseId/create-activities",
  authentication,
  authorization(endpoint.course),
  courseServices.createActivity
);

router.put(
  "/:courseId/save-activities",
  authentication,
  authorization(endpoint.course),
  courseServices.saveActivitis
);

router.get("/:id", courseServices.getCourse);

export default router;
