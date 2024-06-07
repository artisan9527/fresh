"use client";

import { useEffect, useState } from "react";

const Description = ({ content }: { content: string }) => {
	const [text, setText] = useState(content);
	const [lang, setLang] = useState<"en" | "cn">("en");

	useEffect(() => {
		if (lang === "en") {
			setText(content);
		} else {
			fetch("/service/translate", {
				method: "POST",
				body: JSON.stringify({ text: content }),
				headers: { "Content-Type": "application/json" },
			}).then((resp) => {
				resp.json().then((data) => {
					setText(data.dst);
				});
			});
		}
	}, [lang, content]);

	function onChangeLang() {
		setLang(lang === "cn" ? "en" : "cn");
	}

	return (
		<div
			title={text}
			className="text-gray-700 text-sm leading-6 h-12 overflow-hidden line-clamp-2 break-all"
			onClick={onChangeLang}
		>
			{text}
		</div>
	);
};

export default Description;
