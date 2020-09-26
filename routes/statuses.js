// Setup router, StatusSchema, and token verification
const express = require('express');
const router = express.Router();
const path = require('path');
const Status = require('../models/Status');
const { verifyAccessToken, verifyRefreshToken } = require('../verifyToken');

// Get all statuses
router.get('/', async (req,res) => {
    try{
        const statuses = await Status.find().limit(100).sort({createdAt: 'descending'});
        res.json(statuses);
    }catch(err){ // Send error
        res.status(500).json(err);
    }
});

// Send a status
router.post('/', verifyAccessToken, async (req,res) => {
    // Create new status object
    const status = new Status({
        user: req.user.username,
        status: req.body
    });
    // Save status to DB
    try{
        const savedStatus = await status.save()
        res.json(savedStatus);
    }catch(err){ // Send error
        res.status(500).json(err);
    }
});

// Specific status page
router.get('/:statusId', async (req,res) => {
    res.sendFile(path.join(__dirname,'../public','status.html'));
});

// Get a specific status
router.get('/:statusId/data', async (req,res) => {
    try{
        const status = await Status.findById(req.params.statusId);
        res.json(status);
    }catch(err){ // Send error
        res.json({error: '404 Not Found', message: 'No entry found'});
    }
});

// Delete a specific status
router.delete('/:statusId', verifyAccessToken, async (req,res) => {
    try{
        const removedStatus = await Status.deleteOne({_id: req.params.statusId});
        res.json(removedStatus);
    }catch(err){ // Send error
        res.json({error: '404 Not Found', message: 'No entry found'});
    }
});

// Update a specific status
router.patch('/:statusId', verifyAccessToken, async (req,res) => {
    try{
        const patchedStatus = await Status.updateOne({_id: req.params.statusId},{$set: {status: req.body.status}});
        res.json(patchedStatus);
    }catch(err){ // Send error
        res.json({error: '404 Not Found', message: 'No entry found'});
    }
});

// Export router
module.exports = router;