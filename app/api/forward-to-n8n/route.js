export async function POST(req) {
    const body = await req.json();
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_FORM_WEBHOOK, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        const data = await response.text();
        return new Response(JSON.stringify({ ok: true, n8n: data }), { status: 200 });
    } catch (err) {
        return new Response(
            JSON.stringify({ error: "Failed to forward to n8n", details: err.message }),
            { status: 500 }
        );
    }
} 