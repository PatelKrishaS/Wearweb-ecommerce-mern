import { createContext } from "react";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const delivery_fee = 10;

    const value = {
        delivery_fee
    }

    return(
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;