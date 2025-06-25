import {CourseModel} from "../../db/models/course.model.js"
import { LessonModel } from "../../db/models/lesson.model.js";
import { PlanModel } from "../../db/models/plan.model.js";
import {SyllabusModel} from "../../db/models/syllabus.js"
import { chatBotService } from "../../utils/apiKey/api.key.js";
import { asyncHandler } from "../../utils/errors/async.handler.js";
import { extractJson } from "../../utils/extractContent.js";
import { successResponse } from "../../utils/success/success.response.js";





function cleanText(text) {
  return text
    .replace(/[*\\/]/g, "")     // remove asterisks, slashes, backslashes
    .replace(/\\n/g, " ")       // replace \n with space
    .replace(/\s+/g, " ")       // collapse multiple spaces into one
    .trim();                    // remove leading/trailing spaces
}

export const addCourse = asyncHandler(async(req,res,next)=>{
    const {courseName, courseCode, domain, subdomain, level} = req.body;

    const prompt = `Specify the steps for submitting content
     for a lesson in the [${courseName}] course . Don't write the content,
      just give me the correct order of how the information is presented according
       to the nature of the material. Make the arrangement appropriate to the way
        this subject is taught."
`
    const result = await chatBotService(prompt);
    console.log(result);
    let contentStructure = result.response.candidates[0]?.content?.parts[0]?.text || "";
    contentStructure = cleanText(contentStructure);

    const newCourse = await CourseModel.create({
        courseName,
        courseCode,
        domain,
        subdomain,
        contentStructure,
        createdBy:req.authUser._id
    });
   successResponse({res, message:"Course created successfully", data:newCourse})
    
})



export const deleteCourse = asyncHandler(async(req,res,next)=>{
    const {courseId} = req.params;
    const course = await CourseModel.findByIdAndDelete({_id:courseId,  createdBy: req.authUser._id});
    if(!course) {
        return res.status(404).json({message: "Course not found"});
        }
         successResponse({res, message:"course deleted successfully"})
})



export const getCourse = asyncHandler(async(req,res,next)=>{
    const {courseId} = req.params;
    const course = await CourseModel.findById(courseId).select("courseCode courseName")
    
    if(!course) {
        return res.status(404).json({message: "Course not found"});
        }
    const coursePlan = await PlanModel.findOne({courseId}).select("-createdBy")
    console.log(coursePlan);
     
      successResponse({res, data:{course, coursePlan}})
})


export const getAllCourse = asyncHandler(async(req,res,next)=>{
    let courses = await CourseModel.find().select("-contentStructure")
   
    successResponse({res, message:"done", data:courses})
    

})


export const createSyllabus= asyncHandler(
    async(req,res,next)=>{
    const {courseId} = req.params;
    const course = await CourseModel.findById(courseId);
    if(!course){
        return next(new Error("Course not found", {cause:404}))
        }
    const prompt = `"You are a professional instructor specializing in [${course.subdomain}],
Your task is to create a structured syllabus for the course "[${course.courseName}]" that is suitable for [${course.level}]
 students in the [${course.domain} - ${course.subdomain}] field.
The syllabus should be well-organized, ensuring that the topics are presented in a logical sequence.
 The final syllabus should be comprehensive, structured, and tailored to the specified student level,
  give the output without any Introductions, don't return details about course period  or weeks or grading Breakdown, give always it as topics.
 Return the response in a valid JSON format in form as this:
           "topics": [
                {
                    "main-topic": "Introduction to AI",
                    "subtopics": [
                        subtopics2,
                        subtopics3,
                        subtopics4,
                       subtopics5,
                       subtopics6
                       ...etc
                    ]
                },"`;

 const result = await chatBotService(prompt);
 console.log(result);
 const text = result.response.candidates[0]?.content?.parts[0]?.text || "";
 
 const syllabus = extractJson(text);
//  console.log(syllabus);
 

// await course.updateOne({syllabus})
// await course.save();

  successResponse({res, message:"Syllabus created successfully", data:syllabus})
}

)



export const saveSyllabus = asyncHandler(async (req,res,next)=>{
    const {courseId} = req.params;
    const {syllabus} = req.body;
    if(!syllabus){
        return next(new Error("no syllabus"))
    }
      const course = await CourseModel.findById(courseId);
    if(!course){
       successResponse(new Error("Course not found", {cause:404}))
        }
    // console.log(syllabus);
    const createdSyllabus = await SyllabusModel.create({
        courseId,
        syllabus,
         
        //  createdBy:req.user._id
        }
        );
    successResponse({res, message:"syllabus created successfully", data:createdSyllabus, statusCode:201})

})


export const deleteSyllabus = asyncHandler(async (req,res,next)=>{
    const {courseId} = req.params;
    
    
        const deletedSyllabus = await SyllabusModel.findByIdAndDelete({
              _id: syllabusId,
              createdBy: req.authUser._id
        });
        if(!deletedSyllabus){
            return res.status(404).json({message: "Syllabus not found"});
            }
            successResponse({res, message:"Syllabus deleted successfully"})
        
})



export const getSyllabus = asyncHandler(async (req,res,next)=>{
        const {courseId} = req.params;

        const course = await CourseModel.findById(courseId,{createdBy: req.authUser._id});
    if(!course){
       successResponse(new Error("Course not found", {cause:404}))
        }
        const Syllabus = await SyllabusModel.findOne({
              courseId,
            //   createdBy: req.authUser._id
        });
        if(!Syllabus){
            return next(new Error("no syllabus found"))
            }
            successResponse({res, message:"done", data:Syllabus})
        
})




export const createPlan = asyncHandler(async(req,res,next)=>{
 
        const {courseId} = req.params
        const {numberOfWeeks, lecsPerWeek} = req.body;
        const course = await CourseModel.findById(courseId);
        console.log(course);
        

        if(!course){
            return next(new Error("Course not found", {cause:404}))
            }
        // if(!course.syllabus){
        //     return res.status(404).json({success:false,message: "syllabus not found"});
                
        //     }
            const syllabus = await SyllabusModel.findOne({courseId});
            console.log(syllabus);
            // return
            // res.json(topics)
            if(!syllabus){
                return next(new Error("syllabus not found", {cause:404}))
            }
const prompt = `You are a professional curriculum planner.
Your task is to create a structured and complete teaching plan for the course titled: [${course.courseName}].  
The course syllabus is as follows: [${syllabus}]. Use the **exact subtopics in the same order** as provided.
Generate a teaching plan covering **${numberOfWeeks} weeks**, with a balanced distribution of topics.  
Each week includes **${lecsPerWeek} lectures**. 
### Requirements:
- Follow the syllabus exactly, in the same order.
- For each week, list the **lecture names** and their corresponding **subtopics**.

### Format:
Return the response as **valid JSON**, using the following structure:
json
{
  "teachingPlan": [
    {
      "Week": 1,
      "LectureName": "Lecture Title",
      "Subtopics":
      ["subtopic 1",
       "subtopic 2"
       , "..."],
    
    },
   
  ]
}, lecture and its subtopics must be the same as of the syllabus 
`;

     const result = await chatBotService(prompt);
     console.log(result);
     const text = result.response.candidates[0]?.content?.parts[0]?.text || "";
     const coursePlan = extractJson(text);
    //  console.log(plan);
//  await course.updateOne({coursePlan})
       
    successResponse({res, message:"done", data:coursePlan})

})


export const savePlan = asyncHandler(async (req, res, next) => {
    const { courseId } = req.params;
    console.log( req.params);
    
    const { teachingPlan } = req.body;

    const course = await CourseModel.findById(courseId);
    if (!course) {
        return next(new Error("course not found", {cause:404}))
    }

    // const syllabus = await SyllabusModel.findOne({ courseId });
 

    // if (!syllabus) {
    //     return res.status(404).json({ message: "No syllabus found" });
    // }



    const createdPlan = await PlanModel.create({
        courseId,
        // syllabusId: syllabus._id,
        teachingPlan,
        createdBy: req.authUser._id
    }); 
 
    console.log(createdPlan);

    successResponse({
        res,
        message: "Plan created successfully",
        data: createdPlan,
        statusCode: 201
    });
});















export const deletePlan = asyncHandler(async (req,res,next)=>{
    const {planId} = req.params;
    const plan = await PlanModel.findByIdAndDelete({_id:planId,    createdBy: req.user._id});
    if(!plan){
        return res.status(404).json({message: "Plan not found"});
        }
        successResponse({res, message:"Plan deleted successfully"})
})




export const createLessonContent = asyncHandler(
    async(req,res,next)=>{
 
        const { id } = req.params;
        // console.log(id);
        
        const { week } = req.body;
        
        const course = await CourseModel.findById(id);

        if(!course){
            return res.status(404).json({success:false,message: "Course not found"});
            }
            const plan = await PlanModel.findOne({courseId:id});
            if(!plan){
                return res.status(404).json({success:false,message: "Plan not found"});
                }
     

            const planCoures =await PlanModel.findOne({courseId:id});

            // console.log(planCoures.teachingPlan[week-1]);
            // return

            // const lessonDetails = course.coursePlan.teachingPlan[weekIndex];
            
            
            // if (weekIndex === -1) return res.status(400).send("Week not found");
            // return
            // res.json(topics)
            let structure = course.contentStructure
            console.log(structure);
            if(!structure){
                structure = `suitable structure`
            }
          
            console.log(structure);
            const weekNum = planCoures.teachingPlan[week-1]
            
            const prompt = `You are a professional in writing content
             ,Create detailed and long teaching content
             for the [${course.courseName}] topic in the [${weekNum.Subtopics}]
              subject based on the following structure[${structure}]. 
     Make sure the content is detailed, informative, and provides practical examples when needed. each topic must at least 30 lines,
 Return the response in a valid JSON format 
  `;

     const result = await chatBotService(prompt);
     console.log(result);
     const text = result.response.candidates[0]?.content?.parts[0]?.text || "";
    //  return res.json(JSON.parse(text))
     console.log(text);
     
     
     const lesson = extractJson(text);
     res.json(lesson)



}
)


export const saveLessonContent = asyncHandler(async(req,res,next)=>{
    const id = req.params.id;
    const lesson = req.body;
    const createdLesson = await LessonModel.create({
        courseId:id,
         lesson
    })
    successResponse({
        res,
        message:"Lesson created successfully",
        data:createdLesson
    })
})