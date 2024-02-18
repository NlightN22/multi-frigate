import { TextInput } from '@mantine/core';
import React from 'react';

interface TextImputCellProps {
    text?: string | number | boolean,
    width?: string,
    id?: string | number,
    propertyName?: string,
    onChange?: (
        id: string | number,
        propertyName: string,
        value: string,
    ) => void,
}

const TextInputCell = ({ text, width, id, propertyName, onChange }: TextImputCellProps) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (id && propertyName && onChange)
            onChange(id, propertyName, event.currentTarget.value)
    }
    return (
        <td style={{ width: width, textAlign: 'center' }}>
            <TextInput onChange={handleChange} size='sm' value={String(text)} />
        </td>
    )
}

export default TextInputCell;