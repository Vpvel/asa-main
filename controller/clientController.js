const asyncHandler = require('express-async-handler');
const Client = require('../models/clientSchema');

const createClient = asyncHandler(async(req, res)=>{
    const {name, amount, email,phone_number,select_type,schemes,paymentId,paymentStatus} = req.body;
 
    const newClient = await Client.create({
        name: name,
        amount: amount,
        email: email,
        phone_number:phone_number,
        select_type:select_type,
        schemes:schemes,
        paymentId:paymentId,
        paymentStatus:paymentStatus
        
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
        limit = parseInt(limit) || 100; // Default: 20 records per page
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

const getclientfilters = asyncHandler(async (req, res) => {
    try {
        const { fromDate, toDate } = req.query; // Expecting 'DD-MM-YYYY' format

        console.log("Received Dates => From:", fromDate, "To:", toDate);

        let filter = {}; // Default filter (empty if no dates are provided)

        if (fromDate && toDate) {
            const [fromDay, fromMonth, fromYear] = fromDate.split("-");
            const [toDay, toMonth, toYear] = toDate.split("-");

            if (!fromDay || !fromMonth || !fromYear || !toDay || !toMonth || !toYear) {
                return res.status(400).json({ message: "Invalid date format. Expected DD-MM-YYYY" });
            }

            // Convert to proper Date format
            const startDate = new Date(`${fromYear}-${fromMonth}-${fromDay}T00:00:00.000Z`);
            const endDate = new Date(`${toYear}-${toMonth}-${toDay}T23:59:59.999Z`);

            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                console.error("❌ Invalid Date Conversion:", { startDate, endDate });
                return res.status(400).json({ message: "Invalid date provided. Expected format: DD-MM-YYYY" });
            }


            console.log("Parsed Start Date:", startDate.toISOString());
            console.log("Parsed End Date:", endDate.toISOString());

            filter.createdAt = { $gte: startDate, $lte: endDate };
        }

        console.log("MongoDB Filter:", JSON.stringify(filter));

        // Fetch records based on filter
        const clients = await Client.find(filter).sort({ createdAt: -1 });

        res.json(clients);
    } catch (error) {
             console.error("Error Fetching Clients:", error);
        next(error); // Pass error to Express error handler
    }
});




module.exports = { createClient, getClients,getCltDtl,deleteAll,getclientfilters}
