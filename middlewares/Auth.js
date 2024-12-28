import HttpStatusCodes from "../constants/HttpStatusCodes.js";
// (DESC) Check if User Is Authenticated
async function authMiddleware(req, res, next) {
    if (req.session) {
        next();
    }
    else {
        res.status(HttpStatusCodes.UNAUTHORIZED).json({ status: "Error", message: "Session Null or Expired" });
    }
}
export { authMiddleware };
