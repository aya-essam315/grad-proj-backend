import {Router} from "express";
import * as courseServices from "./course.service.js"
import {authentication} from "../../middleware/authentication.js"
import { authorization } from "../../middleware/authorization.js";
import { endpoint } from "./end.point.js";
import { isValidate } from "../../middleware/validation/validation.js";
import * as courseValidation from "./course.validation.js"
const router = Router();

router.post("/add-course", 
    authentication,
    authorization(endpoint.course),
    isValidate(courseValidation.addCourseValidation),
    courseServices.addCourse)

router.delete("/:courseId",
    authentication,
    authorization(endpoint.course),
     courseServices.deleteCourse)

router.post("/createSyllabus/:courseId",
     authentication,
     authorization(endpoint.course),
     courseServices.createSyllabus)


router.post("/savesyllabus/:courseId",
     authentication,
     authorization(endpoint.course),
     courseServices.saveSyllabus)



router.post("/createPlan/:courseId",
       authentication,
     authorization(endpoint.course),
     courseServices.createPlan)

router.put("/savePlan/:courseId",
       authentication,
       authorization(endpoint.course),
     courseServices.savePlan)

router.get("/:courseId",
       authentication,
       authorization(endpoint.course),
       courseServices.getCourse)


router.get("/",
     authentication,
     authorization(endpoint.course),
     courseServices.getAllCourse)


router.get("/syllabus/:courseId",
     authentication,
     authorization(endpoint.course),
     courseServices.getSyllabus)


router.get("/:id", courseServices.getCourse)





router.post("/createPlan/savePlan/:courseId", courseServices.savePlan)
router.post("/createLessonContent/:id", courseServices.createLessonContent)
router.post("/createLessonContent/saveLesson/:id", courseServices.saveLessonContent)



export default router;