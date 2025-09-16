

export const isAdmin = async (req, res, next) =>{
    try {
        if (req.user && req.user.role === 'admin'){
            return next()
        }
        return res.status(403).json({
            message:"access denied only admin can access",
            success:false
        })
    } catch (err){
        console.log("Something went to wrong ")
        return res.status(500).json({
            message:"Internal server error",
            success:false
        })
    }
}