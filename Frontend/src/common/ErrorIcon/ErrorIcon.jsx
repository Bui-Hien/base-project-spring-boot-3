import React from 'react';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Tooltip from '@mui/material/Tooltip';
import styles from './styles.module.scss';

const ErrorIcon = ({ helperText }) => {
    return (
        <Tooltip arrow title={helperText}>
            <ErrorOutlineIcon color="error" className={styles.icon} />
        </Tooltip>
    );
};

export default React.memo(ErrorIcon);
