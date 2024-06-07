export async function GET(req: Request) {
	const path = new URL(req.url).pathname;
	return Response.json({ path });
}
