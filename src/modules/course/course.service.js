import { ActivityModel } from "../../db/models/activitis.js";
import { AssignmentModel } from "../../db/models/assignment.js";
import { CourseModel } from "../../db/models/course.model.js";
import { ExamModel } from "../../db/models/exam.js";
import { LessonModel } from "../../db/models/lesson.model.js";
import { PlanModel } from "../../db/models/plan.model.js";
import { SyllabusModel } from "../../db/models/syllabus.js";
import { chatBotService } from "../../utils/apiKey/api.key.js";
import { asyncHandler } from "../../utils/errors/async.handler.js";
import { extractJson } from "../../utils/extractContent.js";
import { successResponse } from "../../utils/success/success.response.js";

function cleanText(text) {
  return text
    .replace(/[*\\/]/g, "") // remove asterisks, slashes, backslashes
    .replace(/\\n/g, " ") // replace \n with space
    .replace(/\s+/g, " ") // collapse multiple spaces into one
    .trim(); // remove leading/trailing spaces
}

export const addCourse = asyncHandler(async (req, res, next) => {
  const { courseName, courseCode, domain, subdomain, level } = req.body;

  const prompt = `Specify the steps for submitting content
     for a lesson in the [${courseName}] course . Don't write the content,
      just give me the correct order of how the information is presented according
       to the nature of the material. Make the arrangement appropriate to the way
        this subject is taught."
`;
  const result = await chatBotService(prompt);
  console.log(result);
  let contentStructure =
    result.response.candidates[0]?.content?.parts[0]?.text || "";
  contentStructure = cleanText(contentStructure);

  const newCourse = await CourseModel.create({
    courseName,
    courseCode,
    domain,
    subdomain,
    contentStructure,
    createdBy: req.authUser._id,
    level,
  });
  successResponse({
    res,
    message: "Course created successfully",
    data: newCourse,
  });
});

export const deleteCourse = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  const course = await CourseModel.findByIdAndDelete({
    _id: courseId,
    createdBy: req.authUser._id,
  });
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }
  successResponse({ res, message: "course deleted successfully" });
});

export const getCourse = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  const course = await CourseModel.findById(courseId).select(
    "-contentStructure"
  );
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }
  successResponse({ res, message: "done", data: course });
});

export const getAllCourse = asyncHandler(async (req, res, next) => {
  let courses = await CourseModel.find().select("-contentStructure");

  successResponse({ res, message: "done", data: courses });
});

export const createSyllabus = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  const course = await CourseModel.findById(courseId);
  if (!course) {
    return next(new Error("Course not found", { cause: 404 }));
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

  successResponse({
    res,
    message: "Syllabus created successfully",
    data: syllabus,
  });
});

export const saveSyllabus = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  const { syllabus } = req.body;
  if (!syllabus) {
    return next(new Error("no syllabus"));
  }
  const course = await CourseModel.findById(courseId);
  if (!course) {
    successResponse(new Error("Course not found", { cause: 404 }));
  }
  // console.log(syllabus);
  const createdSyllabus = await SyllabusModel.create({
    courseId,
    syllabus,

    //  createdBy:req.user._id
  });
  successResponse({
    res,
    message: "syllabus created successfully",
    data: createdSyllabus,
    statusCode: 201,
  });
});

export const deleteSyllabus = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;

  const deletedSyllabus = await SyllabusModel.findByIdAndDelete({
    _id: syllabusId,
    createdBy: req.authUser._id,
  });
  if (!deletedSyllabus) {
    return res.status(404).json({ message: "Syllabus not found" });
  }
  successResponse({ res, message: "Syllabus deleted successfully" });
});

export const getSyllabus = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;

  const course = await CourseModel.findById(courseId, {
    createdBy: req.authUser._id,
  });
  if (!course) {
    successResponse(new Error("Course not found", { cause: 404 }));
  }
  const Syllabus = await SyllabusModel.findOne({
    courseId,
    //   createdBy: req.authUser._id
  });
  if (!Syllabus) {
    return next(new Error("no syllabus found"));
  }
  successResponse({ res, message: "done", data: Syllabus });
});

export const createPlan = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  const { numberOfWeeks, lecsPerWeek } = req.body;
  const course = await CourseModel.findById(courseId);
  console.log(course);

  if (!course) {
    return next(new Error("Course not found", { cause: 404 }));
  }
  // if(!course.syllabus){
  //     return res.status(404).json({success:false,message: "syllabus not found"});

  //     }
  const syllabus = await SyllabusModel.findOne({ courseId });
  console.log(syllabus);
  // return
  // res.json(topics)
  if (!syllabus) {
    return next(new Error("syllabus not found", { cause: 404 }));
  }
  const prompt = `You are a professional curriculum planner.
>>>>>>> eac5c93e1ade6a895f73a1f1cc6f426b84c90af2
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
  //   console.log(result);
  const text = result.response.candidates[0]?.content?.parts[0]?.text || "";
  const coursePlan = extractJson(text);
  console.log(coursePlan);
  //  await course.updateOne({coursePlan})

  successResponse({ res, message: "done", data: coursePlan });
});

export const savePlan = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  console.log(req.params);

  const { teachingPlan } = req.body;

  const course = await CourseModel.findById(courseId);
  if (!course) {
    return next(new Error("course not found", { cause: 404 }));
  }

  // const syllabus = await SyllabusModel.findOne({ courseId });

  const createdPlan = await PlanModel.create({
    courseId,
    // syllabusId: syllabus._id,
    teachingPlan,
    createdBy: req.authUser._id,
  });

  console.log(createdPlan);

  successResponse({
    res,
    message: "Plan created successfully",
    data: createdPlan,
    statusCode: 201,
  });
});

export const getCoursePlan = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;

  const course = await CourseModel.findById(courseId);
  if (!course) {
    return next(new Error("Course not found", { cause: 404 }));
  }
  const plan = await PlanModel.findOne({ courseId });
  if (!plan) {
    return res.status(404).json({ message: "No plan found" });
  }
  successResponse({
    res,
    data: plan,
    statusCode: 200,
  });
});

export const deletePlan = asyncHandler(async (req, res, next) => {
  const { planId } = req.params;
  const plan = await PlanModel.findByIdAndDelete({
    _id: planId,
    createdBy: req.user._id,
  });
  if (!plan) {
    return res.status(404).json({ message: "Plan not found" });
  }
  successResponse({ res, message: "Plan deleted successfully" });
});

export const createLessonContent = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  //  const week = req.query.week;
  // if (week === -1) return res.status(400).send("Week not found");
  const { LectureName, Subtopics = [] } = req.body;

  const course = await CourseModel.findById(courseId);

  if (!course) {
    return next(new Error("course not found", { cause: 404 }));
  }
  const plan = await PlanModel.findOne({ courseId });
  if (!plan) {
    return res.status(404).json({ success: false, message: "Plan not found" });
  }

  // console.log(plan.teachingPlan[week-1]);

  // return

  // const lecWeek = plan.teachingPlan[week-1];
  // const LectureName =lecWeek.LectureName;
  // const Subtopics = lecWeek.Subtopics;

  let structure = course.contentStructure;

            if(!structure){
                structure = `suitable structure`
            }
            
            const prompt =  `You are a professional in writing content
             ,Create detailed and long teaching content
             for the [${LectureName}] topic in the [${Subtopics}]
            subject based on the following structure[${structure}]. 
            Make sure the content is detailed, informative, and provides practical examples when needed.
            each subtopic topic must at least 30 lines,
           
  `;

     const result = await chatBotService(prompt);
     console.log(result);
     const content = result.response.candidates[0]?.content?.parts[0]?.text || "";
  const createdLesson = await LessonModel.create({
        courseId,
         content,
         createdBy:req.authUser._id
    })
     successResponse({res, data:createdLesson})
}
)


export const saveLessonContent = asyncHandler(async(req,res,next)=>{
    const {courseId, lessonId} = req.params;
    const {content} = req.body;
  
  const updatedLesson = await LessonModel.findByIdAndUpdate(lessonId,{content}, {new: true});
    successResponse({
        res,
        message:"Lesson updated successfully",
        data:updatedLesson
    })
})

export const getContent = asyncHandler(async (req, res, next) => {
  const { courseId, lessonId } = req.params;
  const course = await CourseModel.findById(courseId);
  if (!course) {
    return next(new ErrorResponse("Course not found", 404));
  }

  const lesson = await LessonModel.findById(lessonId).select("content");
  if (!lesson) {
    return next(new ErrorResponse("Lesson not found", 404));
  }
  successResponse({
    res,
    data: lesson,
  });
});

export const createAssignment = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  //  const week = req.query.week;
  // if (week === -1) return res.status(400).send("Week not found");
  const { LectureName, Subtopics = [] } = req.body;

  const course = await CourseModel.findById(courseId);

  if (!course) {
    return next(new Error("course not found", { cause: 404 }));
  }
  // const plan = await PlanModel.findOne({courseId});
  // if(!plan){
  //     return res.status(404).json({success:false,message: "Plan not found"});
  //     }

  // console.log(plan.teachingPlan[week-1]);

  // return

  // const lecWeek = plan.teachingPlan[week-1];
  // const LectureName =lecWeek.LectureName;
  // const Subtopics = lecWeek.Subtopics;

  const prompt = `for ${LectureName} Based on the following topics: [${Subtopics}],
             create an Assignment,
             Display the questions in an organized manner
             Make sure that the output is clear and easy to read,
             without metadata or difficulty indicators in the questions,
             and without answers, Return the response as valid JSON as like this example:
             {
            title: "lecture name",
            questions: [
                { id: 1, question..." },
                { id: 2, question... } and so on
                       ]}`;

  const result = await chatBotService(prompt);
  console.log(result);
  const text = result.response.candidates[0]?.content?.parts[0]?.text || "";
  //  return res.json(JSON.parse(text))
  //  console.log(text);

  const assignment = extractJson(text);
  successResponse({ res, data: assignment });
});

export const saveAssignment = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  const { assignment } = req.body;
  const course = await CourseModel.findById(courseId);
  if (!course) {
    return next(new Error("course not found", { cause: 404 }));
  }
  const createdAssignment = await AssignmentModel.create({
    courseId,
    assignment,
  });
  successResponse({ res, data: createdAssignment });
});

export const getAssignment = asyncHandler(async (req, res, next) => {
  const { courseId, assignmentId } = req.params;
  const course = await CourseModel.findById(courseId);
  if (!course) {
    return next(new Error("course not found", { cause: 404 }));
  }
  const assignment = await AssignmentModel.findOne({ courseId });
  successResponse({ res, data: assignment });
});

//crud exam

export const createExam = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  const { LectureNames = [], Subtopics = [] } = req.body;

  console.log(courseId);

  const {
    numOfQuestions,
    easy,
    median,
    hard,
    score,
    allowedTime,
    questionType = [],
  } = req.body;
  console.log({
    numOfQuestions,
    easy,
    median,
    hard,
    score,
    allowedTime,
    questionType,
  });

  const course = await CourseModel.findById(courseId);
  if (!course) {
    return res
      .status(404)
      .json({ success: false, message: "Course not found" });
  }
  const level = course.level;
  // const plan = await PlanModel.find({courseId});
  // console.log(plan);

  // const prompt = `Based on the following topics ${Subtopics} for ${level}:
  //     [subtopics], create an Exam with [${numOfQuestions}] questions
  //     divided into [${easy}]% easy, [${median}]% medium, and [${hard}]% hard.
  //     Include [${questionType}] questions.
  //     The total score should be [${score}], distributed according to difficulty levels.
  //     The exam should be designed to fit within a time limit of [${allowedTime}] mins,
  //     ensuring that the questions are appropriate for the given time.
  //     Some questions should require longer answers, while others should be shorter to align with the overall time limit.
  //     Display the questions in an organized manner with scores next to each one.
  //     Make sure the output is clear and easy to read, without metadata or difficulty indicators in the questions,
  //     and without answers, Return the response as valid JSON`;

  const prompt = `Based on the following topics: ${Subtopics} for ${level} level,

Generate an exam with exactly ${numOfQuestions} questions, distributed as:
- ${easy}% easy
- ${median}% medium
- ${hard}% hard

Include only the following types of questions: ${questionType}.

Ensure:
- Total score is ${score}, distributed across all questions.
- Time limit is ${allowedTime} minutes.
- Mix of short and long questions to fit the time.
- All questions must be appropriate to the level and topic.

🛑 Return the output strictly as valid JSON only, with this exact structure:

{
  "questions": [
    {
      "id": 1,
      "type": "MCQ",
      "score": 10,
      "question": "Which of the following is a valid variable name in most programming languages?",
      "options": [
        "2variables",
        "my-variable",
        "my_variable",
        "if"
      ]
    }
    // More questions with same format
  ]
}

✅ Do not include any extra text, metadata, explanation, or formatting around the JSON.
❌ Do not include answers or indicate difficulty level inside questions.
✅ Use the exact field names: "id", "type", "score", "question", "options" (only for MCQ).
`;

  const result = await chatBotService(prompt);
  console.log(result);
  const text = result.response.candidates[0]?.content?.parts[0]?.text || "";
  //  return res.json(JSON.parse(text))
  //  console.log(text);

  const assignment = extractJson(text);
  successResponse({ res, data: assignment });
});

export const saveExam = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  const { exam } = req.body;
  console.log(exam);

  const course = await CourseModel.findById(courseId);
  if (!course) {
    return res
      .status(404)
      .json({ success: false, message: "Course not found" });
  }

  const createdExam = await ExamModel.create({
    courseId,
    exam,
    createdBy: req.authUser._id,
  });
  successResponse({ res, data: createdExam });
});

export const getExam = asyncHandler(async (req, res, next) => {
  const { examId } = req.params;
  const exam = await ExamModel.findById(examId);
  if (!exam) {
    return next(new Error("no exam found"));
  }
  successResponse({ res, data: exam });
});

export const deleteExam = asyncHandler(async (req, res, next) => {
  const { courseId, examId } = req.params;
  const exam = await ExamModel.findOneAndDelete({
    _id: examId,
    createdBy: req.authUser._id,
  });
  if (!exam) {
    return next(new Error("no exam found"));
  }
  successResponse({ res, message: "exam deleted successfully" });
});

//activities
export const createActivity = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  const { activity } = req.body;
  console.log(activity);
  const course = await CourseModel.findById(courseId);
  if (!course) {
    return res
      .status(404)
      .json({ success: false, message: "Course not found" });
  }
  const plan = await PlanModel.find({ courseId });

  const prompt = `Create a list of max(5) hands-on projects to teach students
     through project-based learning. Covering [${course.courseName}] and syllabus by
      [${plan}]. Projects should align with course skills [e.g. use of research tools,
       programming, problem solving, presentation skills].
        Ensure that projects cover all aspects of the course content and meet the learning objectives.
         Each project should have a brief description (maximum 3 sentences).Return the response as valid JSON
         as like: {
        "projects": [
            {
                "name": "activity name",
                "description": "disription of activity",
                }]}
`;

  const result = await chatBotService(prompt);
  console.log(result);
  const text = result.response.candidates[0]?.content?.parts[0]?.text || "";
  //  return res.json(JSON.parse(text))
  //  console.log(text);

  const activities = extractJson(text);
  successResponse({ res, data: activities });
});

export const saveActivitis = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  const { activities } = req.body;
  const course = await CourseModel.findById(courseId);
  if (!course) {
    return res
      .status(404)
      .json({ success: false, message: "Course not found" });
  }
  const createdActivities = await ActivityModel.create({
    courseId,
    activities,
  });
  successResponse({ res, data: createdActivities });
});
