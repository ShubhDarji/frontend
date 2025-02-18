import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../../app/features/cart/cartSlice";
import "./product-details.css";

const ProductDetails = ({ selectedProduct }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);

  // Ensure quantity is always at least 1
  const handleQuantityChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setQuantity(value);
  };

  // Handle Add to Cart
  const handleAdd = () => {
    if (!selectedProduct) {
      toast.error("Product details not available.");
      return;
    }
    dispatch(addToCart({ product: selectedProduct, num: quantity }));
    toast.success(`${selectedProduct.productName} added to cart!`);
  };

  if (!selectedProduct) {
    return <h2 className="text-center">Product not found</h2>;
  }

  return (
    <section className="product-page">
      <Container>
        <Row className="justify-content-center">
          {/* Product Image */}
          <Col md={6} className="product-image-container">
            <img
              loading="lazy"
              src={selectedProduct.imgUrl || "/placeholder.jpg"}
              alt={selectedProduct.productName || "Product Image"}
              className="product-image"
            />
          </Col>

          {/* Product Details */}
          <Col md={6}>
            <h2>{selectedProduct.productName}</h2>

            {/* Dynamic Rating */}
            <div className="rate">
              <div className="stars">
                {[...Array(5)].map((_, index) => (
                  <i
                    key={index}
                    className={`fa fa-star ${
                      index < Math.round(selectedProduct.avgRating) ? "filled" : ""
                    }`}
                  ></i>
                ))}
              </div>
              <span>{selectedProduct.avgRating} Ratings</span>
            </div>

            {/* Price & Category */}
            <div className="info">
              <span className="price">₹{selectedProduct.price}</span>
              <span> Category: {selectedProduct.category}</span>
            </div>

            <p>{selectedProduct.shortDesc}</p>

            {/* Add to Cart */}
            <div className="addtocart">
              <input
                className="qty-input"
                type="number"
                value={quantity}
                min="1"
                onChange={handleQuantityChange}
              />
              <button
                aria-label="Add to Cart"
                type="submit"
                className="add"
                onClick={handleAdd}
              >
                Add To Cart
              </button>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ProductDetails;
