const ParkingSlot = require('../models/parkingSlot');

module.exports.getAllSlots = async (req, res) => {
    try {
        // By default we return only active slots
        const query = { isActive: true };

        // If frontend sends ?status=AVAILABLE, filter by that status
        if (req.query.status) {
            query.status = req.query.status.toUpperCase();
        }

        const slots = await ParkingSlot.find(query).sort({ slotNumber: 1 });

        return res.status(200).json({
            success: true,
            count: slots.length,
            slots
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch parking slots'
        });
    }
};
