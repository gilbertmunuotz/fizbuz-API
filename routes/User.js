// *** Import Router & Controller Func *** //
import { Router } from "express";
import { UserMiddleware } from "../middlewares/User.js";
import { getUserInfo, updateUser } from "../controllers/User.js";
// **** Functions **** //
//Initiate Express Router
const router = Router();
/* GET User Details */
router.get("/user/:id", getUserInfo);
/* POST Update User Details */
router.post("/user/update/", UserMiddleware, updateUser);
// **** Export default **** //
export default router;
