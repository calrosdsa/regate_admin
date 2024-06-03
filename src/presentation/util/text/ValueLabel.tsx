import { Typography } from "@mui/material";

const ValueLabel = ({ value, label,className }: { value: string; label: string,className?:string }) => {
  return (
    <div className={className}>
      <Typography variant="body2" >{label}</Typography>
      <Typography variant="body2" fontSize={13}>
        {value}
      </Typography>
    </div>
  );
};

export default ValueLabel;
