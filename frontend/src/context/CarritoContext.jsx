import { useState, createContext } from 'react'

export const CarritoContext = createContext({
    carrito:[],
    total:0,
    cantidadTotal:0

})
// Ignoro la siguiente linea con eslint
// eslint-disable-next-line react/prop-types
export const CarritoProvider = ({children}) => {
    const [carrito, setCarrito] = useState([]);
    const [total, setTotal] = useState(0);
    const [cantidadTotal, setCantidadTotal] = useState(0);

    console.log(carrito);
//  FUNCION PARA AGREGAR
    const agregarProducto = (item, cantidad) => {
        const productoExistente = carrito.find(prod => prod.item.id === item.id);

        if(!productoExistente){
            setCarrito(prev => [...prev, {item, cantidad}]);
            setCantidadTotal(prev => prev + cantidad);
            setTotal(prev => prev + (item.precio * cantidad));
        } else{
            const carritoActualizado = carrito.map( prod => {
                if(prod.item.id === item.id) {
                    return {...prod, cantidad: prod.cantidad + cantidad}
                } else{
                    return prod;
                }
            });
            setCarrito(carritoActualizado);
            setCantidadTotal(prev => prev + cantidad);
            setTotal(()=> (item.precio * cantidad));
        }
    }
    // FUNCION PARA ELIMINAR 
    const eliminarProducto = (id) =>{
        const productoEliminado = carrito.find(prod => prod.item.id === id);
        const carritoActualizado = carrito.filter( prod => prod.item.id !== id);
        setCarrito(carritoActualizado);
        console.log("Carrito Actualizado:")
        console.log(carritoActualizado)
        console.log(carrito)
        setCantidadTotal(prev => prev - productoEliminado.cantidad);
        console.log("Cantidad actualizada:")
        console.log(cantidadTotal)
        setTotal(prev => prev - (productoEliminado.item.precio * productoEliminado.cantidad));
        console.log("Total actualizado:")
        console.log(total)
    }

    const vaciarCarrito = () => {
        setCarrito([]);
        setCantidadTotal(0);
        setTotal(0);
    }

    return (
        <CarritoContext.Provider value={{carrito, total, cantidadTotal, agregarProducto, eliminarProducto, vaciarCarrito}}>
            {children}
        </CarritoContext.Provider>
    )
}