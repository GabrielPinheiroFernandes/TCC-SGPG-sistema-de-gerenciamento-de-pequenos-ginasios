import { TextField } from "@mui/material";
import React, { useState } from "react";

function InputText(props) {
  const [focused, setFocused] = useState(false);

  const isDateType = props.type === "date";

  return (
    <div style={{ flex: 1 }}>
      <TextField
        id={props.id}
        label={props.label}
        variant="outlined"
        type={props.type}
        onChange={props.onChange}
        value={props.value}
        className={props.className}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        InputLabelProps={{
          shrink: isDateType || !!props.value,  
        }}
        sx={{
          fontFamily: "'Koulen', sans-serif",
          width: "100%",
          ...(props.sx || {}),
          "& .MuiOutlinedInput-root": {
            fontFamily: "'Koulen', sans-serif",
            fontSize: "16px",
            paddingRight: "8px",
            color: focused ? "var(--primary-blue)" : "var(--black)",
            "& fieldset": {
              borderColor: focused ? "var(--primary-blue)" : "var(--black)",
            },
            "&:hover fieldset": {
              borderColor: "var(--primary-blue)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "var(--primary-blue)",
              borderWidth: "2px",
            },
          },
          "& .MuiInputLabel-root": {
            fontFamily: "'Koulen', sans-serif",
            fontSize: "14px",
            color: focused ? "var(--primary-blue)" : "var(--black)",
          },
        }}
      />
    </div>
  );
}

export default InputText;
