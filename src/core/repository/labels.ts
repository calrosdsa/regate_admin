import { API_URL } from "@/context/config"

export async function GetAmenities(){
    const res = await fetch(`../../api/labels/amenities`)
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
     
    //   console.log(res)
      return res.json()
}

export async function GetRules(){
    const res = await fetch(`../../api/labels/rules`)
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
     
    //   console.log(res)
      return res.json()
}

export async function GetCategories(){
  const res = await fetch(`../../api/labels/amenities`)
  if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
   
  //   console.log(res)
    return res.json()
}

export async function GetAmenitiesEstablecimiento(id:number){
  const res = await fetch(`../../api/establecimiento/amenities/?id=${id}`)
  if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
   
  //   console.log(res)
    return res.json()
}

export async function GetRulesEstablecimiento(id:number){
  const res = await fetch(`../../api/establecimiento/rules/?id=${id}`)
  if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
   
  //   console.log(res)
    return res.json()
}


export async function AddAmenities(data:LabelRequest){
    const res = await fetch(`../../api/establecimiento/amenities/add`,{
        method:'POST',
        body:JSON.stringify(data)
    })
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
      return res.json()
}

export async function DeleteAmenities(data:LabelRequest){
    const res = await fetch(`../../api/establecimiento/amenities/delete`,{
        method:'POST',
        body:JSON.stringify(data)
    })
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
      return res.json()
}

export async function AddRules(data:LabelRequest){
    const res = await fetch(`../../api/establecimiento/rules/add`,{
        method:'POST',
        body:JSON.stringify(data)
    })
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
      return res.json()
}
export async function DeleteRules(data:LabelRequest){
    const res = await fetch(`../../api/establecimiento/rules/delete`,{
        method:'POST',
        body:JSON.stringify(data)
    })
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
      return res.json()
}
