import 'dotenv/config';
import { updateUserRole } from '../lib/updateUserRole.mjs';

const updateRoleScript = async () => {
    try {
        const email = 'adam.n@nationwidetransportservices.com';
        const newRole = 'admin';
        const result = await updateUserRole(email, newRole);
        console.log('User role updated successfully:', result);
    } catch (error) {
        console.error('Error updating user role:', error.message);
    }
};

updateRoleScript();