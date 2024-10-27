import { useState } from 'react';
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
    const [message, setMessage] = useState('');
    const [screenshot, setScreenshot] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('message', message);
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
                <Button variant="outline">Open popover</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Feedback</h4>
                        <p className="text-sm text-muted-foreground">
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