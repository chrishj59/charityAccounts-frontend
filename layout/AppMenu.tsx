import type { MenuModel } from "@/types";
import AppSubMenu from "./AppSubMenu";

const AppMenu = () => {
    const model: MenuModel[] = [
        {label: "Menu Label",}
        
    ];

    return <AppSubMenu model={model} />;
};

export default AppMenu;
