import { connectDB } from "./db/connection.js";
import authRouter from "./modules/auth/auth.controller.js"
import courseRouter from "./modules/course/course.controller.js"
import { globalError } from "./utils/errors/globalerror.js";
import cors from "cors"
export const bootStrap = async(app, express)=>{
    app.use(express.json());
    await connectDB();
    app.use(cors("*"));
    app.use("/auth", authRouter);

    app.use("/course", courseRouter)




    app.all("*", (req,res,next)=>{
        res.status(404).json({
            success: false,
            message: "Page not found"
        })
    })
    //global error 
    app.use(globalError)
}