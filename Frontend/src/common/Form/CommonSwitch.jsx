import React, { memo } from "react";
import { Switch, FormControlLabel } from "@mui/material";
import { useField } from "formik";

const CommonSwitch = ({ label, name, required = false, ...props }) => {
    const [field, , helpers] = useField(name);

    const handleChange = (e) => {
        helpers.setValue(e.target.checked);
    };

    return (
        <FormControlLabel
            control={
                <Switch
                    checked={Boolean(field.value)}
                    onChange={handleChange}
                    name={name}
                    {...props}
                />
            }
            label={
                <>
                    {label} {required && <span style={{ color: "red" }}> *</span>}
                </>
            }
            labelPlacement="start"
            sx={{
                width: "100%",
                margin: 0,
                justifyContent: "left",
            }}
        />
    );
};

export default memo(CommonSwitch);
