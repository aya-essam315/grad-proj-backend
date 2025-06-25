
import { Schema, Types, model } from "mongoose";
import * as systemEnums from "../../utils/global/enums.js"
import { hashData } from "../../utils/security/hash.js";
import {CryptPhone, decryptData} from "../../utils/security/crypto.js"

const userSchema = new Schema({
    firstName:{type:String, required:true},
    lastName:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:function(){
        return this.provider == "system"? true: false;
    }, },
    // provider:{type:String, enum: Object.values(systemEnums.provider)},
    gender:{type:String, enum: Object.values(systemEnums.gender)},
    DOB:{type:Date, max: new Date("2025-01-01")},
    // mobileNumber:{type:String},
    systemRole:{type:String, enum: Object.values(systemEnums.systemRoles), default:"user"},
    role:{type:String, enum: Object.values(systemEnums.roles), },
    isConfirmed:{type:Boolean, default:true},
    deletedAt:{type:Date},
    changeCredentialTime:{type:Date},
    profilePic:{
        secure_url:{type:String}, 
        public_id:{type:String}},
    // course: [{type: Types.ObjectId , ref: 'Course'}],
    //     OTP:[{
    //         code: { type: String },
    //         codeType:{type:String, enum:Object.values(systemEnums.OTPtype) },
    //         expiresAt: { type: Date }
    //     }],
        isDeleted:{type:Boolean , default: false},
        isBanned:{type:Boolean, default: false},
        learningStyle:{type:[String], required:function(){
        return this.role == systemEnums.roles.student
    }, },
    changePasswordTime:{type:Date}
        

},{timestamps:true ,   toJSON:{virtuals:true}, toObject:{virtuals:true}
}
)



userSchema.virtual('userName').get(function() {
 return this.firstName + ' ' + this.lastName;
})




userSchema.pre("save", function(next){
    console.log("hooks runnong now");
    
  //  if(this.provider=="system"){
    console.log("is this a system");
    
    if(this.isModified("password")){
        // console.log("wow this password is already");
        
        this.password = hashData({data:this.password})
        // console.log(hashData({data:this.password}));
        

    }
      
   
    
// }
   
   return next()
})






export const UserModel = model("User", userSchema)