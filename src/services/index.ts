export async function sleep(duration: number) {
	let timer: NodeJS.Timeout | null = null;
	return new Promise((resolve) => {
		timer = setTimeout(() => {
			resolve(null);
			if (timer) clearTimeout(timer);
			timer = null;
		}, duration);
	});
}
