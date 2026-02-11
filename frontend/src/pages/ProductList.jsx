import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useCart } from '../context/CartContext';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [message, setMessage] = useState('');
    const { addToCart: addToCartContext } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/products');
                setProducts(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchProducts();
    }, []);

    const addToCart = async (productId) => {
        try {
            await addToCartContext(productId, 1);
            setMessage('Added to cart!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Error adding to cart');
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Shop Products</h1>
            {message && <div className="fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded shadow">{message}</div>}
            <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                {products.map((product) => (
                    <div key={product.id} className="group relative bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
                        <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                            {product.image_url ? (
                                <img src={product.image_url} alt={product.name} className="w-full h-full object-center object-cover lg:w-full lg:h-full" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                            )}
                        </div>
                        <div className="mt-4 flex justify-between">
                            <div>
                                <h3 className="text-sm text-gray-700">
                                    <span aria-hidden="true" className="absolute inset-0" />
                                    {product.name}
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">{product.description}</p>
                            </div>
                            <p className="text-sm font-medium text-gray-900">${product.price}</p>
                        </div>
                        <div className="mt-4">
                            <button
                                onClick={(e) => {
                                    e.preventDefault(); // Prevent Link navigation if wrapped
                                    addToCart(product.id);
                                }}
                                className="z-10 relative w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
