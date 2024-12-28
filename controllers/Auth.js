import HttpStatusCodes from "../constants/HttpStatusCodes.js";
import UserModel from '../models/User.js';
import bcrypt from "bcrypt";
//(DESC) Create New User
async function createUser(req, res, next) {
    // Destructure Request Body and explicitly type it
    const { name, email, password } = req.body;
    // Extract IP address from the request
    const userAgent = req.headers["user-agent"] || "unknown";
    let ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
    // If x-forwarded-for is an array, use the first IP address in the list
    if (Array.isArray(ipAddress)) {
        ipAddress = ipAddress[0];
    }
    // Check if User Exists
    try {
        const existingUser = await UserModel.findOne({ where: { email } });
        if (existingUser) {
            res.status(HttpStatusCodes.BAD_REQUEST).json({ message: 'Email already exists!' });
        }
        //Hash Password Using Bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Create New User
        const user = await UserModel.create({ name, email, password: hashedPassword, ipAddress, userAgent });
        res.status(HttpStatusCodes.CREATED).json({ message: 'User Registered successfully', user });
    }
    catch (error) {
        console.error("Error Registering User", error);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
        next(error);
    }
}
// (DESC) Login User
async function loginUser(req, res, next) {
    // Destructure req.body and Explicitly Type
    const { email, password } = req.body;
    try {
        // Find if Existing User Exists
        const user = await UserModel.findOne({ where: { email } });
        // If Not found(404)
        if (!user) {
            res.status(HttpStatusCodes.NOT_FOUND).json({ status: 'Error', message: 'User Not Found.!' });
            return;
        }
        // Compare user Password & hash it
        const isPasswordValid = await bcrypt.compare(password, user.password);
        // If Password is Not Valid
        if (!isPasswordValid) {
            res.status(HttpStatusCodes.BAD_REQUEST).json({ status: 'Error', message: 'Invalid Email or Password.!' });
            return;
        }
        // Capture User-Agent and IP Address
        const userAgent = req.headers["user-agent"] || "unknown";
        let ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
        // If x-forwarded-for is an array, use the first IP address in the list
        if (Array.isArray(ipAddress)) {
            ipAddress = ipAddress[0];
        }
        // Update User's IP Address and User-Agent
        user.ipAddress = ipAddress;
        user.userAgent = userAgent;
        await user.save();
        // Store user Id in session safely
        req.session.userId = user.id.toString(); // Convert user ID to a string
        // Save session info
        req.session.save((error) => {
            if (error) {
                return next(error); // Handle session save error
            }
            res.status(HttpStatusCodes.OK)
                .json({
                status: 'Success', message: 'Logged in successfully',
                user, sessionID: req.sessionID
            });
        });
    }
    catch (error) {
        console.error("Error Logging In", error);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
        next(error);
    }
}
// (DESC) Controller Logic to Fetch Session Info
async function getSessionInfo(req, res) {
    // Extract if from req.params
    const { id } = req.params;
    // if no id
    if (!id) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({ Status: "Error", Message: "Invalid Or No Id Found" });
        return;
    }
    try {
        // Check if user with that Given id Exists
        const user = await UserModel.findAll({ where: { id: id }, order: [['updatedAt', 'DESC']] });
        if (!user) {
            res.status(HttpStatusCodes.NOT_FOUND).json({ Status: 'Error', Message: "User Not Found!" });
            return;
        }
        else {
            // If user is found, return user data and session info
            res.status(HttpStatusCodes.OK).json({
                status: 'Success',
                user,
                sessionID: req.sessionID
            });
        }
    }
    catch (error) {
        console.error("Error fetching session info:", error);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Error',
            message: 'Internal Server Error',
        });
    }
}
// (DESC) Logout User
async function logoutUser(req, res, next) {
    // Destroy user Sessions
    req.session.destroy((error => {
        if (error) {
            console.error('Error destroying session:', error);
            return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ status: "Error", Message: "Error logging out" });
        }
        // Clear the session cookie
        res.clearCookie('connect.sid', { path: '/' });
        res.status(HttpStatusCodes.OK).json({ status: "Success", Message: "Logout successfully" });
    }));
}
export { createUser, loginUser, getSessionInfo, logoutUser };
