const express = require('express');
const { createClient, getClients,getCltDtl,deleteAll,getClientsfilters  } = require('../controller/clientController');
const router = express.Router();

router.post('/client',createClient);
router.get('/clients',getClients);
router.get('/clientsort',getCltDtl);
router.delete('/clientdelete',deleteAll);
router.post('/getclientfilters',getClientsfilters);
module.exports = router;
