import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {styled} from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const StyledDialog = styled(Dialog)(({theme}) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default function CommonPopupV2({
                                          open,
                                          onClosePopup = () => {
                                          },
                                          title,
                                          size = 'md',
                                          children,
                                          styleTitle = {},
                                          noHeader = false,
                                          styleContent = {},
                                          action = null,
                                          noDialogContent = false,
                                          popupId,
                                          scroll = 'paper', // 'paper' | 'body'
                                          isCreate = false,
                                          isEdit = !isCreate,
                                          noIcon = false
                                      }) {
    return (
        <StyledDialog
            onClose={onClosePopup}
            open={open}
            fullWidth
            maxWidth={size}
            scroll={scroll}
            aria-labelledby={popupId || 'common-dialog-title'}
        >
            {/* HEADER */}
            {!noHeader && (
                <DialogTitle
                    id={popupId || 'common-dialog-title'}
                    sx={{m: 0, p: 2, ...styleTitle}}
                    className="border-b border-gray-300 flex justify-between"
                >
                    <div className="">
                        {(!noIcon && isCreate) && (
                            <AddCircleOutlineIcon/>
                        )}
                        {(!noIcon && isEdit)
                            && (
                                <EditIcon/>
                            )}
                        {title}
                    </div>
                    <IconButton
                        aria-label="close"
                        onClick={onClosePopup}
                        sx={(theme) => ({
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: theme.palette.grey[500],
                        })}
                    >
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
            )}

            {/* CONTENT */}
            {!noDialogContent ? (
                <DialogContent dividers sx={styleContent}>
                    {children}
                </DialogContent>
            ) : (
                children
            )}

            {/* ACTION */}
            {action && <DialogActions>{action}</DialogActions>}
        </StyledDialog>
    );
}
