import React, { useState } from "react";

const Product = ({ product }) => {
    const [currentImg, setCurrentImg] = useState(0);

    // Go to the next image
    function nextImage() {
        if (currentImg === product.images.length - 1) {
            setCurrentImg(0);
        } else {
            setCurrentImg(currentImg + 1);
        }
    }

    // Go to the previous image
    function prevImage() {
        if (currentImg === 0) {
            setCurrentImg(product.images.length - 1);
        } else {
            setCurrentImg(currentImg - 1);
        }
    }

    return (
        <div
            style={{
                maxWidth: "400px",
                margin: "2rem auto",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "1rem",
            }}
        >
            {/* Image Carousel */}
            <div style={{ position: "relative", textAlign: "center" }}>
                <img
                    src={product.images[currentImg]}
                    alt={product.title}
                    style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "4px" }}
                />
                <button
                    onClick={prevImage}
                    style={{ position: "absolute", top: "50%", left: "10px", transform: "translateY(-50%)" }}
                >
                    &#8592;
                </button>
                <button
                    onClick={nextImage}
                    style={{ position: "absolute", top: "50%", right: "10px", transform: "translateY(-50%)" }}
                >
                    &#8594;
                </button>
            </div>

            {/* Product Info */}
            <h2 style={{ fontSize: "1.5rem", margin: "1rem 0 0.5rem" }}>{product.title}</h2>
            <p style={{ margin: "0 0 1rem" }}>{product.description}</p>
            <div>
                <strong>Price:</strong> ${product.price}
            </div>
            <div>
                <strong>Stock:</strong> {product.stock}
            </div>
            <div>
                <strong>Brand:</strong> {product.brand}
            </div>
            <div>
                <strong>Category:</strong> {product.category}
            </div>
        </div>
    );
};

export default Product;
