import {createContext, useContext, useEffect, useState} from "react";
import { Product } from "@/constants/types";
import { dummyProducts } from "@/assets/assets";

export type CartItem = {
    id: string;
    productId: string;
    product: string;
    quantity: number;
    size: string;
    price: number;
}
type CartContextType = {
    cartItems: CartItem[];
    addToCart: (product: Product, size: string) => Promise<void>;
    removeFromCart: (itemId: string, size: string) => Promise<void>;
    updateQuantity: (itemId: string, quantity: number, size: string) => Promise<void>;
    clearCart: () => Promise<void>;
    cartTotal: number;
    itemCount: number;
    isLoding: boolean;
}
const CartContext = createContext<
CartContextType | undefined
>(undefined);

export function CartProvider({children}: {children: React.ReactNode}) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoding, setIsLoding] = useState(false);
    const [cartTotal, setCartTotal] = useState(0);

    const fetchCart = async () => {
        setIsLoding(true);
        const serverCartItems = dummyProducts;
        const mappedItems: CartItem[] = serverCartItems.map((item: any) => ({
            id: item._id,
            productId: item._id,
            product: item.product,
            quantity: item.quantity ?? 1,
            size: item.size || 'M',
            price: item.price,
        }));
        setCartItems(mappedItems);
        setCartTotal(mappedItems.reduce((total, item) => total + (item.price * item.quantity), 0));
        setIsLoding(false);
    };

    const addToCart = async (product: Product, size: string) => {

    };
    const removeFromCart = async (productId: string, size: string) => {

    };
    const updateQuantity = async (productId : string, quantity: number, size: string = 'M') => {

    };

    const clearCart = async () => {
        setCartItems([]);
        setCartTotal(0);
    };

    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

    useEffect(() => {
        fetchCart();
    }, []);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartTotal,
            itemCount,
            isLoding,
        }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}