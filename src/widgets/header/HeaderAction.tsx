import { Burger, createStyles, Header, rem, Menu, Container, Group, Button, Flex } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import UserMenu from '../../shared/components/UserMenu';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';
import ColorSchemeToggle from "../../shared/components/buttons/ColorSchemeToggle";
import Logo from "../../shared/components/images/LogoImage";
import { routesPath } from "../../router/routes.path";
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
    link: string
}

export interface HeaderActionProps {
    links: LinkItem[],
    logo?: JSX.Element
}

export const HeaderAction = ({ links }: HeaderActionProps) => {
    const { classes } = useStyles();
    const navigate = useNavigate()
    const auth = useAuth()

    const handleNavigate = (link: string) => {
        navigate(link)
    }

    const items = links.map(item =>
        <Menu key={item.label} trigger="hover" transitionProps={{ exitDuration: 0 }} withinPortal>
            <Menu.Target>
                <Button variant="subtle" uppercase onClick={() => handleNavigate(item.link)}>
                    {item.label}
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