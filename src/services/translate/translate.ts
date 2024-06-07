import { createHash } from "crypto";
import { sleep } from "..";
import { Cache } from "../cache/cache";

export class BaiduTranslator {
	private readonly APP_ID = "20200901000556959";
	private readonly SECRET_KEY = "GVK7UEbIxvC5HLJOU00M";
	private readonly fromLang: string;
	private readonly toLang: string;

	private lastApiCallTime = 0;
	private timeInterval = 1000;

	private cache = new Cache<Record<string, string>>("BaiduTranslator");

	constructor(fromLang: string = "auto", toLang: string = "zh") {
		this.fromLang = fromLang;
		this.toLang = toLang;
	}

	async translate(text: string): Promise<string> {
		const cacheRecords = await this.cache.readCache();
		const dst = cacheRecords ? cacheRecords[text] : "";
		if (dst) return dst;

		const now = Date.now();
		const duration = now - this.lastApiCallTime;
		this.lastApiCallTime = now;
		if (duration < this.timeInterval) {
			await sleep(this.timeInterval - duration);
		}

		// 生成随机数
		const salt = Date.now().toString();

		// 生成签名
		const sign = createHash("md5").update(`${this.APP_ID}${text}${salt}${this.SECRET_KEY}`).digest("hex");

		// 构建请求参数
		const params = new URLSearchParams();
		params.append("q", text);
		params.append("from", this.fromLang);
		params.append("to", this.toLang);
		params.append("appid", this.APP_ID);
		params.append("salt", salt);
		params.append("sign", sign);

		// 发送 HTTP 请求
		const response = await fetch("https://fanyi-api.baidu.com/api/trans/vip/translate", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: params,
		});

		// 解析响应数据
		const result = await response.json();

		// 提取翻译结果
		const translation = result && result.trans_result ? result.trans_result[0].dst : "";

		const record = cacheRecords ?? {};
		record[text] = translation;
		await this.cache.writeCache(record);

		return translation;
	}
}

// 示例用法
export const defaultTranslator = new BaiduTranslator();
