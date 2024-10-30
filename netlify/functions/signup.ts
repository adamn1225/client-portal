import { Handler } from '@netlify/functions';
import { createClient, User } from '@supabase/supabase-js';
import { EventEmitter } from 'events';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase URL and Service Role Key must be set in environment variables');
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

// Increase the limit of listeners
EventEmitter.defaultMaxListeners = 20;

export const handler: Handler = async (event) => {
    try {
        const { email, password, firstName, lastName, companyName, companySize } = JSON.parse(event.body as string);

        // Validate input data
        if (!email || !password || !firstName || !lastName || !companyName || !companySize) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'All fields are required' }),
            };
        }

        // Sign up the user with Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            console.error('Supabase Auth Error:', error);
            return {
                statusCode: 400,
                body: JSON.stringify({ error: error.message }),
            };
        }

        const user: User | null = data.user;

        if (user) {
            // Check if the company already exists
            const { data: existingCompany, error: companyError } = await supabase
                .from('companies')
                .select('*')
                .eq('name', companyName)
                .single();

            let companyId: string;

            if (companyError) {
                console.error('Supabase Company Error:', companyError);
                return {
                    statusCode: 400,
                    body: JSON.stringify({ error: companyError.message }),
                };
            }

            if (existingCompany) {
                companyId = existingCompany.id;
            } else {
                // Create a new company record
                const { data: newCompany, error: newCompanyError } = await supabase
                    .from('companies')
                    .insert({
                        name: companyName,
                        size: companySize,
                        id: data.user.id,
                    })
                    .single();

                if (newCompanyError) {
                    console.error('Supabase New Company Error:', newCompanyError);
                    return {
                        statusCode: 400,
                        body: JSON.stringify({ error: newCompanyError.message }),
                    };
                }

                companyId = data.user.id;
            }

            // Store additional user information in the profiles table
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: user.id,
                    email: user.email,
                    inserted_at: new Date().toISOString(),
                    role: 'user',
                    first_name: firstName,
                    last_name: lastName,
                    company_name: companyName,
                    company_size: companySize,
                    company_id: companyId,
                });

            if (profileError) {
                console.error('Supabase Profile Error:', profileError);
                return {
                    statusCode: 400,
                    body: JSON.stringify({ error: profileError.message }),
                };
            }

            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Sign up successful! Please check your email to confirm your account.' }),
            };
        }

        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'User sign-up failed' }),
        };
    } catch (error) {
        console.error('Unexpected Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'An unexpected error occurred.' }),
        };
    }
};