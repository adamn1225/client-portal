require('dotenv').config();
const axios = require('axios');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' }),
        };
    }

    const { email } = JSON.parse(event.body);

    if (!email) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Email is required' }),
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
        const response = await axios.post(`${SUPABASE_URL}/auth/v1/resend`, {
            type: 'signup',
            email,
            options: {
                emailRedirectTo: `${process.env.NEXT_PUBLIC_REDIRECT_URL}`
            }
        }, {
            headers: {
                apikey: SERVICE_ROLE_KEY,
                Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.data.error) {
            throw new Error(response.data.error.message);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Confirmation email resent successfully' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to resend confirmation email', details: error.response ? error.response.data : error.message }),
        };
    }
};