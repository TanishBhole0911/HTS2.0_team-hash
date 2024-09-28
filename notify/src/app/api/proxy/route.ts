import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
    // Get the 'url' query parameter from the request
    const url = req.nextUrl.searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
    }

    try {
        // Fetch the webpage content using axios
        const response = await axios.get(url);
        return new Response(response.data, {
            status: response.status,
            headers: { 'Content-Type': 'text/html' }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}