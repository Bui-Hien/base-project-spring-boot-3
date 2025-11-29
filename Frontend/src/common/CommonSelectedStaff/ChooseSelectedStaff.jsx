import React, {memo, useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import {useStore} from "../../stores";
import CommonSelectedStaffList from "./CommonSelectedStaffList";
import StaffToolbar from "../../views/Staff/StaffToolbar";
import CommonPopupV2 from "../CommonPopupV2";
import TouchAppIcon from '@mui/icons-material/TouchApp';
import {Button, ButtonGroup} from "@mui/material";
import CommonPagingAutocompleteV2 from "../Form/CommonPagingAutocomplete";

function ChooseSelectedStaff(props) {
    const {staffStore} = useStore();
    const [open, setOpen] = useState(false);

    const {
        title = "Chọn nhân viên",
        size = "md",
        labelTitle = "Nhân viên",
        labelButton = "Chon Nhân viên",
        name = "staff",
        isOnlyChoose = false,
        multiline = false,
        className = "",
        required = false,
        disabled = false,
    }
        = props;
    const {
        pagingStaff,
        resetStore
    } = staffStore;

    useEffect(() => {
        if (open){
            pagingStaff();
        }
        return resetStore
    }, [open]);

    return (
        <div className={`w-full ${className}`}>
            <ButtonGroup
                className={"w-full"}
                color="container"
                aria-label="outlined primary button group"
            >
                {isOnlyChoose ? (
                    <Button
                        onClick={() => setOpen(true)}
                        startIcon={<TouchAppIcon/>}
                    >
                        {labelButton}
                    </Button>
                ) : (
                    <div className="flex gap-2 w-full">
                        <div className="flex-grow ">
                            <CommonPagingAutocompleteV2
                                label={labelTitle}
                                name={name}
                                api={pagingStaff}
                                getOptionLabel={(option) =>
                                    option?.staffCode && option?.displayName
                                        ? `${option.staffCode} - ${option.displayName}`
                                        : option?.staffCode || option?.displayName || ""
                                }
                                required={required}
                                disabled
                            />
                        </div>
                        <div className="flex items-end">
                            <Button
                                disabled={disabled}
                                onClick={() => setOpen(true)}
                                startIcon={<TouchAppIcon/>}
                            >
                                {labelButton}
                            </Button>
                        </div>
                    </div>
                )}
            </ButtonGroup>
            {open && (
                <CommonPopupV2
                    size={size}
                    scroll={"body"}
                    open={open}
                    noDialogContent
                    title={title}
                    noIcon={true}
                    onClosePopup={() => {
                        setOpen(false)
                    }}
                >
                    <div className="px-4 pt-4 grid grid-cols-12">
                        <div className={"col-span-12"}>
                            <StaffToolbar isAction={false}/>
                        </div>
                        <div className={"col-span-12"}>
                            <CommonSelectedStaffList {...props} />
                        </div>
                    </div>
                </CommonPopupV2>
            )}
        </div>
    );
}

export default memo(observer(ChooseSelectedStaff));
