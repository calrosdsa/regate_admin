type UiState = {
    fetchLoading:boolean
    innerLoading:boolean
    loaded:boolean
    loaderDialog:boolean
    openSidebar:boolean
    ongoingDownloadProcess:number[]
    mode:'light' | 'dark'
}


export type {
    UiState
}