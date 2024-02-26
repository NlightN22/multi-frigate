import { TextInput, TextInputProps, createStyles } from '@mantine/core';
import { useEffect, useState } from 'react';
import classes from './FloatingLabelInput.module.css';

interface FloatingLabelInputProps extends TextInputProps {
    value?: string,
    ecryptedValue?: string,
    onChangeValue?: (key: string, value: string) => void
}


export const FloatingLabelInput = (props: FloatingLabelInputProps) => {
    const { value: propVal, onChangeValue, ecryptedValue, ...rest } = props
    const [focused, setFocused] = useState(false);
    const [value, setValue] = useState(propVal || '');
    const floating = value?.trim().length !== 0 || focused || undefined;

    useEffect(() => {
        setValue(propVal || '')
    }, [propVal]);

    const handleFocused = (event: React.FocusEvent<HTMLInputElement>) => {
        setFocused(true)
        event.target.select()
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.currentTarget.value);
        if (onChangeValue && props.name) {
            onChangeValue(props.name, event.currentTarget.value);
        }
    }

    return (
        <TextInput
            value={value}
            classNames={classes}
            onChange={handleChange}
            onFocus={handleFocused}
            onBlur={() => setFocused(false)}
            mt='2rem'
            autoComplete="nope"
            data-floating={floating}
            labelProps={{ 'data-floating': floating }}
            {...rest}
        />
    );
}