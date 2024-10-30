import Image from 'next/image'
import { navigation } from "@/data/navigation";

export const Footer = () => {

    return (
        <div className="w-dvw h-fit bg-background flex gap-20 py-10">
            <div className="flex flex-col w-1/4 justify-between">
            <div className="flex flex-col gap-5">
                <h1 className="text-3xl font-bold text-primary ml-8 cormorant-medium-heavy">{navigation.site_name_short}</h1>
                <h3 className="text-xl text-neutral-500 ml-8 libre-regular">{navigation.site_description}</h3>
            </div>
            <h5 className="text-lg text-neutral-500 ml-8 libre-regular">{navigation.copyright}</h5>
            </div>
            <div className="flex items-center justify-center h-full">
            <Image src="/static/lccc.webp" alt="LCCC Logo" width={150} height={150} />
            </div>
            <div className="flex gap-24">
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl text-primary cormorant-bold">{navigation.links.campus.main.label}:</h2>
                    <a href={navigation.links.campus.events.url} className="text-lg text-neutral-700 libre-regular hover:underline">{navigation.links.campus.events.label}</a>
                    <a href={navigation.links.campus.clubs.url} className="text-lg text-neutral-700 libre-regular hover:underline">{navigation.links.campus.clubs.label}</a>
                    <a href={navigation.links.campus.regulations.url} className="text-lg text-neutral-700 libre-regular hover:underline">{navigation.links.campus.regulations.label}</a>
                    <a href={navigation.links.campus.classes.url} className="text-lg text-neutral-700 libre-regular hover:underline">{navigation.links.campus.classes.label}</a>
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl text-primary cormorant-bold">{navigation.links.sports.main.label}:</h2>
                    <a href={navigation.links.sports.volleyball.url} className="text-lg text-neutral-700 libre-regular hover:underline">{navigation.links.sports.volleyball.label}</a>
                    <a href={navigation.links.sports.soccer.url} className="text-lg text-neutral-700 libre-regular hover:underline">{navigation.links.sports.soccer.label}</a>
                    <a href={navigation.links.sports.basketball.url} className="text-lg text-neutral-700 libre-regular hover:underline">{navigation.links.sports.basketball.label}</a>
                    <a href={navigation.links.sports.handball.url} className="text-lg text-neutral-700 libre-regular hover:underline">{navigation.links.sports.handball.label}</a>
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl text-primary cormorant-bold">{navigation.links.about.main.label}:</h2>
                    <a href={navigation.links.about.staff.url} className="text-lg text-neutral-700 libre-regular hover:underline">{navigation.links.about.staff.label}</a>
                    <a href={navigation.links.about.history.url} className="text-lg text-neutral-700 libre-regular hover:underline">{navigation.links.about.history.label}</a>
                    <a href={navigation.links.about.awards.url} className="text-lg text-neutral-700 libre-regular hover:underline">{navigation.links.about.awards.label}</a>
                    <a href={navigation.links.about.contact.url} className="text-lg text-neutral-700 libre-regular hover:underline">{navigation.links.about.contact.label}</a>
                </div>
                <div className='flex flex-col gap-2'>
                    <a href={navigation.links.legal.privacy.url} className="text-lg text-neutral-700 libre-regular hover:underline">{navigation.links.legal.privacy.label}</a>
                    <a href={navigation.links.legal.terms.url} className="text-lg text-neutral-700 libre-regular hover:underline">{navigation.links.legal.terms.label}</a>
                </div>
            </div>
        </div>
    )
}