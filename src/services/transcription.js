
const DEEPGRAM_API_KEY = import.meta.env.VITE_DEEPGRAM_API_KEY;

export const transcribeAudio = async (audioBlob) => {
    if (!DEEPGRAM_API_KEY) {
        throw new Error("Deepgram API Key is missing. Check your .env file.");
    }

    try {
        const response = await fetch("https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true", {
            method: "POST",
            headers: {
                "Authorization": `Token ${DEEPGRAM_API_KEY}`,
                "Content-Type": audioBlob.type || "audio/webm",
            },
            body: audioBlob,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Deepgram API Error: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        const transcript = data.results?.channels[0]?.alternatives[0]?.transcript;

        return transcript || "";
    } catch (error) {
        console.error("Transcription failed:", error);
        throw error;
    }
};
