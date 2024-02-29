import { Button, Container, Flex, Group, Header, Menu, createStyles, rem } from "@mantine/core";
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';
import { useAdminRole } from "../../hooks/useAdminRole";
import { routesPath } from "../../router/routes.path";
import UserMenu from '../../shared/components/UserMenu';
import ColorSchemeToggle from "../../shared/components/buttons/ColorSchemeToggle";
import Logo from "../../shared/components/images/LogoImage";
import DrawerMenu from "../../shared/components/menu/DrawerMenu";

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
    // TODO delete
    burger: {
        [theme.fn.largerThan('sm')]: {
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
    const auth = useAuth()
    const { isAdmin } = useAdminRole()

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

    return (
        <Header height={HEADER_HEIGHT} sx={{ borderBottom: 0 }}>
            <Container className={classes.inner} fluid>
                <Flex wrap='nowrap' >
                    <Logo onClick={() => handleNavigate(routesPath.MAIN_PATH)} />
                    {/* <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm" /> */}
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
                    <UserMenu user={{ name: auth.user?.profile.preferred_username || "", image: "" }} />
                </Group>
            </Container>
        </Header >
    )
}