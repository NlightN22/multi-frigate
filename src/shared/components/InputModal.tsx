import { ActionIcon, CloseButton, Flex, Modal, NumberInput, TextInput, Tooltip, createStyles, } from '@mantine/core';
import { getHotkeyHandler, useMediaQuery } from '@mantine/hooks';
import React, { ReactEventHandler, useState, FocusEvent, useRef, Ref } from 'react';
import { strings } from '../strings/strings';
import { IconAlertCircle, IconX } from '@tabler/icons-react';
import { dimensions } from '../dimensions/dimensions';

const useStyles = createStyles((theme) => ({
    rightSection: {
        width: '3rem',
        marginRight: '0.2rem',
    }
}))

interface InputModalProps {
    inValue: number
    putValue?(value: number): void
    opened: boolean
    open(): void
    close(): void
}

const InputModal = ({ inValue, putValue, opened, open, close }: InputModalProps) => {
    const { classes } = useStyles()
    const [value, setValue] = useState(inValue)
    const isMobile = useMediaQuery(dimensions.mobileSize)

    const refInput: React.LegacyRef<HTMLInputElement> = useRef(null)

    const handeLoaded = (event: FocusEvent<HTMLInputElement, Element>) => {
        event.target.select()
    }
    const handeClear = () => {
        setValue(0)
        refInput.current?.select()
    }

    const handleSetValue = (value: number | "") => {
        if (typeof value === "number") {
            setValue(value)
        }
    }

    const handleClose = () => {
        if (putValue) putValue(value)
        close()
    }
    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            withCloseButton={false}
            centered
            fullScreen={isMobile}
        >
            <Flex justify="space-between">
                <div>{strings.enterQuantity}</div>
                <CloseButton size="lg" onClick={handleClose} />
            </Flex>
            <NumberInput
                ref={refInput}
                classNames={classes}
                type="number"
                value={value}
                onChange={handleSetValue}
                data-autofocus
                placeholder={strings.quantity}
                hideControls
                min={0}
                onFocus={handeLoaded}
                onKeyDown={
                    getHotkeyHandler([
                        ['Enter', handleClose]
                    ])
                }
                rightSection={ // value.toString().length > 0 ? <ActionIcon onClick={(event) => handeClear()}><IconX size="1.4rem" /></ActionIcon> : null // todo move to textinput
                    <Flex  w='100%' h='100%' justify='right' align='center'>
                        <Tooltip label={strings.tooltip_close} position="top-end" withArrow>
                            <div>
                                <IconAlertCircle size="1.4rem" style={{ display: 'block', opacity: 0.5 }} />
                            </div>
                        </Tooltip>
                    </Flex>
                }
            />
        </Modal>
    );
};

export default InputModal;