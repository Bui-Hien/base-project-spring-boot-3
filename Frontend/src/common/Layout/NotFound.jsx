import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {HOME_PAGE} from "../../appConfig";

const NotFound = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate(HOME_PAGE);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
            <ErrorOutlineIcon style={{ fontSize: 80 }} color="error" />
            <h1 className="text-4xl font-bold mt-4 text-red-600">404 - Không tìm thấy trang</h1>
            <p className="text-lg mt-2 text-gray-600">
                Trang bạn đang tìm không tồn tại hoặc đã bị xóa.
            </p>
            <Button variant="contained" color="primary" onClick={handleGoHome} className="mt-6">
                Về trang chủ
            </Button>
        </div>
    );
};

export default NotFound;
