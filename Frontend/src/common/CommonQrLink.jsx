import React, {memo, useState} from "react";
import CloseIcon from "@mui/icons-material/Close";
import {Button, Dialog, DialogContent, DialogTitle, IconButton, Paper, Typography,} from "@mui/material";
import Draggable from "react-draggable";
import {useTranslation} from "react-i18next";
import QRCode from "react-qr-code";
import "./SearchBox.scss";

function CommonQrLink(props) {
    const {
        open,
        onConfirmDialogClose,
        text,
        title,
        maxWidth = "xs",
    } = props;

    const { t } = useTranslation();
    const [copySuccess, setCopySuccess] = useState("");

    // Copy to clipboard handler
    const handleCopyClick = () => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                setCopySuccess("Copied!");
                setTimeout(() => setCopySuccess(""), 2000);
            })
            .catch(() => {
                setCopySuccess("Failed to copy!");
            });
    };

    return (
        <Dialog
            maxWidth={maxWidth}
            fullWidth
            open={open}
            onClose={onConfirmDialogClose}
            className="confirmDeletePopup"
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-confirm-dialog-title"
        >
            <DialogTitle
                className="confirmDeletePopupTitle"
                style={{ cursor: "move" }}
                id="draggable-confirm-dialog-title"
            >
                {title}
            </DialogTitle>

            <IconButton
                className="confirmCloseBtn"
                onClick={onConfirmDialogClose}
                style={{ position: "absolute", right: 8, top: 8 }}
                aria-label={t("general.close")}
            >
                <CloseIcon />
            </IconButton>

            <DialogContent className="confirmDeletePopupContent">
                <div
                    style={{
                        textAlign: "center",
                        padding: 16,
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <QRCode value={text} />
                </div>
                <div style={{ textAlign: "center", paddingTop: 16 }}>
                    <Typography variant="body2" style={{ wordBreak: "break-all" }}>
                        {text}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCopyClick}
                        style={{ marginTop: 8 }}
                    >
                        Copy Link
                    </Button>
                    {copySuccess && (
                        <Typography variant="body2" color="primary" style={{ marginTop: 8 }}>
                            {copySuccess}
                        </Typography>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default memo(CommonQrLink);

function PaperComponent(props) {
    return (
        <Draggable
            handle="#draggable-confirm-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} />
        </Draggable>
    );
}
