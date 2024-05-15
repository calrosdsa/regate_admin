import { IconButton, SxProps, Theme, Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

import { PlacesType } from "react-tooltip";
import { ReactNode } from "react";

export const TooltipIcon = ({
  title,children,sx
}: {
  title: string;
  sx?: SxProps<Theme>;
  children:ReactNode
}) => {
  return (
    <div className="flex space-x-1 items-center">
      {children}
    <Tooltip title={title} sx={sx}>
      <IconButton size="small">
      <InfoIcon fontSize="inherit"/>
      </IconButton>
    </Tooltip>
    </div>
  );
};

export const TooltipContainer = ({
  helpText,
  children = "",
  disabled = false,
}: {
  helpText: string;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <>{disabled ? <>{children}</> : <div title={helpText}>{children}</div>}</>
    // <Tooltip anchorSelect=".my-anchor-element" place="top">
    //   Hello world
    // </Tooltip>
  );
};
