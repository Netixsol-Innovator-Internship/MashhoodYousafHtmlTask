import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://ecommerce-back-end-kohl.vercel.app/api/products/${id}`
        );

        if (res.data.success) {
          setProduct(res.data.data);
          if (res.data.data.variants && res.data.data.variants.length > 0) {
            setSelectedVariant(res.data.data.variants[0]);
          }
        } else {
          setError("Product not found");
        }
      } catch (err) {
        setError("Failed to fetch product details");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToBag = () => {
    if (!product) return;
    
    console.log("Added to bag:", {
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity,
      variant: selectedVariant,
      image: product.image
    });
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;
  if (!product) return <div className="text-center py-8">Product not found</div>;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-gray-600 hover:text-gray-800 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Products
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Product Image */}
          <div className="lg:w-1/2">
            <div className="bg-gray-50 p-8 rounded-lg">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-auto max-h-96 object-contain"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:w-1/2">
            <div className="space-y-6">
              {/* Product Title */}
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              
              {/* Description */}
              <p className="text-gray-600">{product.description}</p>
              
              {/* Product Meta */}
              <div className="space-y-1">
                {product.origin && (
                  <p className="text-gray-600">- Origin: {product.origin}</p>
                )}
                {product.organic && (
                  <p className="text-gray-600">- Organic</p>
                )}
                {product.vegan && (
                  <p className="text-gray-600">- Vegan</p>
                )}
              </div>
              
              {/* Price */}
              <p className="text-2xl font-bold text-gray-900">€{product.price}</p>
              
              {/* Variants */}
              <div>
                <h2 className="text-lg font-semibold mb-2">Variants</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {product.variants?.map((variant) => (
                    <button
                      key={variant}
                      onClick={() => setSelectedVariant(variant)}
                      className={`py-2 px-3 border rounded text-sm ${
                        selectedVariant === variant
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {variant}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Divider */}
              <div className="border-t border-gray-200 my-4"></div>
              
              {/* Quantity and Add to Bag */}
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-1">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToBag}
                  className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors font-medium"
                >
                  ADD TO BAG
                </button>
              </div>
              
              {/* Divider */}
              <div className="border-t border-gray-200 my-4"></div>
              
              {/* Steeping Instructions */}
              <div>
                <h2 className="text-lg font-semibold mb-2">Steeping instructions</h2>
                <ul className="space-y-1 text-gray-600">
                  <li>- SERVING SIZE: 2 tsp per cup, 6 tsp per pot</li>
                  <li>- WATER TEMPERATURE: 100°C</li>
                  <li>- STEEPING TIME: 3 - 5 minutes</li>
                  <li>- COLOR AFTER 3 MINUTES</li>
                </ul>
              </div>
              
              {/* Divider */}
              <div className="border-t border-gray-200 my-4"></div>
              
              {/* About this tea */}
              <div>
                <h2 className="text-lg font-semibold mb-2">About this tea</h2>
                <div className="grid grid-cols-2 gap-4 text-gray-600">
                  <div>
                    <p className="font-medium">FLAVOR</p>
                    <p>Spicy</p>
                  </div>
                  <div>
                    <p className="font-medium">QUALITIES</p>
                    <p>Soothing</p>
                  </div>
                  <div>
                    <p className="font-medium">CAFFEINE</p>
                    <p>Medium</p>
                  </div>
                  <div>
                    <p className="font-medium">ALLERGENS</p>
                    <p>Nut-free</p>
                  </div>
                </div>
              </div>
              
              {/* Divider */}
              <div className="border-t border-gray-200 my-4"></div>
              
              {/* Ingredients */}
              <div>
                <h2 className="text-lg font-semibold mb-2">Ingredients</h2>
                <p className="text-gray-600">
                  Black tea, Green tea, Ginger root, Cloves, Black pepper, Cinnamon sticks, Cardamom, Cinnamon pieces.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;