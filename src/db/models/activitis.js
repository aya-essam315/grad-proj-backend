
import { Schema, model , Types} from "mongoose";


const activityShema = new Schema({
     courseId: {type: Types.ObjectId, ref:"Course"},
     // createdBy:{type:Types.ObjectId, ref:"User"},
}, {strict:false,timestamps:true})




export const ActivityModel = model("Activity", activityShema);