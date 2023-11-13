import './ItemCounter.css';
import { CarritoContext } from "../../context/CarritoContext";
import { useContext } from "react";


const ItemCounter = () => {
    const {cantidadTotal} = useContext(CarritoContext);

    return (
        <div id="cart-icon">
            <span id="cart-count">{cantidadTotal}</span>
        </div>
    );
};

export default ItemCounter;
