import React, {useEffect, useState} from 'react';
import Avatar from '@mui/material/Avatar';
import {API_ENDPOINT} from "../appConfig";

export default function CommonAvatar({ name, imgPath, isFile, style, className }) {
    const [errorLinkImg, setErrorLinkImg] = useState(false);

    const getImageNameAndType = (name) => {
        if (name) {
            const parts = name.split('.');
            return parts[0] + '/' + parts[1];
        }
        return '';
    };

    const getLastNameInitial = (name) => {
        if (name) {
            return name.split(' ').pop().charAt(0).toUpperCase();
        }
        return 'N';
    };

    useEffect(() => {
        setErrorLinkImg(false);
    }, [isFile, imgPath]);

    // Tạo link ảnh nếu không phải file trực tiếp
    const src = imgPath && !errorLinkImg
        ? isFile
            ? imgPath
            : `${API_ENDPOINT}/public/hr/file/getImage/${getImageNameAndType(imgPath)}`
        : null;

    return (
        <Avatar
            src={src}
            alt={name || 'NS'}
            onError={() => setErrorLinkImg(true)}
            className={`${className} avatar-new`}
            sx={{ bgcolor: '#5899ca7d', ...style }}
        >
            {!src && (name ? getLastNameInitial(name) : 'NS')}
        </Avatar>
    );
}
