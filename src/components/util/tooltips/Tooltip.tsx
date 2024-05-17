import { Box, IconButton, SxProps, Theme, Tooltip, TooltipProps, styled, tooltipClasses } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

import { PlacesType } from "react-tooltip";
import { ReactNode } from "react";

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
  },
}));

export const TooltipIcon = ({
  title,children,sx
}: {
  title: ReactNode;
  sx?: SxProps<Theme>;
  children:ReactNode
}) => {
  return (
    <Box className="flex space-x-1 items-center " sx={sx}>
      {children}
    <HtmlTooltip title={title}>
      <IconButton size="small">
      <InfoIcon fontSize="inherit"/>
      </IconButton>
    </HtmlTooltip>
    </Box>
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
