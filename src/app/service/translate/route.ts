import { defaultTranslator } from "@/services/translate/translate";

export async function POST(req: Request) {
	try {
		const { text } = await req.json();
		if (!text) return Response.json({ code: 0, msg: "", src: text, dst: "" });
		const dst = await defaultTranslator.translate(text);
		return Response.json({ code: 0, msg: "", src: text, dst });
	} catch (error) {
		return Response.json({ code: -1, msg: error });
	}
}
