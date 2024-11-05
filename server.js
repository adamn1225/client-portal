require('dotenv').config();
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

app.use(bodyParser.json());

const authenticateAdmin = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey && apiKey === ADMIN_API_KEY) {
        next();
    } else {
        res.status(403).json({ error: 'Unauthorized' });
    }
};

app.delete('/admin/delete-user', authenticateAdmin, async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        // Delete the user from the auth.users table
        await axios.delete(`${SUPABASE_URL}/auth/v1/admin/users/${userId}`, {
            headers: {
                apikey: SERVICE_ROLE_KEY,
                Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
            },
        });

        // Delete related records from the profiles table
        const { data, error } = await axios.post(
            `${SUPABASE_URL}/rest/v1/rpc/delete_user_profiles`,
            { user_id: userId },
            {
                headers: {
                    apikey: SERVICE_ROLE_KEY,
                    Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (error) {
            throw error;
        }

        res.status(200).json({ message: 'User and related records deleted successfully', data });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user', details: error.response ? error.response.data : error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});