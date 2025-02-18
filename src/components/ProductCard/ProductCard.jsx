import { Col } from "react-bootstrap";
import "./product-card.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addToCart } from "../../app/features/cart/cartSlice";
import "react-toastify/dist/ReactToastify.css";
import { Star } from "lucide-react";

const ProductCard = ({ productItem }) => {
  const dispatch = useDispatch();
  const router = useNavigate();

  const handleClick = () => router(`/shop/${productItem.id}`);

  const handleAdd = () => {
    dispatch(addToCart({ product: productItem, num: 1 }));
    toast.success("Product has been added to cart!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progressStyle: { background: "green" },
      className: "custom-toast",
    });
  };

  // Calculate discount dynamically
  const discount =
    productItem.originalPrice > productItem.price
      ? Math.round(
          ((productItem.originalPrice - productItem.price) /
            productItem.originalPrice) *
            100
        )
      : 0;

  return (
    <Col md={3} sm={5} xs={10} className="product-card">
      {/* Product Image Section */}
      <div className="product-image" onClick={handleClick}>
        <img
          loading="lazy"
          src={productItem.imgUrl}
          alt={productItem.productName}
          className="product-img"
        />
        {/* Show Discount Badge if there is a discount */}
        {discount > 0 && <span className="discount-badge">{discount}% OFF</span>}
      </div>

      {/* Product Details */}
      <div className="product-details">
        <h3 className="product-title" onClick={handleClick}>
          {productItem.productName}
        </h3>

        {/* Star Ratings */}
        <div className="product-rating">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className={`star-icon ${
                index < productItem.rating ? "text-yellow-500" : "text-gray-300"
              }`}
              fill={index < productItem.rating ? "currentColor" : "none"}
            />
          ))}
          <span className="rating-value">({productItem.reviews.length} Reviews)</span>
        </div>

        {/* Price Section */}
        <div className="product-price">
          <h4 className="current-price">₹{productItem.price}</h4>
          <span className="original-price">₹{productItem.originalPrice}</span>
        </div>

        {/* Add to Cart Button */}
        <button className="add-to-cart-btn" onClick={handleAdd}>
          Add to Cart
        </button>
      </div>

      <ToastContainer />
    </Col>
  );
};

export default ProductCard;
