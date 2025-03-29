import { useCallback, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { v4 } from 'uuid';
import { Subject } from 'rxjs';

// api key
mapboxgl.accessToken = 'pk.eyJ1IjoiZmVkcmljayIsImEiOiJjbTh0YTB6dTcwN3FkMmlwZXZtN3J3NnVrIn0.r2IurgvYwWAvrKEiJdODDQ';


export const useMapbox = (puntoInicial) => {

    // referencia div del mapa
    const mapaDiv = useRef();
    const setRef = useCallback((node) => {
        mapaDiv.current = node;
    }, []);

    // referencia a los marcadores
    const marcadores = useRef({});

    // Observabls de Rxjs
    const movimientoMarcador = useRef(new Subject());
    const nuevoMarcador = useRef(new Subject());



    // mapa y coords
    const mapa = useRef();
    const [coords, setCoords] = useState(puntoInicial);

    // función para agregar marcadores
    const agregarMarcador = useCallback((ev, id) => {

        const { lng, lat } = ev.lngLat || ev;

        const marker = new mapboxgl.Marker();
        marker.id = id ?? v4();

        marker
            .setLngLat([lng, lat])
            .addTo(mapa.current)
            .setDraggable(true);

        marcadores.current[marker.id] = marker;

        if (!id) {
            nuevoMarcador.current.next({
                id: marker.id,
                lng,
                lat
            });
        }


        // escuchar movimientos del marcador
        marker.on('drag', ({ target }) => {
            const { id } = target;
            const { lng, lat } = target.getLngLat();

            movimientoMarcador.current.next({ id, lng, lat });
        });
    }, []);

    // función para actualizar la ubicación del marcador
    const actualizarPosicion = useCallback(({ id, lng, lat }) => {
        marcadores.current[id].setLngLat([lng, lat]);
    }, []);

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapaDiv.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [puntoInicial.lng, puntoInicial.lat],
            zoom: puntoInicial.zoom
        });
        mapa.current = map;
    }, [puntoInicial]);

    // cuando se mueve el mapa
    useEffect(() => {

        mapa.current?.on('move', () => {
            const { lng, lat } = mapa.current.getCenter();
            setCoords({
                lng: lng.toFixed(4),
                lat: lat.toFixed(4),
                zoom: mapa.current.getZoom().toFixed(2)
            });

        });

        // destruir listener
        // return mapa?.off('move');

    }, []);


    // Agregar marcadores cuando hago cliks
    useEffect(() => {
        mapa.current?.on('click', agregarMarcador);
    }, [agregarMarcador]);


    return {
        agregarMarcador,
        actualizarPosicion,
        coords,
        marcadores,
        nuevoMarcador$: nuevoMarcador.current,
        movimientoMarcador$: movimientoMarcador.current,
        setRef
    };
};
