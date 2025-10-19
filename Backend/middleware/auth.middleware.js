import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        //check token from cookie here
        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            return res.status(401).json({ message: "Unauthorized - No Access Token provided." });
        }

        //if exists, check from userId
    try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.userId). select("-password");
        
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        req.user = user;

        next();
    } catch (error) {
        if(error.name === "TokenAlreadyExpired") {
            return res.status(401).json({ message: "Unauthorized - Access Token expired" });
        }
    }

    } catch (error) {
        console.log("Error in protectRoute middleware", error.message);
        return res.status(401).json({ message: "Unauthorized - Invalid Access Token" });
    }
};

export const adminRoute = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({ message: "Access denied - admins only" });
    }
};