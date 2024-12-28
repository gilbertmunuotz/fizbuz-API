import HttpStatusCodes from "../constants/HttpStatusCodes.js";
import TransactionModel from "../models/Transactions.js";
//(DESC) Create New Transaction
async function createTransaction(req, res, next) {
    // Destructure Request Body and explicitly type it
    const { name, amount, type, userId } = req.body;
    if (!userId) {
        // Respond with an error if the user ID is missing
        res.status(HttpStatusCodes.UNAUTHORIZED).json({ status: "Error", Message: "Invalid User Id" });
        return;
    }
    try {
        // Attempt to create a new transaction
        const Transaction = await TransactionModel.create({ name, amount, type, userId });
        // Send success response
        res.status(HttpStatusCodes.CREATED).json({ status: 'Success', message: 'Transaction Created Successfully', Transaction });
        return; // Immediately return to stop further execution in this function
    }
    catch (error) {
        // Handle errors and send error response
        console.error('An Error Occurred, Please Try Again Later', error);
        // Send error response and return to prevent further code execution
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Error',
            message: 'An Error Occurred, Please Try Again Later'
        });
        return; // Immediately return to stop further execution in this function
    }
}
//(DESC) Get All Transactions
async function getTransactions(req, res, next) {
    // Destructure Request Params and explicitly type it
    const { userId } = req.params;
    if (!userId) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({ Status: "Error", Message: "Invalid Or No Id Found" });
        return;
    }
    try {
        const transactions = await TransactionModel.findAll({ where: { userId: userId }, order: [['createdAt', 'DESC']] });
        if (transactions.length === 0) {
            res.status(HttpStatusCodes.NOT_FOUND).json({ Status: 'Error', Message: "Transaction Not Found" });
            return;
        }
        else {
            res.status(HttpStatusCodes.OK).json({ Status: "Success", transactions });
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
//(DESC) Get Top 3 Transactions
async function top3Transactions(req, res, next) {
    // Destructure Request Params and explicitly type it
    const { userId } = req.params;
    if (!userId) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({ Status: "Error", Message: "Invalid Or No Id Found" });
        return;
    }
    try {
        const transactions = await TransactionModel.findAll({
            where: { userId: userId }, order: [['createdAt', 'DESC']], limit: 3
        });
        if (!transactions) {
            res.status(HttpStatusCodes.NOT_FOUND).json({ Status: 'Error', Message: "Transaction Not Available" });
            return;
        }
        else {
            res.status(HttpStatusCodes.OK).json({ Status: "Success", transactions });
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
//(DESC) Get Single Transaction (HAITUMIKI KWA SASA)
async function getTransaction(req, res, next) {
    // Destructure id from params
    const { id } = req.params;
    // Check if `id` is available
    if (!id) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({ Status: "Error", Message: "Transaction ID is required" });
        return;
    }
    // Get userId from session
    const userId = req.session.userId;
    try {
        const transaction = await TransactionModel.findOne({ where: { id: id, userId: userId } });
        if (!transaction) {
            res.status(HttpStatusCodes.NOT_FOUND).json({ Status: 'Error', Message: "Transaction Not Found" });
        }
        else {
            res.status(HttpStatusCodes.OK).json({ Status: "Success", transaction });
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
//(DESC) Delete Single Transaction
async function deleteTransaction(req, res, next) {
    // Destructure id from params
    const { id } = req.params;
    if (!id) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({ Status: "Error", Message: "Invalid ID or User not authenticated" });
        return;
    }
    try {
        const deletedTransactionCount = await TransactionModel.destroy({ where: { id: id } });
        // Check if the transaction was deleted
        if (deletedTransactionCount === 0) {
            res.status(HttpStatusCodes.NOT_FOUND).json({ Status: 'Error', Message: "Transaction Not Found" });
            return;
        }
        // If the transaction was deleted successfully
        res.status(HttpStatusCodes.OK).json({ Status: "Success", Message: "Transaction Deleted Successfully" });
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
export { createTransaction, getTransactions, top3Transactions, getTransaction, deleteTransaction };
