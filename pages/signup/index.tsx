import SignUpPage from '@/pages/components/SignUpPage';
import { UserProvider } from '@/context/UserContext';

export default function UserSignUp() {
    return (
        <UserProvider>
            <SignUpPage />
        </UserProvider>
    );
}