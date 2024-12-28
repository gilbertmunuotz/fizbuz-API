import HttpStatusCodes from "../constants/HttpStatusCodes.js";
import UserModel from '../models/User.js';
import bcrypt from "bcrypt";
//(DESC) Get User Info
async function getUserInfo(req, res, next) {
    // Destructure Request Params 
    const { id } = req.params;
    if (!id) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({ Status: "Error", Message: "Invalid Or No Id Found" });
        return;
    }
    try {
        const user = await UserModel.findOne({ where: { id: id } });
        if (!user) {
            res.status(HttpStatusCodes.NOT_FOUND).json({ Status: 'Error', Message: "User Not Found" });
            return;
        }
        else {
            res.status(HttpStatusCodes.OK).json({ user });
        }
    }
    catch (error) {
        // Log the error and pass it to the next middleware
        console.error('An Error Occurred, Please Try Again Later', error);
        // Send error response and call next() to pass the error to the error-handling middleware
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'An Error Occurred, Please Try Again Later'
        });
        next(error);
    }
}
//(DESC) Update User Info
async function updateUser(req, res, next) {
    // Destructure req.body and explicitly type it
    const { id, name, email, password } = req.body;
    // Check if id exists
    if (!id) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({ Status: "Error", Message: "Invalid Or No Id Found" });
    }
    try {
        // If id is present, check if User exists
        const existingUser = await UserModel.findByPk(id);
        if (!existingUser) {
            res.status(HttpStatusCodes.NOT_FOUND).json({ status: 'error', message: 'User Not Found' });
        }
        // Proceeding. with update logic 
        // Initialize update logic that compares existingUser and newUser (only non-null values)
        let newUser = {
            name: name || existingUser?.name,
            email: email || existingUser?.email,
        };
        // Check if a new password is provided and hash it
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            newUser.password = hashedPassword;
        }
        // Finally Update the user with the new data
        const [user] = await UserModel.update(newUser, { where: { id: id } });
        // Check if any row was updated
        if (user === 0) {
            res.status(HttpStatusCodes.NOT_FOUND).json({ status: 'error', message: 'User Not Updated' });
        }
        res.status(HttpStatusCodes.OK).json({ status: 'success', message: 'User Updated' });
    }
    catch (error) {
        console.error('An Error Occurred, Please Try Again Later', error);
        // Send error response and return to prevent further processing
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ status: 'error', message: 'An Error Occurred, Please Try Again Later' });
    }
}
export { getUserInfo, updateUser };
