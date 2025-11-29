/* eslint-disable react-hooks/exhaustive-deps */
import React, { forwardRef, memo, useEffect, useState } from "react";
import { InputAdornment, TextField } from "@mui/material";
import { FastField, getIn } from "formik";
import { NumericFormat } from 'react-number-format';
import PropTypes from 'prop-types';

const CommonVNDCurrencyInput = (props) => (
    <FastField
        {... props}
        name={props.name}
        shouldUpdate={shouldComponentUpdate}
    >
      {({field, meta, form}) => (
          <Component
              {... props}
              field={field}
              meta={meta}
              setFieldValue={form.setFieldValue}
          />
      )}
    </FastField>
);

const NumericFormatCustom = forwardRef (function NumericFormatCustom (
    props,
    ref,
) {
  const {onChange, ... other} = props;

  return (
      <NumericFormat
          {... other}
          getInputRef={ref}
          onValueChange={(values) => {
            onChange ({
              target:{
                name:props.name,
                value:values.value,
              },
            });
          }}
          thousandSeparator=","
          decimalSeparator="."
          valueIsNumericString
          isAllowed={(values) => {
            const {floatValue} = values;
            return floatValue === undefined || floatValue >= 0;
          }}
      />
  );
});

NumericFormatCustom.displayName = 'NumericFormatCustom';
NumericFormatCustom.propTypes = {
  name:PropTypes.string.isRequired,
  onChange:PropTypes.func.isRequired,
};

const Component = ({
                     name,
                     label,
                     type = "text",
                     debounceTime = 400,
                     notDelay,
                     field,
                     meta,
                     disabled = false,
                     placeholder,
                     isTextArea,
                     minRowArea,
                     required,
                     className = '',
                     onChange,
                     setFieldValue,
                     autoCapitalize = false,
                     unit = "VND",
                     variant = "outlined",
                     size = "small",
                     fullWidth = true,
                     ... otherProps
                   }) => {
  const [value, setValue] = useState (field.value);
  const [timeoutId, setTimeoutId] = useState (undefined);

  useEffect (() => {
    if (field.value !== value) {
      setValue (field.value ?? "");
    }
  }, [field.value]);

  const handleChange = (e) => {
    if (disabled) return;
    let inputValue = e.target.value;

    if (autoCapitalize) {
      if (inputValue.charAt (0) === inputValue.charAt (0).toLowerCase ()) {
        inputValue = inputValue.replace (
            inputValue.charAt (0),
            inputValue.charAt (0).toLocaleUpperCase ()
        );
      }
      inputValue = inputValue.replace (/\s\S/g, (s) => s.toLocaleUpperCase ());
    }

    setValue (inputValue);

    if (!notDelay) {
      if (timeoutId) {
        clearTimeout (timeoutId);
      }

      const newTimeoutId = setTimeout (() => {
        if (onChange) {
          onChange (e);
        } else {
          setFieldValue (name, e.target.value ?? null);
        }
      }, debounceTime);

      setTimeoutId (newTimeoutId);
    } else {
      if (onChange) {
        onChange (e);
      } else {
        setFieldValue (name, e.target.value ?? null);
      }
    }
  };

  const hasError = Boolean (meta?.touched && meta?.error);

  return (
      <>
        {label && (
            <label
                htmlFor={name}
                className={`"label-container"}`}
            >
              {label} {(required) && <span style={{color:"red"}}> * </span>}
            </label>
        )}
        <TextField
            {... otherProps}
            fullWidth={fullWidth}
            id={name}
            name={name}
            value={value ?? ""}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            type={type}
            error={hasError}
            helperText={hasError? meta?.error : ""}
            variant={variant}
            size={size}
            multiline={isTextArea}
            minRows={isTextArea? minRowArea || 3 : undefined}
            slotProps={{
              input:{
                disabled:disabled,
                inputComponent:NumericFormatCustom,
                endAdornment:unit? (
                    <InputAdornment position="end">
                      {unit}
                    </InputAdornment>
                ) : null,
              },
              htmlInput:{
                name:name,
              },
            }}
            InputLabelProps={{
              htmlFor:name,
              shrink:true,
            }}
            className={`${className} ${disabled? 'read-only' : ''} ${
                isTextArea? 'isTextArea' : ''
            }`}
            sx={{
              '& .MuiOutlinedInput-root.read-only':{
                backgroundColor:'#f5f5f5',
                '& fieldset':{
                  borderColor:'#d0d0d0',
                },
              },
            }}
        />
      </>
  );
};

const shouldComponentUpdate = (nextProps, currentProps) => {
  const nextFormik = nextProps?.formik;
  const currentFormik = currentProps?.formik;
  const nextName = currentProps?.name;

  return (
      nextProps?.readOnly !== currentProps?.readOnly ||
      nextProps?.value !== currentProps?.value ||
      nextProps?.onChange !== currentProps?.onChange ||
      nextProps?.disabled !== currentProps?.disabled ||
      nextProps?.name !== currentProps?.name ||
      Object.keys (nextProps).length !== Object.keys (currentProps).length ||
      getIn (nextFormik?.values, nextName) !==
      getIn (currentFormik?.values, nextName) ||
      getIn (nextFormik?.errors, nextName) !==
      getIn (currentFormik?.errors, nextName) ||
      getIn (nextFormik?.touched, nextName) !==
      getIn (currentFormik?.touched, nextName)
  );
};

export default memo (CommonVNDCurrencyInput);