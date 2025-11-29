import React from "react";
import { CircularProgress } from "@mui/material";

const Loading = () => {
  return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center">
        <CircularProgress/>
      </div>
  );
};

export default Loading;