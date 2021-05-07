const errCatcher = (err,req,res,next)=>{
    res.json({statusCode:err.statusCode,message:err.message});
}

module.exports=errCatcher;