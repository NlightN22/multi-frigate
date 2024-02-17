import {IconArrowBadgeLeft, IconArrowBadgeRight} from "@tabler/icons-react";
import {Button, ButtonProps, createStyles} from "@mantine/core";

/**
 * @param side left or right
 */
interface SideButtonProps extends ButtonProps {
    side: 'left' | 'right',
    onClick?: () => void,
    hide?: boolean,
}

interface Styles {
    side: 'left' | 'right',
    hide?: boolean
}

const handleHide = (side:'left' | 'right', hide?:boolean) => {
    if (hide) {
        if (side === 'left') return 'translateX(-100%)'
        else return 'translateX(+100%)'
    }
    return 'translateX(0)'
}

const useStyles = createStyles((theme, {side, hide}: Styles ) => ({
    side_button: {
        display: "flex",
        flexDirection: "column",
        listStyle: "none",
        margin: "0",
        padding: "0",
        paddingLeft: side === 'left' ? "0.7em" : '',
        paddingRight: side === 'right' ? "0.7em" : '',
        position: "fixed",
        left: side === 'left' ? '-1em' : '',
        right: side === 'right' ? '-1em' : '',
        top: "50%",
        height: "5em",
        width: "2.5em",
        transition: 'transform 0.3s ease-in-out',
        transform: handleHide(side,hide),

        ul: {
            paddingLeft: "0em"
        }
    }
}))

export const SideButton = (props: SideButtonProps) => {
    const {classes, cx} = useStyles({side: props.side, hide: props.hide})

    return (
        <Button
            radius="lg"
            className={cx(classes.side_button, props.className,)}
            onClick={props.onClick}
        >
            <ul>
                <li> {props.side === 'left' ? <IconArrowBadgeRight/> : <IconArrowBadgeLeft/>}</li>
                <li>{props.side === 'left' ? <IconArrowBadgeRight/> : <IconArrowBadgeLeft/>}</li>
            </ul>
        </Button>

    );
};

