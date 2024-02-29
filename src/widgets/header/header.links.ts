import { routesPath } from "../../router/routes.path";
import { headerMenu } from "../../shared/strings/header.menu.strings";
import { LinkItem } from "./HeaderAction";

export const headerLinks: LinkItem[] = [
    { link: routesPath.MAIN_PATH, label: headerMenu.home },
    { link: routesPath.SETTINGS_PATH, label: headerMenu.settings, admin: true },
    { link: routesPath.RECORDINGS_PATH, label: headerMenu.recordings },
    { link: routesPath.HOSTS_PATH, label: headerMenu.hostsConfig, admin: true },
    { link: routesPath.ACCESS_PATH, label: headerMenu.acessSettings, admin: true },
]