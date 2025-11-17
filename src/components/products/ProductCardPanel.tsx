'use client'
import {useReducer, useState} from "react";
import ProductCard from "./ProductCard";
import { useRef } from "react";

type RatingAction = {
    type: 'update' | 'remove';
    productName: string;
    rating?: number;
};

export default function ProductCardPanel() {

    const countRef = useRef(0);
    const inputRef = useRef<HTMLInputElement>(null);
    // Separate state for ProductCard ratings (persistent)
    const [cardRatings, setCardRatings] = useState<Map<string, number>>(new Map([
        ["The Bloom Pavilion", 0],
        ["Spark Space", 0],
        ["The Grand Table", 0]
    ]));

    // Separate state for list display (can be removed)
    const initialListRatings = new Map<string, number>([
        ["The Bloom Pavilion", 0],
        ["Spark Space", 0],
        ["The Grand Table", 0]
    ]);

    const listReducer = (listRatings: Map<string, number>, action: RatingAction) => {
        const newListRatings = new Map(listRatings);
        switch(action.type) {
            case "update":
                if (action.rating !== undefined) {
                    newListRatings.set(action.productName, action.rating);
                }
                return newListRatings;
            case "remove":
                newListRatings.delete(action.productName);
                return newListRatings;
            default:
                return listRatings;
        }
    }

    const [listRatings, dispatchList] = useReducer(listReducer, initialListRatings);

    const handleRatingChange = (productName: string, rating: number) => {
        // Update both ProductCard ratings and list ratings
        setCardRatings(prev => new Map(prev.set(productName, rating)));
        dispatchList({ type: "update", productName, rating });
    };

    const handleRemoveProduct = (productName: string) => {
        // Only remove from list, keep ProductCard rating
        dispatchList({ type: "remove", productName });
    };
    // Mock Data for Demonstration Only
    const mockProductRepo = [
        { pid: "001", name: "The Bloom Pavilion", image: "/img/bloom.jpg"},
        { pid: "002", name: "Spark Space", image: "/img/sparkspace.jpg" },
        { pid: "003", name: "The Grand Table", image: "/img/grandtable.jpg"},
    ]

    return (
        <div className="m-5">
            <div className="m-5 flex flex-row flex-wrap justify-around items-center">
                {
                    mockProductRepo.map((productItem)=>(
                        <div key={productItem.pid} className="w-1/4">
                            <ProductCard 
                                productId={productItem.pid}
                                productName={productItem.name}
                                productImage={productItem.image}
                                isAdmin={false}
                                deleteProductAction={async () => {}}
                                onRatingChange={handleRatingChange}
                                initialRating={cardRatings.get(productItem.name)}
                            />
                        </div>
                    ))
                }
            </div>
            <div className="w-full text-xl font-medium ">Product List with Ratings: {listRatings.size}</div>
            {Array.from(listRatings.entries()).map(([product, rating]) => (
                <div 
                    key={product} 
                    data-testid={product}
                    onClick={() => handleRemoveProduct(product)}
                    className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                >
                    {product} Rating: {rating}
                </div>
            ))}
        </div>
    )
}

