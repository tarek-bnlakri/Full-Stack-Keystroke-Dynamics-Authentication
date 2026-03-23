import jwt from "jsonwebtoken";

export const verifyJWT = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ message: "You are not authenticated" });

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        console.log(payload)
        req.userId = payload.userId;
        req.isAdmin = payload.isAdmin; 
        
        next();
    });
};

export const verifyAdmin = (req, res, next) => {
    if (!req.isAdmin) {
        return res.status(403).json({ message: "Access denied: Admins only" });
    }
    next();
};