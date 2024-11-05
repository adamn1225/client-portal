require('dotenv').config();
const axios = require('axios');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' }),
        };
    }

    const { email, firstName, lastName, companyName, companySize } = JSON.parse(event.body);

    if (!email || !firstName || !lastName) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Email, first name, and last name are required' }),
        };
    }

    try {
        // Check if the company already exists
        const { data: existingCompany, error: companyError } = await axios.post(`${SUPABASE_URL}/rest/v1/rpc/check_company`, {
            name: companyName
        }, {
            headers: {
                apikey: SERVICE_ROLE_KEY,
                Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        let companyId;

        if (companyError && companyError.code !== 'PGRST116') {
            throw new Error(companyError.message);
        }

        if (existingCompany) {
            companyId = existingCompany.id;
        } else {
            // Create a new company record
            const { data: newCompany, error: newCompanyError } = await axios.post(`${SUPABASE_URL}/rest/v1/rpc/create_company`, {
                name: companyName,
                size: companySize,
            }, {
                headers: {
                    apikey: SERVICE_ROLE_KEY,
                    Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
                    'Content-Type': 'application/json',
                },
            });

            if (newCompanyError) {
                throw new Error(newCompanyError.message);
            }

            companyId = newCompany.id;
        }

        // Store additional user information in the profiles table
        const { error: profileError } = await axios.post(`${SUPABASE_URL}/rest/v1/rpc/create_profile`, {
            email,
            first_name: firstName,
            last_name: lastName,
            company_name: companyName,
            company_size: companySize,
            company_id: companyId,
            role: 'user', // Provide a default role
        }, {
            headers: {
                apikey: SERVICE_ROLE_KEY,
                Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        if (profileError) {
            throw new Error(profileError.message);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Profile setup successful' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to complete profile setup', details: error.response ? error.response.data : error.message }),
        };
    }
};