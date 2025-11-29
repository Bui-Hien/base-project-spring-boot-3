import React from "react";
import {FormControl, FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup,} from "@mui/material";
import {FastField} from "formik";

const CommonRadioGroup = (props) => {
    return (
        <FastField {...props} name={props.name}>
            {({field, meta, form}) => (
                <MyRadioGroup
                    {...props}
                    field={field}
                    meta={meta}
                    setFieldValue={form.setFieldValue}
                />
            )}
        </FastField>
    );
};

const MyRadioGroup = ({
                          name,
                          label,
                          options,
                          inARow,
                          disabled,
                          setFieldValue,
                          field,
                          meta,
                          ...otherProps
                      }) => {
    const configRadioGroup = {
        ...field,
        ...otherProps,
        row: otherProps?.row ?? true,
        onChange: (event) => {
            if (!disabled) {
                setFieldValue(name, event.target.value);
            }
        },
    };

    return (
        <FormControl
            error={Boolean(meta?.touched && meta?.error)}
            className={disabled ? "read-only" : ""}
        >
            {!inARow && <FormLabel className="mr-12">{label}</FormLabel>}
            <RadioGroup {...configRadioGroup}>
                {inARow && <FormLabel className="mr-12">{label}</FormLabel>}
                {options?.map((option) => (
                    <FormControlLabel
                        key={option?.value}
                        value={option?.value}
                        label={option?.name}
                        control={<Radio/>}
                        disabled={ disabled}
                    />
                ))}
            </RadioGroup>
            {meta?.touched && meta?.error && (
                <FormHelperText>{meta.error}</FormHelperText>
            )}
        </FormControl>
    );
};

export default CommonRadioGroup;
