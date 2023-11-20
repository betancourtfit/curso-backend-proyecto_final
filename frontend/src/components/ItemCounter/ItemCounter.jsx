import './ItemCounter.css';
import { useContext } from "react";
import { AuthContext } from '../../context/AuthContext';


const ItemCounter = () => {
    const { totalQuantity } = useContext(AuthContext);
    console.log('quantity', totalQuantity);

    return (
        <div id="cart-icon">
            <span id="cart-count">{totalQuantity}</span>
        </div>
    );
};

export default ItemCounter;
