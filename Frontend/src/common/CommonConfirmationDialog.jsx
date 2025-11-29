import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

export default function AlertDialog (props) {
  const {
    open,
    onConfirmDialogClose,
    text,
    title,
    agree = "Đồng ý",
    cancel = "Hủy",
    onYesClick,
    handleAfterConfirm
  } = props;

  const handleAgree = async () => {
    if (typeof onYesClick === 'function') {
      await onYesClick ();
    }
    if (typeof handleAfterConfirm === 'function') {
      handleAfterConfirm ();
    }
    onConfirmDialogClose ();
  };

  return (
      <Dialog
          open={open}
          onClose={onConfirmDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onConfirmDialogClose}>
            {cancel}
          </Button>
          <Button onClick={handleAgree} autoFocus>
            {agree}
          </Button>
        </DialogActions>
      </Dialog>
  );
}
