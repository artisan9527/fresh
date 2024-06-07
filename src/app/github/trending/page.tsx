import TrendingCard from "@/components/github/TrendingCard";
import { TrendingService } from "@/services/github/trending";
import TrendingOptions from "./TrendingOptions";

export default async function GithubTrending() {
	const githubTrendingService = new TrendingService();
	const projects = await githubTrendingService.getProjectsInfo();
	return (
		<>
			<div>
				<TrendingOptions />
			</div>
			<div className="p-[24px] flex justify-start items-start flex-wrap">
				{projects.map((p) => {
					return <TrendingCard key={p.projectLink} {...p} />;
				})}
			</div>
		</>
	);
}
