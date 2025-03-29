import { useContext, useEffect } from 'react';
import { SocketContext } from '../context/SocketContext';

export const useSocketMapbox = (
    nuevoMarcador$,
    movimientoMarcador$,
    agregarMarcador,
    actualizarPosicion
) => {

    const { socket } = useContext(SocketContext);

    // Escuchar los marcadores existentes
    useEffect(() => {
        socket.on('marcadores-activos', (marcadores) => {
            for (const key of Object.keys(marcadores)) {
                agregarMarcador(marcadores[key], key);
            }
        });

    }, [agregarMarcador, socket]);


    // Nuevo marcador
    useEffect(() => {

        nuevoMarcador$.subscribe(marcador => {
            // nuevo marcador emitir
            socket.emit('marcador-nuevo', marcador);
        });

    }, [nuevoMarcador$, socket]);

    // Movimiento marcador
    useEffect(() => {
        movimientoMarcador$.subscribe(marcador => {
            socket.emit('marcador-actualizado', marcador);
        });

    }, [movimientoMarcador$, socket]);

    // mover marcador mediante sockets
    useEffect(() => {
        socket.on('marcador-actualizado', (marcador) => {
            actualizarPosicion(marcador);
        });

    }, [actualizarPosicion, socket]);


    // listen new markers
    useEffect(() => {

        socket.on('marcador-nuevo', (marcador) => {
            agregarMarcador(marcador, marcador.id);
        });

    }, [agregarMarcador, socket]);
    return {

    };
};
