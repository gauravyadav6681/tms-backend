const express = require('express');
const Tender = require('../models/Tender');
const { QueryTypes } = require('sequelize');
const sequelize = require('../config/db');
const Bid = require('../models/Bid');
const router = express.Router();

// Create a new tender
router.post('/tenders', async (req, res) => {
    try {
        const newTender = await Tender.create(req.body);
        res.status(201).json(newTender);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all tenders
router.get('/gettenders', async (req, res) => {
    try {
        const tenders = await Tender.findAll();
        res.json(tenders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all tenders with their lowest bids
// router.get('/tenders', async (req, res) => {
//     try {
//         const tenders = await Tender.findAll({
//             include: {
//                 model: Bid,
//                 attributes: ['id', 'company_name', 'bid_cost'],
//                 required: false,
//             },
//         });

//         const tendersWithLowestBid = tenders.map(tender => {
//             const lowestBid = tender.Bids.length > 0 
//                 ? Math.min(...tender.Bids.map(bid => bid.bid_cost))
//                 : null;

//             return {
//                 id: tender.id,
//                 name: tender.name,
//                 description: tender.description,
//                 startTime: tender.startTime,
//                 endTime: tender.endTime,
//                 lowestBid: lowestBid,
//                 bids: tender.Bids // Include bids for further processing if needed
//             };
//         });

//         res.json(tendersWithLowestBid);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// Get all tenders with their lowest bids using raw SQL
router.get('/tenders', async (req, res) => {
    try {
        const tendersWithLowestBids = await sequelize.query(`
            SELECT tenders.id, tenders.name, tenders.description, tenders.startTime, tenders.endTime,
            MIN(bids.bid_cost) AS lowestBid
            FROM tenders
            LEFT JOIN bids ON tenders.id = bids.tender_id
            GROUP BY tenders.id
        `, { type: QueryTypes.SELECT }); // Use QueryTypes to specify the query type
        
        res.json(tendersWithLowestBids); // Send the array directly without destructuring
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Route to submit a bid for a specific tender
router.post('/tenders/:id/bid', async (req, res) => {
    try {
        const tenderId = req.params.id;
        const tender = await Tender.findByPk(tenderId);

        if (!tender) {
            return res.status(404).json({ message: 'Tender not found' });
        }

        // Extract bid details from the request body
        const { company_name, bid_cost } = req.body; // Make sure these match

        const newBid = await Bid.create({
            tender_id: tenderId,
            company_name: company_name, // Ensure this matches the request payload
            bid_cost: bid_cost, // Ensure this matches the request payload
            bid_time: new Date(), // You can set this directly or handle it in the model
            is_flagged: false // Default value
        });

        res.status(201).json(newBid);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to get all bids with tender names and end times
router.get('/getbids', async (req, res) => {
    try {
        const bids = await sequelize.query(`
            SELECT bids.*, 
                   tenders.name AS tender_name, 
                   tenders.endTime AS tender_end_time
            FROM bids
            LEFT JOIN tenders ON bids.tender_id = tenders.id
            ORDER BY bids.bid_cost ASC
        `, { type: QueryTypes.SELECT });

        const currentTime = new Date();

        const processedBids = bids.map(bid => {
            const endTime = new Date(bid.tender_end_time);
            const timeDifference = endTime - currentTime;

            const placedInLast5Minutes = timeDifference <= 5 * 60 * 1000 && timeDifference >= 0;

            return {
                ...bid,
                placedInLast5Minutes,
            };
        });

        res.json({ bids: processedBids }); // Return bids in a structured way
    } catch (error) {
        console.error('Error fetching bids:', error); // Log the error for debugging
        res.status(500).json({ message: error.message });
    }
});



// Add more routes as needed...

module.exports = router;
