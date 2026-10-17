import {createContext, useContext, useEffect, useState} from "react";
import { Product, WishlistContextType } from "@/constants/types";
import { dummyProducts } from "@/assets/assets";

const WishListContext = createContext<
WishlistContextType | undefined
>(undefined);

export function WishListProvider({children}: {children: React.ReactNode}) {

    const [wishlist, setWishlist] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchWishList = async () => {
        setLoading(true);
        setWishlist(dummyProducts);
        setLoading(false);
    }

    const toggleWishlist = async (product: Product) => {
        const exists = wishlist.find(item => item._id === product._id);
        setWishlist(prev => {
            if (exists) {
                return prev.filter(item => item._id !== product._id);
            } else {
                return [...prev, product];
            }
        });
    };
    const isInWishlist = (productId: string) => {
        return wishlist.some(item => item._id === productId);
    }

    useEffect(() => {
        fetchWishList();
    }, []);

    return (
        <WishListContext.Provider value={{
            wishlist,
            loading,
            toggleWishlist,
            isInWishlist
        }}>
            {children}
        </WishListContext.Provider>
    )
}

export function useWishList() {
    const context = useContext(WishListContext);
    if (!context) {
        throw new Error("useWishList must be used within a WishListProvider");
    }
    return context;
}