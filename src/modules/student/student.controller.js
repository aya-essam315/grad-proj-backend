import {Router} from 'express';
import { authentication } from '../../middleware/authentication.js';
import { authorization } from '../../middleware/authorization.js';
import { endpoint } from './student.endpoint.js';
import * as studentServices from "./student.service.js"
const router = Router();




// router.get("/:courseId/course-plan", 
//     authentication,
//     authorization(endpoint.study),
//     studentServices.getCoursePlan
// )

router.get("/:courseId/get-lessons", 
    authentication,
    authorization(endpoint.study),
    studentServices.getAllLessons
)

export default router;