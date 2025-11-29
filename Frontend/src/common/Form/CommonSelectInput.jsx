import React, {memo} from "react";
import {FormControl, MenuItem, TextField,} from "@mui/material";
import {FastField, getIn, useFormikContext} from "formik";

const CommonSelectInput = (props) => {
    return (
        <FastField {...props} name={props.name} shouldUpdate={shouldComponentUpdate}>
            {({field, meta}) => (
                <MySelectInput {...props} field={field} meta={meta}/>
            )}
        </FastField>
    );
};

const MySelectInput = ({
                           name,
                           keyValue = "value",
                           displayvalue,
                           options,
                           size = "small",
                           variant = "outlined",
                           label,
                           hideNullOption,
                           required = false,
                           oldStyle = false,
                            disabled = false,
                           getOptionDisabled,
                           handleChange: externalHandleChange,
                           field,
                           meta,
                           ...otherProps
                       }) => {
    const {setFieldValue} = useFormikContext();

    const handleExternalChange = (evt) => {
        if (disabled) return;
        externalHandleChange?.(evt);
    };

    const handleInternalChange = (evt) => {
        if (disabled) return;
        const {value} = evt.target;
        setFieldValue(name, value);
    };

    const configSelectInput = {
        ...field,
        ...otherProps,
        select: true,
        // label,
        variant,
        size,
        fullWidth: true,
        onChange: externalHandleChange ? handleExternalChange : handleInternalChange,
        disabled: disabled || otherProps.disabled,
        className: `${oldStyle ? "" : "input-container"} ${disabled ? "read-only" : ""}`,
    };

    if (meta?.touched && meta?.error) {
        configSelectInput.error = true;
        configSelectInput.helperText = meta.error;
    }

    return (
        <FormControl fullWidth>
            {label && (
                <label htmlFor={name} className={`${oldStyle ? "old-label" : "label-container"}`}>
                    {label}
                    {required && <span style={{color: "red"}}> * </span>}
                </label>
            )}
            <TextField {...configSelectInput}>
                {!hideNullOption && (
                    <MenuItem value="">
                        <em>---</em>
                    </MenuItem>
                )}
                {options?.map((item, index) => {
                    const isDisabled = getOptionDisabled ? getOptionDisabled(item) : false;
                    return (
                        <MenuItem key={index} value={item[keyValue]} disabled={isDisabled}>
                            {item[displayvalue || "name"]}
                        </MenuItem>
                    );
                })}
            </TextField>
        </FormControl>
    );
};

const shouldComponentUpdate = (nextProps, currentProps) => {
    return (
        nextProps.name !== currentProps.name ||
        nextProps.value !== currentProps.value ||
        nextProps.handleChange !== currentProps.handleChange ||
        nextProps.label !== currentProps.label ||
        nextProps.required !== currentProps.required ||
        nextProps.requiredLabel !== currentProps.requiredLabel ||
        nextProps.disabled !== currentProps.disabled ||
        nextProps.displayvalue !== currentProps.displayvalue ||
        nextProps.options !== currentProps.options ||
        nextProps.keyValue !== currentProps.keyValue ||
        nextProps.hideNullOption !== currentProps.hideNullOption ||
        nextProps.formik?.isSubmitting !== currentProps.formik?.isSubmitting ||
        Object.keys(nextProps).length !== Object.keys(currentProps).length ||
        getIn(nextProps.formik?.values, currentProps.name) !== getIn(currentProps.formik?.values, currentProps.name) ||
        getIn(nextProps.formik?.errors, currentProps.name) !== getIn(currentProps.formik?.errors, currentProps.name) ||
        getIn(nextProps.formik?.touched, currentProps.name) !== getIn(currentProps.formik?.touched, currentProps.name)
    );
};

export default memo(CommonSelectInput);
