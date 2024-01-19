import getBase64 from "@/utils/getLocalBase64";
import { NextRequest } from "next/server";
import { getPlaiceholder } from "plaiceholder";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { url } = body;

    /* console.log(url) */

    const base64 = await getBase64(url)

 /*    console.log(base64) */

    return new Response(JSON.stringify(base64));
}