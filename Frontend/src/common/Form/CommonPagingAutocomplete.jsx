import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { FastField, getIn } from "formik";
import { isEqual } from "lodash";
import React, { forwardRef, useEffect, useMemo, useState } from "react";
import { makeStyles } from "@mui/styles";

const PAGE_SIZE = 20;
let loading = false;

const useStyles = makeStyles (() => ({
  container:{
    "& .MuiAutocomplete-inputRoot":{
      paddingTop:"0px !important",
      paddingBottom:"0px !important",
    },
  },
  autoHeight:{
    "& > div":{
      height:"auto !important",
    },
  },
}));

const CommonPagingAutocomplete = (props, ref) => (
    <FastField {... props} name={props.name} shouldUpdate={shouldComponentUpdate}>
      {({field, meta, form}) => (
          <Component  {... props} field={field} meta={meta} setFieldValue={form.setFieldValue} ref={ref}/>
      )}
    </FastField>
);
const Component = forwardRef ((props, ref) => {
  const {
    disabled,
    fullWidth = true,
    name,
    variant = "outlined",
    size = "small",
    className = "",
    getOptionLabel,
    displayLabel = 'name',
    getOptionSelected,
    displaySelected = 'id',
    getOptionDisabled,
    noOptionsText = "Không có dữ liệu",
    includeNullOp,
    handleOnChange,
    value,
    api,
    searchObject,
    clearOptionOnClose,
    allowLoadOptions = true,
    field,
    meta,
    setFieldValue,
    label,
    sortOptions,
    displayData,
    sx,
    required,
    requiredLabel,
    disableTyping = false,
    disableClearable = false,
    multiple,
    fillerOptions,
    handleResponseApi,
    onFocus,
    displayValue,
    placeholder = "",
    checkLength = 0,
    searchField = "keyword",
    // Bật để tắt lọc client-side của MUI. Mặc định false để không ảnh hưởng chỗ cũ
    disableClientFilter = false,
    // Cho phép truyền custom filterOptions nếu muốn dùng lọc client-side tùy biến
    filterOptions:filterOptionsProp,
    // Prop mới: giữ mở dropdown khi chọn nhiều option
    keepOpenOnSelection = false,
    ... otherProps
  } = props;
  const [page, setPage] = useState (1);
  const [options, setOptions] = useState ([]);
  const [keyword, setKeyword] = useState ("");
  const [totalPage, setTotalPage] = React.useState (1);
  const [open, setOpen] = React.useState (false);
  const [t, setT] = React.useState ();
  const [isSelecting, setIsSelecting] = React.useState (false);
  const classes = useStyles ();
  useEffect (() => {
    if (!allowLoadOptions) {
      setOptions ([])
    }
  }, [allowLoadOptions]);

  useEffect (() => {
    if (open && allowLoadOptions && !isSelecting) {
      if (checkLength) {
        // check độ dài
        if (keyword && keyword?.trim ()?.length >= checkLength) {
          getData ();
        }
      } else {
        getData ();
      }
    }
  }, [keyword, open, searchObject]);

  // Reset isSelecting flag sau khi component re-render
  useEffect (() => {
    if (isSelecting) {
      const timer = setTimeout (() => setIsSelecting (false), 100);
      return () => clearTimeout (timer);
    }
  }, [isSelecting]);

  const loadData = async (obj, first) => {
    if (!api) {
      return;
    }
    try {
      loading = true;
      const {data} = await api ({pageSize:PAGE_SIZE, ... searchObject, ... obj, [searchField]:keyword || "",});
      if (data?.data?.content?.length > 0) {
        let newOptions = [... (!first? options : []), ... data.data.content];
        if (sortOptions) {
          newOptions = sortOptions (newOptions);
        }

        if (fillerOptions) {
          newOptions = newOptions.filter (fillerOptions);
        }

        setOptions (newOptions);
        setTotalPage (data.data.totalPages);
      } else {
        setOptions ([]);
        setTotalPage (0);
      }
    } catch (error) {
      console.error (error)
    } finally {
      loading = false;
    }
  }
  const getData = () => {
    let newPage = 1;
    setPage (newPage);
    loadData ({pageIndex:newPage}, true)
  };

  const loadMoreResults = async () => {
    const nextPage = page + 1;
    setPage (nextPage);
    loadData ({pageIndex:nextPage})
  };

  const handleScroll = (event) => {
    if (loading) {
      return;
    }
    const listboxNode = event.currentTarget;

    const position = listboxNode.scrollTop + listboxNode.clientHeight;
    if (listboxNode.scrollHeight - position <= 2 && page < totalPage) {
      loadMoreResults ();
    }
  };

  const onOpen = () => {
    setKeyword ("");
    setOpen (true);
  };

  const onClose = (event, reason) => {
    // Nếu keepOpenOnSelection = true và multiple = true,
    // không đóng dropdown khi chọn option
    if (keepOpenOnSelection && multiple && reason === 'selectOption') {
      return;
    }

    setOpen (false);
    if (clearOptionOnClose) {
      setOptions ([]);
      setTotalPage (1);
    }
  };

  const handleChangeText = (value) => {
    if (t) {
      clearTimeout (t);
    }
    setT (setTimeout (() => setKeyword (value), 500));
  };
  const getOptionLabelDefault = useMemo (() => getOptionLabel
      ? getOptionLabel
      : (option) => {
        if (!option || typeof option[displayLabel] !== 'string') {
          return "---";
        }
        return option[displayLabel];
      }, [getOptionLabel, displayLabel]);

  const getOptionSelectedDefault = useMemo (() => (
      getOptionSelected? getOptionSelected : (option, value) => {
        if (!value) {
          return false;
        }
        return getIn (option, displaySelected) === getIn (value, displaySelected);
      }
  ), [getOptionSelected]);

  const handleChangeInner = handleOnChange
      ? (_, value) => handleOnChange (value)
      : (_, value) => {
        setIsSelecting (true);
        setFieldValue (name, value? value : null);
        setIsSelecting (false);
      };

  return (
      <Autocomplete
          {... field}
          {... otherProps}
          ref={ref}
          id={name}
          name={name}
          disabled={disabled}
          fullWidth={fullWidth}
          multiple={multiple}
          size={size || undefined}
          filterSelectedOptions
          variant={variant}
          value={value || (field?.value ?? (multiple? [] : null))}
          onChange={handleChangeInner}
          options={useMemo (() => includeNullOp? [null, ... options] : options, [includeNullOp, options])}
          getOptionLabel={getOptionLabelDefault}
          isOptionEqualToValue={getOptionSelectedDefault}
          getOptionDisabled={getOptionDisabled}
          noOptionsText={noOptionsText}
          onOpen={onOpen}
          open={open}
          onClose={onClose}
          autoHighlight
          openOnFocus
          disableClearable={disableClearable}
          // Thêm disableCloseOnSelect để kiểm soát việc đóng dropdown
          disableCloseOnSelect={keepOpenOnSelection && multiple}
          {... (disableClientFilter
              ? {filterOptions:(opts) => opts}
              : (filterOptionsProp? {filterOptions:filterOptionsProp} : {}))}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.stopPropagation ();
              event.preventDefault ();
            }
            return true;
          }}
          onInputChange={(event) => handleChangeText (event?.target?.value)}
          renderInput={(params) => (
              <>
                {label && (
                    <label htmlFor={name} className={"label-container"}>
                      {label}
                      {required && <span style={{color:"red"}}> * </span>}
                    </label>
                )}
                <TextField
                    {... params}
                    variant={otherProps?.variant || "outlined"}
                    inputProps={{
                      ... params.inputProps,
                      autoComplete:"off",
                      style:disabled
                          ? {
                            ... params.inputProps.style,
                            color:"rgba(0, 0, 0, 0.87)",
                            cursor:"text",
                            opacity:1,
                          }
                          : params.inputProps.style,
                    }}
                    InputProps={{
                      ... params.InputProps,
                      style:disabled
                          ? {
                            ... params.InputProps.style,
                            color:"rgba(0, 0, 0, 0.87)",
                            backgroundColor:"rgba(0, 0, 0, 0.02)",
                            opacity:1,
                          }
                          : params.InputProps.style,
                    }}
                    className={`${classes.autoHeight} ${disabled? "read-only" : ""}`}
                    error={meta && meta.touched && meta.error}
                    helperText={meta && meta.touched && meta.error? meta.error : ""}
                />
              </>
          )}
          ListboxProps={{
            onScroll:handleScroll,
          }}
      />
  );
})

const shouldComponentUpdate = (nextProps, currentProps) => (
    nextProps.name !== currentProps.name ||
    nextProps.value !== currentProps.value ||
    nextProps.handleChange !== currentProps.handleChange ||
    nextProps.label !== currentProps.label ||
    nextProps.required !== currentProps.required ||
    nextProps.api !== currentProps.api ||
    nextProps.disabled !== currentProps.disabled ||
    nextProps.keepOpenOnSelection !== currentProps.keepOpenOnSelection ||
    !isEqual (nextProps.searchObject, currentProps.searchObject) ||
    nextProps.formik.isSubmitting !== currentProps.formik.isSubmitting ||
    Object.keys (nextProps).length !== Object.keys (currentProps).length ||
    getIn (nextProps.formik.values, currentProps.name) !== getIn (currentProps.formik.values, currentProps.name) ||
    getIn (nextProps.formik.errors, currentProps.name) !== getIn (currentProps.formik.errors, currentProps.name) ||
    getIn (nextProps.formik.touched, currentProps.name) !== getIn (currentProps.formik.touched, currentProps.name)
);

export default React.memo (CommonPagingAutocomplete);
