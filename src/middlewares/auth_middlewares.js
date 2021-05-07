var createError = require('http-errors');
const jwt=require('jsonwebtoken');
const SubCategory = require('../models/subcategory_model');
const Category = require('../models/category_model');
const Menu = require('../models/menu_model');
const isLoggedIn = async(req,res,next)=>{
    const logginJwtToken=req.header('Authorization').replace("Bearer ", "");
    try {
    if (!logginJwtToken) {
        throw createError(400,"Lütfen önce giriş yapınız!");  
    } 
        const decodedToken=await jwt.verify(logginJwtToken,process.env.CONFIRM_LOGED_JWT_SECRET);
    if(!decodedToken){
        throw createError(400,"Lütfen önce giriş yapınız!!!!!");  
    }
    next();
    } catch (error) {
        if (error.statusCode==400) {
            next(error);
        } else {
            createError(500,'Bir hata oluştu lütfen yeniden giriş yapınız.');
        }
    }
}

const addProductisLogin = async (req,res, next)=>{
    

}


module.exports={
    isLoggedIn,
    addProductisLogin
}