"use client";

import React, { useState, ChangeEvent } from "react";

const options = {
	since: [
		{ label: "daily", value: "daily" },
		{ label: "weekly", value: "weekly" },
		{ label: "monthly", value: "monthly" },
	],
	spokenLanguage: [
		{ label: "chinese", value: "zh" },
		{ label: "english", value: "en" },
	],
	programmingLanguage: [
		{ label: "JavaScript", value: "javascript" },
		{ label: "Python", value: "python" },
		{ label: "Java", value: "java" },
		{ label: "C++", value: "cpp" },
		{ label: "Ruby", value: "ruby" },
		{ label: "Go", value: "go" },
		{ label: "PHP", value: "php" },
	],
};

const TrendingOptions: React.FC = () => {
	const [selectedSince, setSelectedSince] = useState<string>("");
	const [selectedSpokenLanguage, setSelectedSpokenLanguage] = useState<string>("");
	const [selectedProgrammingLanguage, setSelectedProgrammingLanguage] = useState<string>("");

	const handleSinceChange = (event: ChangeEvent<HTMLSelectElement>) => {
		const newValue = event.target.value;
		setSelectedSince(newValue);
		printValues(newValue, selectedSpokenLanguage, selectedProgrammingLanguage);
	};

	const handleSpokenLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
		const newValue = event.target.value;
		setSelectedSpokenLanguage(newValue);
		printValues(selectedSince, newValue, selectedProgrammingLanguage);
	};

	const handleProgrammingLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
		const newValue = event.target.value;
		setSelectedProgrammingLanguage(newValue);
		printValues(selectedSince, selectedSpokenLanguage, newValue);
	};

	const printValues = (since: string, spokenLanguage: string, programmingLanguage: string) => {
		console.log("Date range:", since);
		console.log("Spoken Language:", spokenLanguage);
		console.log("Programming Language:", programmingLanguage);
	};

	return (
		<div className="p-4 flex space-x-5">
			<div className="flex items-center">
				<label className="text-sm font-medium text-gray-700 mr-2">Date range:</label>
				<select
					className="p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
					value={selectedSince}
					onChange={handleSinceChange}
				>
					<option value="">Select an option</option>
					{options.since.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			</div>

			<div className="flex items-center">
				<label className="text-sm font-medium text-gray-700 mr-2">Spoken Language:</label>
				<select
					className="p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
					value={selectedSpokenLanguage}
					onChange={handleSpokenLanguageChange}
				>
					<option value="">Select an option</option>
					{options.spokenLanguage.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			</div>

			<div className="flex items-center">
				<label className="text-sm font-medium text-gray-700 mr-2">Programming Language:</label>
				<select
					className="p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
					value={selectedProgrammingLanguage}
					onChange={handleProgrammingLanguageChange}
				>
					<option value="">Select an option</option>
					{options.programmingLanguage.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			</div>
		</div>
	);
};

export default TrendingOptions;
