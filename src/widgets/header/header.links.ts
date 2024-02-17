import { pathRoutes } from "../../router/routes.path";
import { headerMenu } from "../../shared/strings/header.menu.strings";
import { HeaderActionProps } from "./HeaderAction";

export const testHeaderLinks: HeaderActionProps =
    {
        links: [
            {link: pathRoutes.MAIN_PATH, label: headerMenu.home, links: []},
            {link: pathRoutes.TEST_PATH, label: headerMenu.test, links: []},
        ]
    }