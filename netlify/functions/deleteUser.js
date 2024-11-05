require('dotenv').config();
const axios = require('axios');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

exports.handler = async (event) => {
    if (event.httpMethod !== 'DELETE') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' }),
        };
    }

    const { userId } = JSON.parse(event.body);

    if (!userId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'User ID is required' }),
        };
    }

    const apiKey = event.headers['x-api-key'];
    if (!apiKey || apiKey !== ADMIN_API_KEY) {
        return {
            statusCode: 403,
            body: JSON.stringify({ error: 'Unauthorized' }),
        };
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

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'User and related records deleted successfully', data }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to delete user', details: error.response ? error.response.data : error.message }),
        };
    }
};