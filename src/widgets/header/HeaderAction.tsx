import { Button, Container, Flex, Group, Header, Menu, createStyles, rem } from "@mantine/core";
import { useNavigate } from 'react-router-dom';
import { useAdminRole } from "../../hooks/useAdminRole";
import { routesPath } from "../../router/routes.path";
import UserMenu from '../../shared/components/UserMenu';
import ColorSchemeToggle from "../../shared/components/buttons/ColorSchemeToggle";
import Logo from "../../shared/components/images/LogoImage";
import DrawerMenu from "../../shared/components/menu/DrawerMenu";
import { useKeycloak } from "@react-keycloak/web";

const HEADER_HEIGHT = rem(60)

const useStyles = createStyles((theme) => ({
    inner: {
        height: HEADER_HEIGHT,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    leftMenu: {
        flexWrap: "nowrap"
    },

    leftLinksMenu: {
        [theme.fn.largerThan('md')]: {
            display: 'none',
        },
        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },

    centerLinksMenu: {
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        [theme.fn.smallerThan('md')]: {
            display: 'none',
        },

    },

    colorToggle: {
        [theme.fn.smallerThan('md')]: { display: 'none' }
    }

}))

export interface LinkItem {
    label: string
    link: string,
    admin?: boolean
}

export interface HeaderActionProps {
    links: LinkItem[],
    logo?: JSX.Element
}

export const HeaderAction = ({ links }: HeaderActionProps) => {
    const { classes } = useStyles();
    const navigate = useNavigate()
    const { isAdmin } = useAdminRole()
    const { keycloak, initialized } = useKeycloak()

    const handleNavigate = (link: string) => {
        navigate(link)
    }

    const items = links.filter(link => !(link.admin && !isAdmin)).map(link =>
        <Menu key={link.label} trigger="hover" transitionProps={{ exitDuration: 0 }} withinPortal>
            <Menu.Target>
                <Button variant="subtle" uppercase onClick={() => handleNavigate(link.link)}>
                    {link.label}
                </Button>
            </Menu.Target>
        </Menu>
    )

    const userName = keycloak.tokenParsed?.preferred_username + (isAdmin ? ' (admin)' : '')

    return (
        <Header height={HEADER_HEIGHT} sx={{ borderBottom: 0 }}>
            <Container className={classes.inner} fluid>
                <Flex wrap='nowrap' >
                    <Logo onClick={() => handleNavigate(routesPath.MAIN_PATH)} />
                    <DrawerMenu links={links} />
                    <Flex className={classes.leftLinksMenu}>
                        {items}
                    </Flex>
                </Flex>
                <Container className={classes.centerLinksMenu}>
                    {items}
                </Container>
                <Group position="right">
                    <ColorSchemeToggle className={classes.colorToggle} />
                    <UserMenu user={{ name: userName, image: "" }} />
                </Group>
            </Container>
        </Header >
    )
}