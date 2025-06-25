import joi from "joi"


export const addCourseValidation = joi.object(
     {
    courseName:joi.string().min(5).max(100).required(),
    courseCode:joi.string().min(2).max(5).required(),
    domain:joi.string(),
    subdomain:joi.string(),
    level:joi.string()
    }
).required()