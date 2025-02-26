const asyncHandler = require('express-async-handler');
const Client = require('../models/clientSchema');

const createClient = asyncHandler(async(req, res)=>{
    const {name, amount, email,phone_number,select_type,date,schemes,paymentId} = req.body;
 
    const newClient = await Client.create({
        name: name,
        amount: amount,
        email: email,
        phone_number:phone_number,
        select_type:select_type,
        date:date,
        schemes:schemes,
        paymentId:paymentId,
    });
    if(newClient){
        res.status(200).json({_id: newClient.id, name: newClient.name})
    }else{
        res.status(400);
        throw new Error('Client data is not valid')
    }
});

const getClients = asyncHandler(async(req, res)=>{
    try {
        const clients = await Client.find();
        res.json(clients);
    } catch (error) {
        console.log("Error Fetching Clients", error);
        res.status(500).json({message: 'Server Error'})
    }
});


const getCltDtl = asyncHandler(async (req, res) => {
    try {
        let { page, limit, sortBy, sortOrder } = req.query;

        // Default values if parameters are not provided
        page = parseInt(page) || 1; // Default: Page 1
        limit = parseInt(limit) || 20; // Default: 20 records per page
        sortBy = sortBy || 'createdAt'; // Default sorting field is 'createdAt'
        sortOrder = sortOrder === 'desc' ? -1 : 1; // Default: ascending order

        const skip = (page - 1) * limit; // Calculate how many records to skip

        // Fetch clients with sorting, skipping, and limiting records
        const clients = await Client.find()
            .sort({ [sortBy]: sortOrder }) // Dynamic sorting
            .skip(skip) // Skip records for pagination
            .limit(limit); // Limit the number of results

        res.json(clients);
    } catch (error) {
        console.log("Error Fetching Clients", error);
        res.status(500).json({ message: 'Server Error' });
    }
});


const deleteAll = asyncHandler(async (req, res) => {
    try {
        const result = await Client.deleteMany({}); // Deletes all clients

        res.json({ message: `${result.deletedCount} clients deleted successfully` });
    } catch (error) {
        console.log("Error Deleting Clients", error);
        res.status(500).json({ message: "Server Error" });
    }
});




module.exports = { createClient, getClients,getCltDtl,deleteAll}
