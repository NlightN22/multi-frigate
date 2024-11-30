import { CloseButton, TextInput, TextInputProps } from '@mantine/core';
import React, { useState } from 'react';

interface ClearableTextInputProps extends TextInputProps {
    clerable?: boolean
}


const ClearableTextInput: React.FC<ClearableTextInputProps> = ({
    value,
    onChange,
    clerable,
    ...textInputProps
}) => {
    const [text, setText] = useState(value)

    const handleClear = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setText('')
        if (onChange) {
            const fakeEvent = {
                target: { value: '' },
                currentTarget: { value: '' }
            } as unknown as React.ChangeEvent<HTMLInputElement>;
            onChange(fakeEvent);
        }
    }

    const handleChange = (value: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) onChange(value)
        setText(value.currentTarget.value)
    }

    return (
        <TextInput
            rightSection={clerable ? <CloseButton onClick={handleClear} /> : null}
            value={text}
            onChange={handleChange}
            {...textInputProps}
        />
    );
};

export default ClearableTextInput;