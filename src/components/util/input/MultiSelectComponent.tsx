import { Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, Theme, Typography, useTheme } from "@mui/material"
import { useEffect, useState } from "react"


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


const MultiSelectComponent = ({options,label,allName,allValue,setInstalaciones,size="small"}:{
    options:SelectItem[]
    label?:string
    allValue:string
    allName:string
    size?:'small' | 'medium'
    setInstalaciones:(e:number[])=>void
}) =>{
    const theme = useTheme();
    const [values, setValues] = useState<string[]>([allValue]);
  
    const handleChange = (event: SelectChangeEvent<typeof values>) => {
      const {
          target: { value },
        } = event;
        const n = value as string[]
        console.log(value,(value.includes(allValue)&& value.length == 2))
        if(value.length > 1){
            const last = n[n.length -1]
            if(last == allValue){
                setValues([allValue])
                return
            }
        }
        if(value.includes(allValue)&& value.length > 2){
        setValues([allValue])
      }else{
          const f =  n.filter(item=>item != allValue)
          setValues(f);
        }
        };

    function getStyles(name: string, personName: readonly string[], theme: Theme) {
        return {
          fontWeight:
            personName.indexOf(name) === -1
              ? theme.typography.fontWeightRegular
              : theme.typography.fontWeightMedium,
        };
      }

    const getLabel = (value:string) :string=>{
        return options.find(item=>item.value == value)?.name || ""
    }

    useEffect(()=>{
        if(values.length>0){
            const n = values.map(item=>Number(item))
            setInstalaciones(n)
        }
    },[values])

    return(
        <div className="mt-3 w-full">
         {label != undefined &&
        <Typography variant="body2" sx={{mb:1}}>{label}</Typography>
            }
          <Select
            id="multiple-chip"
            size={size}
            multiple
            value={values}
            onChange={handleChange}
            input={<OutlinedInput id="select-multiple-chip"  />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={getLabel(value)} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {options.map((item,idx) => (
              <MenuItem
                key={idx}
                value={item.value}
                style={getStyles(item.value?.toString() as string, values, theme)}
              >
                {item.name}
              </MenuItem>
            ))}
          </Select>
      </div>
    )
}

export default MultiSelectComponent


// const [selected,setSelected] = useState<SelectItem[]>([{name:allName,value:allValue}])
//     const removeSelect = (value:string | undefined) =>{
//         const filterList = selected.filter(item=>item.value != value)
//         setSelected(filterList)
//     }
//     useEffect(()=>{
//         const ids = selected.map(item=>Number(item.value))
//         setInstalaciones(ids)
//     },[selected])


// <div className="mt-3 w-full">
// {label != undefined &&
//     <Typography variant="subtitle2">{label}</Typography>
// }
// {selected.length > 0 &&
// <div className="flex  space-x-2 mt-1 overflow-auto md:overflow-hidden md:flex-wrap md:space-x-0 md:gap-2 
// pb-1 md:pb-0 mb-2" >
//     {selected.map((item,idx)=>{
//         return(
//             <div key={idx} className="card whitespace-nowrap noSelect flex space-x-2">
//                 <span>{item.name}</span>
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
//                  className="w-6 h-6 icon-button noSelect" onClick={()=>removeSelect(item.value)}>
//                 <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
//                 </svg>

//             </div>
//         )
//     })}
// </div>
// }
// <FormControl sx={{minWidth:"100%",mt:1}}>
//     <InputLabel size="small" id={label}>{label}</InputLabel>
// <Select
// size="small"
// labelId={label}
// label={label}
// onChange={(e)=>{
//     const v = e.target.value
//     const item = options.find(t=>t.value == v)
//     if(item != undefined){
//     if(v == allValue){
//         setSelected([item])
//     }else{
//         const filterList = selected.filter(item=>item.value != allValue)
//             setSelected([...filterList,item])
//         }
//     }
//     console.log(e.target.value)
// }}
// >
//       {options
//         .filter(item=>!selected.map(t=>t.value).includes(item.value)).map((item,idx)=>{
//     return(
//         <MenuItem  key={idx} value={item.value}>{item.name}</MenuItem>
//         )
//     })}
// </Select>
// </FormControl>
// </div>