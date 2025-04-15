const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/:filename', (req, res) => {
    const filePath = path.join(__dirname, '../../snapshots', req.params.filename);
    console.log(`Serving snapshot: ${filePath}`);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.warn(`Snapshot not found: ${filePath}`);
            res.status(404).json({ error: 'Snapshot not found' });
        }
    });
});

module.exports = router;