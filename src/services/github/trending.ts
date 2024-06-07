import { parse, type HTMLElement } from "node-html-parser";
import fs from "node:fs/promises";
import path from "path";

export interface ProjectInfo {
	projectName: string;
	projectLink: string;
	description: string;
	programmingLanguage: string;
	stars: number;
	forks: number;
	starsToday: number;
}

export enum TrendingSince {
	none = "",
	daily = "daily",
	weekly = "weekly",
	monthly = "monthly",
}

export enum TrendingSpokenLanguage {
	none = "",
	chinese = "zh",
	english = "en",
}

export class TrendingService {
	private rootUrl = "https://github.com/trending";
	// https://github.com/trending/css?since=monthly&spoken_language_code=zh
	private since = TrendingSince.daily;
	private spokenLanguage = TrendingSpokenLanguage.none;
	private programmingLanguage = "";

	private get cacheFilePath() {
		const pre = this.since + this.spokenLanguage + this.programmingLanguage;
		const fileName = pre + "github-trending.json";
		return path.join(process.cwd(), "temp", fileName);
	}

	private get url() {
		let root = this.rootUrl;
		if (this.programmingLanguage) {
			root = root + "/" + encodeURIComponent(this.programmingLanguage);
		}
		const url = new URL(root);
		if (this.since) url.searchParams.append("since", this.since);
		if (this.spokenLanguage) url.searchParams.append("spoken_language_code", this.spokenLanguage);
		return url.toString();
	}

	setSince(value: TrendingSince) {
		this.since = value;
	}

	setSpokenLanguage(value: TrendingSpokenLanguage) {
		this.spokenLanguage = value;
	}

	setProgrammingLanguage(value: string) {
		this.programmingLanguage = value;
	}

	private async getHtml() {
		try {
			const resp = await fetch(this.url);
			return await resp.text();
		} catch (_) {
			return "";
		}
	}

	private extractProjectInfo(node: HTMLElement): ProjectInfo | null {
		let projectNameElement = node.querySelector("h2 a");
		const projectName = projectNameElement?.textContent?.trim().split("/")[1].trim() || "";

		const projectLink = projectNameElement?.getAttribute("href") || "";

		const descriptionElement = node.querySelector("p.col-9");
		const description = descriptionElement?.textContent?.trim() || "";

		const programmingLanguageElement = node.querySelector("span[itemprop='programmingLanguage']");
		const programmingLanguage = programmingLanguageElement?.textContent?.trim() || "";

		const starsElement = node.querySelector("a[href*='/stargazers']");
		const stars = parseInt(starsElement?.textContent?.trim().replace(/,/g, "") || "0");

		const forksElement = node.querySelector("a[href*='/forks']");
		const forks = parseInt(forksElement?.textContent?.trim().replace(/,/g, "") || "0");

		const starsTodayElement = node.querySelector("span.d-inline-block.float-sm-right");
		const starsToday = parseInt(starsTodayElement?.textContent?.trim().match(/\d+/)?.[0] || "0");

		return {
			projectName,
			projectLink,
			description,
			programmingLanguage,
			stars,
			forks,
			starsToday,
		};
	}

	private async readCache() {
		try {
			const fileInfo = await fs.stat(this.cacheFilePath);
			const currentTime = new Date().getTime();
			const modificationTime = fileInfo.mtime?.getTime() ?? 0;

			// 检查修改时间是否超过1小时
			const oneHourInMillis = 60 * 60 * 1000;
			if (currentTime - modificationTime > oneHourInMillis) {
				return null;
			}

			const jsonString = await fs.readFile(this.cacheFilePath, { encoding: "utf-8" });
			const obj = JSON.parse(jsonString);
			return obj as ProjectInfo[];
		} catch (_) {
			return null;
		}
	}

	async getProjectsInfo(): Promise<ProjectInfo[]> {
		const cache = await this.readCache();
		if (cache && cache.length) return cache;
		const html = await this.getHtml();
		const doc = parse(html);
		const rows = Array.from(doc.querySelectorAll(".Box-row"));
		const results: ProjectInfo[] = [];
		rows.forEach((r) => {
			const info = this.extractProjectInfo(r);
			if (info) results.push(info);
		});
		try {
			const jsonString = JSON.stringify(results, null, 2);
			const dirPath = path.dirname(this.cacheFilePath);
			await fs.mkdir(dirPath, { recursive: true });
			await fs.writeFile(this.cacheFilePath, jsonString, { encoding: "utf-8" });
		} catch (_) {
			return [];
		}
		return results;
	}
}
