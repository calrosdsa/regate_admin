

type InfoText = {
	id:number
	title:string
	content:string
}

type InfoTextContent = {
	data:InfoTextItem[]
}

type InfoTextItem = {
	subtitle:string
	content:string
}

type SystemState = {
	infoText?:InfoText
	openInfoBar:boolean
	loadingInfoText:boolean
}