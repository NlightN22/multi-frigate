import { routesPath } from "../../router/routes.path";
import { headerMenu } from "../../shared/strings/header.menu.strings";
import { HeaderActionProps } from "./HeaderAction";

export const testHeaderLinks: HeaderActionProps =
    {
        links: [
            {link: routesPath.MAIN_PATH, label: headerMenu.home, links: []},
            {link: routesPath.TEST_PATH, label: headerMenu.test, links: []},
            {link: routesPath.SETTINGS_PATH, label: headerMenu.settings, links: []},
            {link: routesPath.RECORDINGS_PATH, label: headerMenu.recordings, links: []},
            {link: routesPath.HOSTS_PATH, label: headerMenu.hostsConfig, links: []},
            {link: routesPath.ROLES_PATH, label: headerMenu.acessSettings, links: []},
        ]
    }