import path from "path";
import fs from "node:fs";
import fsAsync from "node:fs/promises";

export class Cache<T> {
	readonly dirName = "TEMP";
	private cacheDirPath = path.join(process.cwd(), this.dirName);
	private fileName = "";
	private filePath = "";

	constructor(name: string) {
		this.fileName = name;
		this.filePath = path.join(this.cacheDirPath, this.fileName);
		this.init();
	}

	private init() {
		fs.mkdirSync(this.cacheDirPath, { recursive: true });
		if (!fs.existsSync(this.filePath)) {
			fs.writeFileSync(this.filePath, "");
		}
	}

	async writeCache(data: T) {
		try {
			await fsAsync.writeFile(this.filePath, JSON.stringify(data), { encoding: "utf-8" });
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	}

	async readCache(): Promise<T | null> {
		try {
			const content = await fsAsync.readFile(this.filePath, { encoding: "utf-8" });
			const data = JSON.parse(content);
			return data as T;
		} catch (error) {
			console.error(error);
			return null;
		}
	}
}
