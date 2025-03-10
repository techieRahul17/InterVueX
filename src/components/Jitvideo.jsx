import React, { useEffect } from 'react';
import { JaaSMeeting } from "@jitsi/react-sdk";
import { signJWT } from '../utils/jwt';

const JitsiIframe = () => {
    const domain = import.meta.env.VITE_JITSI_DOMAIN;
    const appId = import.meta.env.VITE_JITSI_APP_ID;
    const jwt = signJWT({
        "kid": "vpaas-magic-cookie-6381f715d48d4625a56d59db90356bdb/f46f9f",
        "typ": "JWT",
        "alg": "RS256",
        "aud": "jitsi",
        "iss": "chat",
        "iat": 1741580170,
        "exp": 1842587490,
        "nbf": 1741580165,
        "sub": "vpaas-magic-cookie-6381f715d48d4625a56d59db90356bdb",
        "context": {
            "features": {
                "livestreaming": true,
                "outbound-call": true,
                "sip-outbound-call": false,
                "transcription": true,
                "recording": true
            },
            "user": {
                "hidden-from-recorder": false,
                "moderator": true,
                "name": "ramcharanslm8",
                "id": "auth0|67ce19fd1541061096d64525",
                "avatar": "",
                "email": "ramcharanslm8@gmail.com"
            }
        },
        "room": "*"
    });

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
            useStaging={true}
        />
    );
};

export default JitsiIframe;
