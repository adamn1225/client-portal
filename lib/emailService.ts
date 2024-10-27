export const sendEmail = async (to: string, subject: string, text: string) => {
    try {
        const response = await fetch('/api/sendEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ to, subject, text }),
        });

        if (!response.ok) {
            throw new Error('Error sending email');
        }

        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};