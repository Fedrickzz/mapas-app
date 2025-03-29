import { useMapbox } from '../hooks/useMapbox';
import { useSocketMapbox } from '../hooks/useSocketMapbox';


const puntoInicial = {
    lng: 2.1639,
    lat: 41.4091,
    zoom: 15
};

export const MapaPage = () => {

    const {
        setRef,
        coords,
        nuevoMarcador$,
        movimientoMarcador$,
        agregarMarcador,
        actualizarPosicion
    } = useMapbox(puntoInicial);

    useSocketMapbox(
        nuevoMarcador$,
        movimientoMarcador$,
        agregarMarcador,
        actualizarPosicion
    );


    return (
        <>
            <div className='info'>
                lng: {coords.lng} | lat: {coords.lat} | zoom: {coords.zoom}
            </div>
            <div
                ref={setRef}
                className='mapContainer'
            />
        </>
    );
};
