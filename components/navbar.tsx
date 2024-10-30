import { navigation } from "@/data/navigation"

export const Navbar = () => {

    return (
        <div className="w-dvw h-16 bg-background sticky flex items-center justify-between">
            <div className="flex items-center">
                <h1 className="text-3xl font-bold text-primary ml-8 cormorant-medium-heavy">The Wingspan</h1>
                <div className="w-[1px] h-3/4 bg-black mx-8">&nbsp;</div>
                <div className="flex items-center gap-10">
                    <a href={navigation.links.stories.url} className="text-xl text-primary libre-regular hover:underline">{navigation.links.stories.label}</a>
                    <a href={navigation.links.sports.main.url} className="text-xl text-primary libre-regular hover:underline">{navigation.links.sports.main.label}</a>
                    <a href={navigation.links.opinion.url} className="text-xl text-primary libre-regular hover:underline">{navigation.links.opinion.label}</a>
                    <a href={navigation.links.community.url} className="text-xl text-primary libre-regular hover:underline">{navigation.links.community.label}</a>
                    <a href={navigation.links.about.main.url} className="text-xl text-primary libre-regular hover:underline">{navigation.links.about.main.label}</a>
                </div>
            </div>
            <div className="flex items-center mr-8">
                <button className="bg-blue-500 hover:bg-blue-600 transition-colors text-lg text-white dark:text-black px-3 py-1 rounded-md cormorant-medium-heavy">Subscribe</button>
            </div>
        </div>
    )
}