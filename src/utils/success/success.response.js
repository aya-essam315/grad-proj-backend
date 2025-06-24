
export const successResponse = ({res,message="done",statusCode=200, data={}}) =>{
    return res.status(statusCode).json({
        success:true,
        message,
        data
    })
}