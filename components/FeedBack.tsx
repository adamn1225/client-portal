import { useState } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

const FeedBack = () => {
    const supabase = useSupabaseClient();
    const user = useUser();
    const [message, setMessage] = useState('');
    const [screenshot, setScreenshot] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            alert('You must be logged in to send feedback.');
            return;
        }

        // Fetch user profile information
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('first_name, last_name, email, phone_number')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
            alert('Failed to fetch user profile.');
            return;
        }

        const formData = new FormData();
        formData.append('message', message);
        formData.append('first_name', profile.first_name || '');
        formData.append('last_name', profile.last_name || '');
        formData.append('email', profile.email || '');
        formData.append('phone_number', profile.phone_number || '');
        if (screenshot) {
            formData.append('screenshot', screenshot);
        }

        const response = await fetch('/api/sendFeedback', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            alert('Feedback sent successfully!');
        } else {
            alert('Failed to send feedback.');
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">Feedback</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="light-dark-btn leading-none">Feedback</h4>
                        <p className="text-sm text-muted-foreground">
                            Your feedback is important to us to ensure we provide the best experience possible. <br />
                            Type your message and upload a screenshot (optional).
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <div className="grid grid-cols-1 items-center gap-4">
                            <Textarea
                                id="message"
                                placeholder="Type your message here."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="h-24"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 items-center gap-4">
                            <Label htmlFor="screenshot">Upload a screenshot (optional)</Label>
                            <Input
                                type="file"
                                id="screenshot"
                                accept="image/*"
                                onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                            />
                        </div>
                        <Button type="submit">Submit</Button>
                    </div>
                </form>
            </PopoverContent>
        </Popover>
    );
}

export default FeedBack;