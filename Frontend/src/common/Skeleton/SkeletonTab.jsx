import React, {memo} from "react";
import "react-toastify/dist/ReactToastify.css";
import {observer} from "mobx-react-lite";
import {Skeleton} from "@mui/material";

function LoadingTabSkeleton() {
    return (
        <>
            <Skeleton />
            <Skeleton animation={false} />
            <Skeleton animation="wave" />
        </>
    );
}

export default memo(observer(LoadingTabSkeleton));
