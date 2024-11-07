import React from 'react';

const Privacy = () => {
    return (
        <div>
            <div className="question">
                <a href="http://www.heavyconstruct.com/contact" target="_blank" rel="noopener noreferrer" className="link">
                    http://www.heavyconstruct.com/contact
                </a>
            </div>
            <div style={{ lineHeight: '1.5' }}>
                <span style={{ fontSize: '15px' }}>
                    You can opt out from the selling of your personal information, targeted advertising, or profiling by disabling cookies in Cookie Preference Settings.
                </span>
            </div>
            <div style={{ lineHeight: '1.5' }}>
                <span style={{ fontSize: '15px' }}>
                    Under certain US state data protection laws, you can designate an authorized agent to make a request on your behalf. We may deny a request from an authorized agent that does not submit proof that they have been validly authorized to act on your behalf in accordance with applicable laws.
                </span>
            </div>
            <div style={{ lineHeight: '1.5' }}>
                <span style={{ fontSize: '15px' }}>
                    <strong>Request Verification</strong>
                </span>
            </div>
            <div style={{ lineHeight: '1.5' }}>
                <span style={{ fontSize: '15px' }}>
                    Upon receiving your request, we will need to verify your identity to determine you are the same person about whom we have the information in our system. We will only use personal information provided in your request to verify your identity or authority to make the request. However, if we cannot verify your identity from the information already maintained by us, we may request that you provide additional information for the purposes of verifying your identity and for security or fraud-prevention purposes.
                </span>
            </div>
            <div style={{ lineHeight: '1.5' }}>
                <span style={{ fontSize: '15px' }}>
                    If you submit the request through an authorized agent, we may need to collect additional information to verify your identity before processing your request and the agent will need to provide a written and signed permission from you to submit such request on your behalf.
                </span>
            </div>
            <div style={{ lineHeight: '1.5' }}>
                <span style={{ fontSize: '15px' }}>
                    <strong>Appeals</strong>
                </span>
            </div>
            <div style={{ lineHeight: '1.5' }}>
                <span style={{ fontSize: '15px' }}>
                    Under certain US state data protection laws, if we decline to take action regarding your request, you may appeal our decision by emailing us at{' '}
                    <a href="mailto:noah@ntslogistics.com">noah@ntslogistics.com</a>. We will inform you in writing of any action taken or not taken in response to the appeal, including a written explanation of the
                </span>
            </div>
        </div>
    );
};

export default Privacy;