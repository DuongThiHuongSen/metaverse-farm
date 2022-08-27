import React, { FC, ReactNode, memo } from "react";
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from "@mui/material";

type ButtonProps = MuiButtonProps & {
  children: ReactNode | string;
  handleClick?: () => void | undefined;
};

const Button: FC<ButtonProps> = (props) => {
  const { children, handleClick, ...rest } = props;
  return (
    <MuiButton onClick={handleClick} {...rest}>
      {children}
    </MuiButton>
  );
};

export default memo(Button);

export const CONNECT_BUTTON_CLASS = "connectButton";
