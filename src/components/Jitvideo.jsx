import React, { useEffect } from 'react';
import { JaaSMeeting } from "@jitsi/react-sdk";
//
// const JitsiIframe = () => {
//     useEffect(() => {
//         const domain = "8x8.vc";
//         const options = {
//             roomName: "vpaas-magic-cookie-6381f715d48d4625a56d59db90356bdb/SampleAppRudeFightingsChainAll",
//             parentNode: document.querySelector('#jaas-container'),
//             jwt: "eyJraWQiOiJ2cGFhcy1tYWdpYy1jb29raWUtNjM4MWY3MTVkNDhkNDYyNWE1NmQ1OWRiOTAzNTZiZGIvNTkwMGIxLVNBTVBMRV9BUFAiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6ImNoYXQiLCJpYXQiOjE3NDE1ODc1MjIsImV4cCI6MTc0MTU5NDcyMiwibmJmIjoxNzQxNTg3NTE3LCJzdWIiOiJ2cGFhcy1tYWdpYy1jb29raWUtNjM4MWY3MTVkNDhkNDYyNWE1NmQ1OWRiOTAzNTZiZGIiLCJjb250ZXh0Ijp7ImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOmZhbHNlLCJvdXRib3VuZC1jYWxsIjpmYWxzZSwic2lwLW91dGJvdW5kLWNhbGwiOmZhbHNlLCJ0cmFuc2NyaXB0aW9uIjpmYWxzZSwicmVjb3JkaW5nIjpmYWxzZX0sInVzZXIiOnsiaGlkZGVuLWZyb20tcmVjb3JkZXIiOmZhbHNlLCJtb2RlcmF0b3IiOnRydWUsIm5hbWUiOiJUZXN0IFVzZXIiLCJpZCI6ImF1dGgwfDY3Y2UxOWZkMTU0MTA2MTA5NmQ2NDUyNSIsImF2YXRhciI6IiIsImVtYWlsIjoidGVzdC51c2VyQGNvbXBhbnkuY29tIn19LCJyb29tIjoiKiJ9.NdLdR2CSkdMpJtfzhtcNZVk_eSA9pcOBm9LZQhhakPzslbQoFAL_j9htdNBKYkjpXT1C00B5tTyEbOUOUWmCYlGhsJjbMYFddfkt-CNdu92ym14AYlaY_5jOMOQSlIJCB7LjVJbB1hzWm8o0ORRShkLr3qva9wFts-WtbtyZxqM0wYTI_wba3Rg0GrDX-9EbksgiwYc0JtwZRMj3bR-MGa4qfhUEXFAuFHgFCciovGnhBC2g_3j8OjQsxrDYI_cJ8vLzk-d-2tGZ9JdKZtvwO8XNIsSaXvV7sCsyq28Ui0R4lYcnA8Qkcirp-RlOZu6jFgaUbsy0QQhszCF0W-0-Vg"
//         };
//         const api = new window.JitsiMeetExternalAPI(domain, options);
//
//         // Optional: add event listeners or perform other actions with the api object
//         return () => {
//             if (api) {
//                 api.dispose(); // Clean up the Jitsi iframe when the component unmounts
//             }
//         };
//     }, []);
//
//     return (
//         <div id="jaas-container" style={{ height: '70vh' }} />
//     );
// };

const JitsiIframe = (jwt) => {

    const YOUR_APP_ID = "vpaas-magic-cookie-6381f715d48d4625a56d59db90356bdb";
    let YOUR_VALID_JWT = import.meta.env.VITE_JITSI_JWT;

    return (
        <JaaSMeeting
            appId={YOUR_APP_ID}
            roomName="PleaseUseAGoodRoom123"
            jwt={YOUR_VALID_JWT}
            configOverwrite={{
                disableLocalVideoFlip: true,
                backgroundAlpha: 0.5,
                transcribingEnabled: true, // Enable Transcription
            }}
            interfaceConfigOverwrite={{
                VIDEO_LAYOUT_FIT: 'nocrop',
                MOBILE_APP_PROMO: false,
                TILE_VIEW_MAX_COLUMNS: 4,
                SHOW_JITSI_WATERMARK: false,
                SHOW_BRAND_WATERMARK: false,
                SHOW_WATERMARK_FOR_GUESTS: false
            }}
            getIFrameRef={(iframeRef) => { iframeRef.style.height = '500px'; }}
        />
    );
}



export default JitsiIframe;
