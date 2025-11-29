import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import { useTranslation } from "react-i18next";
import PaperComponent from "./PaperComponent";
import { observer } from "mobx-react-lite";

function Popup({
                   title,
                   longTitle,
                   directedTitle,
                   open,
                   handleClose,
                   selectedItem,
                   FormComponent,
               }) {
    const formProps = {
        handleClose,
        selectedItem,
    };
    const { t } = useTranslation();

    return (
        <Dialog open={open} PaperComponent={PaperComponent} fullWidth maxWidth="sm">
            <DialogTitle
                className="dialog-header bgc-primary-d1"
                style={
                    !longTitle
                        ? { cursor: "move" }
                        : { cursor: "move", paddingRight: "54px" }
                }
                id="draggable-dialog-title"
            >
        <span className="mb-20 text-white">
          {!directedTitle
              ? (selectedItem?.id
                  ? t("general.button.edit")
                  : t("general.button.add")) +
              " " +
              title
              : directedTitle}
        </span>
            </DialogTitle>

            <IconButton
                style={{ position: "absolute", right: "10px", top: "10px" }}
                onClick={handleClose}
            >
                <Icon color="disabled" title={t("general.close")}>
                    close
                </Icon>
            </IconButton>

            <FormComponent {...formProps} />
        </Dialog>
    );
}

export default observer(Popup);
