const EErrors = require('../../services/error/enum.js');


const errorHandler = async  (error,req,res,next)=>{
    error.code?
    console.log(`\n${error.name}\n\nError code:${error.code}\n\n${error.cause}`)
    :
    console.log("unhandled error")
    
    switch(error.code){
        case EErrors.INVALID_TYPES_ERROR:
            res.send({status: "error", error: error.name})
    break;
    default:
    res.send({status: "error",error: "unhandled error"});
    }  
}

module.exports = errorHandler;