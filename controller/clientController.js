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

const getClientsFilters = asyncHandler(async (req, res) => {
    try {
        const { fromDate, toDate } = req.query; // Expecting 'DD-MM-YYYY' format
        let filter = {}; // Default filter (empty if no dates are provided)

        // Regular expression to validate 'DD-MM-YYYY' format
        const dateRegex = /^\d{2}-\d{2}-\d{4}$/;

        // Function to parse and validate date
        const parseDate = (dateStr, isStart) => {
            if (!dateStr || !dateRegex.test(dateStr)) {
                throw new Error(`Invalid date format: ${dateStr}. Expected format: DD-MM-YYYY`);
            }

            const [day, month, year] = dateStr.split("-");
            const parsedDate = new Date(`${year}-${month}-${day}T${isStart ? "00:00:00.000Z" : "23:59:59.999Z"}`);

            if (isNaN(parsedDate.getTime())) {
                throw new Error(`Invalid date value: ${dateStr}`);
            }

            return parsedDate;
        };

        // Apply date filters if provided
        try {
            if (fromDate) filter.createdAt = { $gte: parseDate(fromDate, true) };
            if (toDate) filter.createdAt = { ...filter.createdAt, $lte: parseDate(toDate, false) };

            console.log("Date Filter Applied:", filter); // Debugging log

                    // Fetch clients with applied filters
        const clients = await Client.find(filter).sort({ createdAt: -1 }); // Descending order
        res.json(clients);
            
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }

    } catch (error) {
        console.error("Error Fetching Clients:", error);
        res.status(500).json({ message: "Server Error" });
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




module.exports = { createClient, getClients,getCltDtl,deleteAll,getClientsfilters}
