export const authorization = (accessRoles=[])=>{
    return (req, res, next) =>{
        // console.log(req);
        
     try {
           if(!accessRoles.includes(req.authUser.systemRole)){
                  return next(new Error("not authorized.", {cause:403}))
        }
     return   next();
        
     } catch (error) {
        
        
     }
    }
    
}