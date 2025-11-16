import Vapi from "@vapi-ai/web";

const API_KEY = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN!;
if (!API_KEY)
    throw new Error("Missing NEXT_PUBLIC_VAPI_WEB_TOKEN environment variable.");

export default function getVapiClient(): Vapi {
    return new Vapi(API_KEY);
}
