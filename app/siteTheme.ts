import { supabase } from "@api/supabaseClient";

interface SiteSettings {
    setIsChristmas: boolean;
    setIsHalloween: boolean;
}

export const siteTheme = async (): Promise<SiteSettings> => {
    const { data, error } = await supabase
    .from("siteSettings")
    .select("*");

    if (error || !data || data.length === 0) {
        console.log("error", error);
        return { setIsChristmas: false, setIsHalloween: false };
    }
    return {
        setIsChristmas: Boolean(data[0].setIsChristmas),
        setIsHalloween: Boolean(data[0].setIsHalloween),
    };
};