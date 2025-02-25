import jwt from "jsonwebtoken";

export const  verifyToken = async (req, res, next) => {
    const token = req.cookies.token;
    try {
        //verify token
        if (!token) {
            return res.status(401).json({success:false, message: "Unauthorized" });
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
if (!decoded) {
    return res.status(401).json({suucess:false, message: "Unauthorized" });
}
//extract userid from the decoded token
req.userId = decoded.userId;
next();

        
    } catch (error) {
        return res.status(401).json({ success:false, message: "Unauthorized" });
        

        
    }

}


