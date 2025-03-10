import React, {useEffect} from 'react';
import { JaaSMeeting } from "@jitsi/react-sdk";

const JitsiIframe = () => {
    const domain = import.meta.env.VITE_JITSI_DOMAIN;
    const appId = import.meta.env.VITE_JITSI_APP_ID;
    const jwt = import.meta.env.VITE_JITSI_JWT;
    return (
        <JaaSMeeting
            appId={appId}
            roomName="interview"
            jwt={jwt}
            configOverwrite={{
                startWithAudioMuted: true, // Start muted (optional)
                startWithVideoMuted: false, // Enable video by default


            }}
            interfaceConfigOverwrite={{
                VIDEO_LAYOUT_FIT: "nocrop",
                MOBILE_APP_PROMO: false,
                TILE_VIEW_MAX_COLUMNS: 4,
            }}
            onApiReady={(externalApi) => {
                console.log("Jitsi API Ready", externalApi);
            }}
            getIFrameRef={(iframeRef) => {
                iframeRef.style.height = "100vh";
            }}

            useStaging = { true }

        />
    );
};

export default JitsiIframe;