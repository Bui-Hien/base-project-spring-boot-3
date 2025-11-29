import React from 'react';
import {Icon, IconButton} from '@mui/material';

export default function CommonActionButton(props) {
    const { item, size, onSelect, fontSize, color, icon } = props;

    return (
        <IconButton size={size} onClick={() => onSelect(item, 0)}>
            <Icon fontSize={fontSize} color={color}>
                {icon}
            </Icon>
        </IconButton>
    );
}
