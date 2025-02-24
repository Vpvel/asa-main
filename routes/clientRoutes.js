const express = require('express');
const { createClient, getClients  } = require('../controller/clientController');
const router = express.Router();

router.post( '/client', createClient);
router.get( '/clients', getClients);

module.exports = router;