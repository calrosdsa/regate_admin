import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Box, Typography } from '@mui/material';

export default function AutocompleteMui({
    options,loading,query,setQuery,onSelect,value,label
}:{
    options:UserEmpresa[]
    loading:boolean
    query:string
    setQuery:(e:string)=>void
    onSelect:(e:UserEmpresa | null)=>void
    value:UserEmpresa | null
    label?:string
}) {
  return (
    <div>
      {/* <div>{`value: ${value !== null ? `'${value}'` : 'null'}`}</div>
      <div>{`inputValue: '${inputValue}'`}</div>
      <br /> */}
      {label != undefined && 
      <Typography sx={{mb:1}} variant="body2">{label}*</Typography>
      }
      
      {/* <Autocomplete
        id="free-solo-demo"
        freeSolo
        options={options.map((option) => option.name)}
        renderInput={(params) => <TextField {...params} label="freeSolo" />}
      /> */}
      <Autocomplete
        size="small"
        freeSolo
        value={value}
        onChange={(event, newValue) => {
          onSelect(newValue as UserEmpresa)
        }}
        loading={loading}
        autoHighlight
        inputValue={query}
        getOptionLabel={(option: string | UserEmpresa) => (option as UserEmpresa).name}
        onInputChange={(event, newInputValue) => {
          setQuery(newInputValue);
        }}
        id="controllable-states-demo"
        options={options}
        sx={{ width: "100%" }}
        renderOption={(props, option) => (
            <Box component="li"  {...props}>
              {option.name}
            </Box>
          )}
        renderInput={(params) => <TextField  {...params} />}
      />
    </div>
  );
}
