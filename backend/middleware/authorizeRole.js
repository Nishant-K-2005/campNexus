const authorizeRole = (...allowedRoles) => {
    return (req,res,next)=>{
        if(!req.user || !allowedRoles.includes(req.user.role)){
            return res.status(403).json({error:`Role Auhtorization error: ${req.user.role} is not allowed to acess this`})
        }
        next();
    }
}