// *** Import Router & Controller Func *** //
import { Router } from "express";
import { authMiddleware } from "../middlewares/Auth.js";
import { transactionMiddleware } from '../middlewares/Transaction.js';
import { createTransaction, getTransactions, top3Transactions, getTransaction, deleteTransaction } from '../controllers/Transcation.js';
// **** Functions **** //
//Initiate Express Router
const router = Router();
/* POST New Transaction */
router.post("/new", authMiddleware, transactionMiddleware, createTransaction);
/* GET All Transactions */
router.get("/transactions/:userId", authMiddleware, getTransactions);
/* GET Top 3 Transactions */
router.get("/top3-transactions/:userId", authMiddleware, top3Transactions);
/* GET Single Transaction */
router.get("/transaction/:id", authMiddleware, getTransaction);
/* DELETE Single Transaction */
router.delete("/transaction/delete/:id", authMiddleware, deleteTransaction);
// **** Export default **** //
export default router;
