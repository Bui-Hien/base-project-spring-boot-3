import { FastField, getIn } from "formik";
import React, { forwardRef, memo } from "react";
import { Checkbox, FormControlLabel, FormGroup, FormHelperText, Radio, } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledFormControlLabel = styled (FormControlLabel) (({theme}) => ({
  margin:0,
  "& .MuiIconButton-root":{
    padding:8,
  },
  "&.read-only":{
    opacity:0.6,
    pointerEvents:"none",
  },
}));

const CommonCheckBox = ({value = true, ... props}, ref) => (
    <FastField
        {... props}
        value={value}
        name={props.name}
        shouldUpdate={shouldComponentUpdate}
    >
      {({field, form, meta}) => (
          <Component
              value={value}
              {... props}
              field={field}
              meta={meta}
              setFieldValue={form.setFieldValue}
              ref={ref}
          />
      )}
    </FastField>
);

const Component = forwardRef ((props, ref) => {
  const {
    label,
    name,
    type = "checkbox",
    style,
    className = "",
    value,
    isNoneValue,
    field,
    meta,
    disabled = false,
    setFieldValue,
    onChange,
    postOnChangeIntervene,
    checked,
    align = "end", // MUI default is "end"
    widthLabel,
    alignPosition = "flex-start",
    inputStyle,
    ... otherProps
  } = props;

  const handleChange = onChange
      ? onChange
      : ({target}) => {
        let newValue = value;

        if (
            (isNoneValue || typeof value !== "boolean" || value !== true) &&
            !target.checked
        ) {
          newValue = null;
        } else if (
            type === "checkbox" &&
            typeof value === "boolean" &&
            !target.checked
        ) {
          newValue = target.checked;
        }

        if (postOnChangeIntervene) {
          postOnChangeIntervene ();
        }

        setFieldValue (name, newValue);
      };

  const handleRadioClick = (e) => {
    if (isNoneValue && type === "radio" && field?.checked) {
      e.target.checked = false;
      handleChange (e);
    }
  };

  const isChecked =
      checked ||
      (type === "radio"? field?.checked : field?.value === value);

  const hasError = meta?.touched && meta?.error;

  const commonProps = {
    ... otherProps,
    disabled,
    checked:isChecked,
    onChange:!disabled? handleChange : undefined,
    onClick:type === "radio" && isNoneValue && !disabled? handleRadioClick : undefined,
    inputRef:ref,
    size:"small",
  };

  const control = type === "radio"? <Radio/> : <Checkbox/>;

  return (
      <FormGroup
          sx={{
            display:"flex",
            alignItems:"flex-start",
            justifyContent:alignPosition,
            height:"100%",
            ... style,
          }}
          className={className}
      >
        <StyledFormControlLabel
            className={disabled? "read-only" : ""}
            control={
              type === "radio"? (
                  <Radio {... commonProps} value={value}/>
              ) : (
                  <Checkbox {... commonProps} />
              )
            }
            label={label}
            labelPlacement={align === "left"? "start" : "end"}
            sx={{
              width:widthLabel,
              m:0,
              "& .MuiCheckbox-root, & .MuiRadio-root":{
                style:inputStyle,
              },
            }}
        />
        {hasError && (
            <FormHelperText error sx={{mt:0.5}}>
              {meta.error}
            </FormHelperText>
        )}
      </FormGroup>
  );
});

const shouldComponentUpdate = (nextProps, currentProps) => {
  const nextFormik = nextProps?.formik;
  const currentFormik = currentProps?.formik;

  return (
      nextProps?.options !== currentProps?.options ||
      nextProps?.value !== currentProps?.value ||
      nextProps?.onChange !== currentProps?.onChange ||
      nextProps?.disabled !== currentProps?.disabled ||
      Object.keys (nextProps).length !== Object.keys (currentProps).length ||
      getIn (nextFormik?.values, currentProps.name) !==
      getIn (currentFormik?.values, currentProps.name) ||
      getIn (nextFormik?.errors, currentProps.name) !==
      getIn (currentFormik?.errors, currentProps.name) ||
      getIn (nextFormik?.touched, currentProps.name) !==
      getIn (currentFormik?.touched, currentProps.name)
  );
};

export default memo (forwardRef (CommonCheckBox));