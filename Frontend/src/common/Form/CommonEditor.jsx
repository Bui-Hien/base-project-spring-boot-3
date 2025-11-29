import React, { useCallback, useMemo, useRef, useEffect } from "react";
import { FastField } from "formik";
import ReactQuill, { Quill } from "react-quill-new";
import "quill/dist/quill.snow.css";
import { saveFilePublic } from "../../service/FileDescriptionService";
import { FormControl, FormHelperText, FormLabel } from "@mui/material";
import { API_ENDPOINT } from "../../appConfig";

import ImageResize from "quill-image-resize-module--fix-imports-error";

Quill.register ("modules/imageResize", ImageResize);

const CommonEditor = React.memo (({name, label, disabled = false, minHeight = 500, ... props}) => {
  return (
      <FastField name={name}>
        {({field, form, meta}) => (
            <MyEditor
                {... props}
                field={field}
                meta={meta}
                setFieldValue={form.setFieldValue}
                name={name}
                label={label}
                disabled={disabled}
            />
        )}
      </FastField>
  );
});

// Editor thực sự
const MyEditor = React.memo (
    ({field, setFieldValue, meta, disabled, label, minHeight, ... props}) => {
      const quillRef = useRef (null);
      useEffect(() => {
        const quill = quillRef.current?.getEditor();
        if (!quill) return;

        quill.root.addEventListener("paste", async (e) => {
          const clipboardData = e.clipboardData;
          if (!clipboardData) return;

          const items = clipboardData.items;
          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.type.indexOf("image") !== -1) {
              e.preventDefault();
              const file = item.getAsFile();
              if (!file) return;

              // Upload file lên server
              const response = await saveFilePublic(file);
              const url = `${API_ENDPOINT}/api/file-description/public/${response?.data?.data?.id}`;

              // Chèn lại ảnh bằng URL public thay vì base64
              const range = quill.getSelection(true);
              quill.insertEmbed(range.index, "image", url);
              quill.setSelection(range.index + 1);
              setFieldValue(field.name, quill.root.innerHTML);
            }
          }
        });
      }, [setFieldValue, field.name]);

      // Custom handler upload ảnh - useCallback để tránh re-create function
      const handleImage = useCallback (async () => {
        if (disabled) return;

        const input = document.createElement ("input");
        input.type = "file";
        input.accept = "image/*";
        input.click ();

        input.onchange = async () => {
          const file = input.files?.[0];
          if (!file) return;

          try {
            const response = await saveFilePublic (file);
            const publicUrl = `${API_ENDPOINT}/api/file-description/public/${response?.data?.data?.id}`;
            const editor = quillRef.current?.getEditor ();
            if (editor) {
              const range = editor.getSelection (true);
              editor.insertEmbed (range.index, "image", publicUrl);
              editor.setSelection (range.index + 1);

              setFieldValue (field.name, editor.root.innerHTML);
            }
          } catch (err) {
            console.error ("Upload failed", err);
          }
        };
      }, [disabled, setFieldValue, field.name]);

      // useCallback cho handleChange để tránh re-create
      const handleChange = useCallback ((content, delta, source, editor) => {
        if (!disabled && source !== 'silent') {
          const html = editor?.root?.innerHTML || content || "";
          setFieldValue (field.name, html);
        }
      }, [disabled, setFieldValue, field.name]);

      // Memoize modules config để tránh re-create object
      const modules = useMemo (() => ({
        toolbar:{
          container:[
            [{header:[1, 2, 3, 4, 5, false]}],
            ["bold", "italic", "underline", "strike"],
            [{align:[]}],
            [{list:"ordered"}, {list:"bullet"}],
            [{indent:"-1"}, {indent:"+1"}],
            ["link", "image", "video"],
            ["clean"],
          ],
          handlers:{
            image:handleImage,
          },
        },
        imageResize:{
          parchment:Quill.import ("parchment"),
          modules:["Resize", "DisplaySize", "Toolbar"],
          // Thêm config để tránh trigger onChange liên tục
          handleStyles:{
            backgroundColor:'black',
            border:'none',
            color:'white'
          },
          // Tối ưu performance khi resize
          displaySize:true
        },
      }), [handleImage]);

      // Memoize formats
      const formats = useMemo (() => [
        'header', 'bold', 'italic', 'underline', 'strike',
        'align', 'list', 'indent', 'link', 'image', 'video'
      ], []);

      return (
          <FormControl
              error={Boolean (meta?.touched && meta?.error)}
              className={disabled? "read-only w-full" : "w-full"}
          >
            {label && <FormLabel className="mr-12">{label}</FormLabel>}
            <ReactQuill
                ref={quillRef}
                theme="snow"
                value={field?.value}
                modules={modules}
                formats={formats}
                disabled={disabled}
                onChange={handleChange}
                preserveWhitespace={true}
                placeholder={"Viết bài ở đây..."}
                {... props}
            />
            {meta?.touched && meta?.error && (
                <FormHelperText>{meta?.error}</FormHelperText>
            )}
          </FormControl>
      );
    },
    (prevProps, nextProps) => {
      // Improved comparison function
      return (
          prevProps.field.value === nextProps.field.value &&
          prevProps.meta.error === nextProps.meta.error &&
          prevProps.meta.touched === nextProps.meta.touched &&
          prevProps.disabled === nextProps.disabled &&
          prevProps.label === nextProps.label
      );
    }
);

export default CommonEditor;