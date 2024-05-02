import Script from 'next/script';
import '../../style/mapbox.css'
import { ChangeEvent, Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { MB_API_KEY } from '@/context/config';
import { getPlaces } from '@/core/repository/establecimiento';
import Input from 'postcss/lib/input';
import InputWithIcon from '../util/input/InputWithIcon';
import ButtonWithLoader from '../util/button/ButtonWithLoader';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export const MapComponent = ({open,close,loaded,setLoaded,lng,lat,address,setAddress,update}:{
    open:boolean
    close:()=>void
    loaded:boolean
    setLoaded:(b:boolean)=>void
    lng:number
    lat:number
    address:string
    setAddress:(e:string)=>void
    update:(lng:string,lat:string,address:string,setLoading:(bool:boolean)=>void)=>void
})=>{
    // const [place,setPlace] = useState<Place | null>(null)
    const [adress,setAdress] = useState(address)
    const [longitud,setLongitud] = useState(lng.toString())
    const [latitud,setLatitud] = useState(lat.toString())
    const [loading,setLoading] = useState(false)
    const onChange = (e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
        setAdress(e.target.value)
    }
    const setData = async(lng:any,lat:any)=>{
        try{
            const data:Place =await getPlaces(lng,lat)
            setAdress(data.features[0].place_name)
            setAddress(data.features[0].place_name)
            setLatitud(lat)
            setLongitud(lng)
            // setPlace(data)
        }catch(e){
        }
    }

    useEffect(()=>{
      // if(mapboxgl != undefined) return
      // let mapboxgl:any = undefined
        if(loaded){
            mapboxgl.accessToken = MB_API_KEY;
            const map = new mapboxgl.Map({  
            container: 'map', // container ID
            style: 'mapbox://styles/mapbox/streets-v12', // style URL
            center: [lng,lat], // starting position [lng, lat]
            zoom: 12 // starting zoom
        });
        // map.addControl(
        //     new MapboxGeocoder({
        //         accessToken: mapboxgl.accessToken,
        //         mapboxgl: mapboxgl
        //     })
        // );
        map.addControl(new mapboxgl.NavigationControl());
        const marker = new mapboxgl.Marker({
            color: "#fa3232",
             draggable: true
        })
            .setLngLat([lng,lat]) // [lng, lat] coordinates to place the marker at
            .addTo(map); 
            map.on('style.load', function() {
            map.on('click', function(e:any) {
                console.log("EVENT",e)
                const {lng , lat} = e.lngLat
                marker.setLngLat([lng, lat])
                setData(lng,lat)
            });
        })
        const onDragEnd = async() => {
            const {lng , lat} = marker.getLngLat();
            console.log(lng,lat)
            setData(lng,lat)
        }     
        marker.on('dragend', onDragEnd);
    }
    },[loaded])

    return(        
        <>
        <Script  id="scriptAfterInteractive"  src="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js"
        onError={()=>{
            console.log("error")
        }}
        onLoad={()=>{
          setLoaded(true)
        }}/>
        <Script src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v5.0.0/mapbox-gl-geocoder.min.js" />

<Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={close}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
    
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white h-screen
                 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    
                     </Dialog.Title>
              <div id="map"></div>   
              {/* {JSON.stringify(place?.query)} */}
              {/* {place != null && */}
              <div className='px-2 xl:px-20 grid gap-y-4'>
              <InputWithIcon
              value={adress}
              onChange={onChange}
              name='address'
              label='Adress'
              Icon={LocationOnIcon}
            />
            <ButtonWithLoader
              title='Guardar Ubicación'
              loading={loading}
              onClick={()=>{
                if(adress != ""){
                  update(longitud,latitud,adress,(bool:boolean)=>setLoading(bool))
                }
              }}
            />
            </div>
        {/* } */}
                     
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
        {/* <DialogLayout open={open} close={close}>
        </DialogLayout> */}
        </>
    )
}
