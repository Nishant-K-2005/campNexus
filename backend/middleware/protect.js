import prisma from "../config/dbConnection.js"
import jwt from "jsonwebtoken"

const protect = async (req,res,next) => {
    try{
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({error: "Unauthorized: no token provided"});
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        if(!decoded || !decoded.userId){
            return res.status(401).json({error:"Unauthorized: Invalid token"});
        }
        const user = await prisma.user.findUnique({
            where:{
                user_id:decoded.userId,
            },
            select:{
                user_id:true,
                email:true,
                full_name:true,
                role:true,
                reputation_points:true,
                profile: true,
            },
        })
        if(!user){
            return res.status(404).json({error:"user not found"})
        }
        req.user = user;
        req.profile = user.profile
        next();
    }catch(err){
        console.log("Auth middleware error: ",err.message);

        if (err.name === "TokenExpiredError") {
             return res.status(401).json({ error: "Unauthorized: Token expired" });
        }
        if (err.name === "JsonWebTokenError") {
             return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }

        res.status(500).json({error:"Something went wrong"});
    }
}

export default protect