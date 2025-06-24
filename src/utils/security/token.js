
import jwt from "jsonwebtoken";

export const generateToken = ({payload, secret_key=process.env.SECRET_JWT, expiresIn="1y"})=>{
    const token = jwt.sign(payload, secret_key, {expiresIn})
    return token;

}

export const verifyToken = ({token, secret_key=process.env.SECRET_JWT})=>{
  try {

    const decoded = jwt.verify(token, secret_key)
    // console.log(decoded);
    
    
    return decoded;
    
  } catch (error) {
    // console.log("JWT Verification Error: ", error);
    throw error
    
  }
    
 
}