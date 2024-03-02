import { TextInput } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import React, { useEffect, useState } from 'react';

interface TextImputCellProps {
    text?: string | number | boolean,
    width?: string,
    id?: string | number,
    propertyName?: string,
    onChange?: (
        id: string | number,
        propertyName: string,
        value?: string | number | boolean,
    ) => void,
}

const TextInputCell = ({ text, width, id, propertyName, onChange }: TextImputCellProps) => {
    const [value, setValue] = useState(text);
    const [debouncedValue] = useDebouncedValue(value, 300)
    useEffect(() => {
        if (debouncedValue !== text) {
            if (id && propertyName && onChange)
                onChange(id, propertyName, debouncedValue)
        }
    }, [debouncedValue, id, propertyName, onChange, text])
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.currentTarget.value)
    }
    return (
        <td style={{ width: width, textAlign: 'center' }}>
            <TextInput onChange={handleChange} size='sm' value={String(value)} />
        </td>
    )
}

export default TextInputCell;