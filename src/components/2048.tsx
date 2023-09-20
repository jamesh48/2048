import * as React from "react";
import { Box } from "@mui/material";
import Board from "./Board";

const TwentyFourtyEight = () => {
  return (
    <Box
      sx={{
        backgroundColor: "rgb(31, 33, 36)",
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "&:nth:child(1)": {
          flexDirection: "column",
          alignItems: "center",
        },
        "&:last-child": {
          flexDirection: "column",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
        }}
      >
        <Board />
      </Box>
    </Box>
  );
};

export default TwentyFourtyEight;
