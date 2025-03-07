import React from 'react';

const JitsiIframe = () => {
    const jitsiMeetingURL = 'https://meet.jit.si/your-meeting-id';

    return (
        <iframe
            src={jitsiMeetingURL}
            width="100%"
            height="100%"
            allow="camera; microphone; fullscreen"
            style={{ border: 'none' }}
        />
    );
};

export default JitsiIframe;