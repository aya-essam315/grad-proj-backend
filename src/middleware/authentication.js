import { UserModel } from "../db/models/user.model.js";
import {verifyToken} from "../utils/security/token.js"
import {asyncHandler} from "../utils/errors/async.handler.js"
export const authentication = asyncHandler(
     async(req, res, next)=>{

            // console.log("jkghk");
        
        const {authorization} = req.headers;
        // if(!authorization){
        //     return res.status(401).json({message: "Unauthorized"});
        // }
        // // console.log(authorization);
        
        const [bearer, token] = authorization?.split(' ') || [];
        console.log([bearer, token] );
        if(!bearer || !token){
                 return next(new Error("invalid authorization component.", {cause:401}))
        }
        //  let jwt_sign = "ss"

        //  switch (bearer) {
        //     case "admin":
        //         jwt_sign = process.env.JWT_SECRET_ADMIN
                
        //         break;
        //         case "bearer":
        //             jwt_sign = process.env.JWT_SECRET
        //         break;
        //         default:
        //         jwt_sign = process.env.JWT_SECRET

        // }
        // console.log(jwt_sign);
        // if(bearer!== process.env.BEARER){
        //     // console.log("lll");
            
        //     return res.status(401).json({message: "invalid bearer token"});
        // }
        
        const {id, iat} = verifyToken({token, secret_key:process.env.SECRET_JWT})
        console.log(id, iat);
       
        
        
        if(!id){
           return next(new Error("invalid token.", {cause:401}))
        }
        // console.log(id);

        const user = await UserModel.findById(id)
        // console.log(user);
        if(!user){
                return next(new Error("user not found.", {cause:404}))
        }
           if(user.changePasswordTime >=  iat*1000 || user.isDeleted == true){
            return next(new Error("invalid credintioals .", {cause:400}))
           }
        req.authUser = user
        // console.log(req);
        
        return next()


}
)
