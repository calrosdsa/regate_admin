export async function SearchUsersEmpresa(query:string) {
    const res = await fetch(`../../api/users/empresa?query=${query}`)
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
    return res.json()
  }
