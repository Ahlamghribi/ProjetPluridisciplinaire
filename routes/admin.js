const express = require('express');
const router = express.Router();
const Admin = require('../models/admin');

// Route to add a new admin
router.post('/admins', async (req, res) => {
    const { nom, prenom, dateDeNaissance, sex, email, motDePasse } = req.body;

    try {
        // Check if admin with the provided email already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin with this email already exists' });
        }

        // Create a new admin instance
        const newAdmin = new Admin({
            nom,
            prenom,
            email,
            motDePasse
        });

        // Save the admin to the database
        const savedAdmin = await newAdmin.save();

        res.status(201).json({ message: 'Admin added successfully', admin: savedAdmin });
    } catch (error) {
        console.error('Error adding admin:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Route to remove an admin by email
router.delete('/admins/:email', async (req, res) => {
    const email = req.params.email;

    try {
        // Find the admin by email
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Delete the admin
        await Admin.findOneAndDelete({ email });

        res.json({ message: 'Admin deleted successfully', admin });
    } catch (error) {
        console.error('Error deleting admin:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;