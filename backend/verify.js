import jwt from "jsonwebtoken";
//import { createError } from "./error.js";

// export const verifyToken = (req,res,next) => {
//      const token = req.cookies.access_token
//      if(!token) return next(createError(401,'You aint authenticated'))
//      jwt.verify(token,process.env.JWT,(err,user)=>{
//         if(err) return next(createError(403,'Token not valid'))
//         req.user = user;
//         next()
//      })
// }

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1]; //getting the token
    jwt.verify(token, process.env.JWT, (err, user) => {
      if (err) res.status(403).json("Token is not valid!");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authentittcated!");
  }
};
