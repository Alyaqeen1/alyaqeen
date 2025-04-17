import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useGetProductsQuery } from "../../../redux/features/products/productsApi";
import LoadingSpinner from "../LoadingSpinner";
import ProductModal from "./ProductModal";

const PricingPlan = () => {
  const {
    data: products,
    isLoading,
    isError,
    isSuccess,
  } = useGetProductsQuery();
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});

  // Toggle modal visibility
  const handleShow = (product) => {
    setShowModal(true);
    setSelectedProduct(product);
  };
  const handleClose = () => setShowModal(false);

  const [selectedCategory, setSelectedCategory] = useState(null);
  useEffect(() => {
    setSelectedCategory(products?.data[0]?.title.toString());
  }, [products]);

  const selectedProducts =
    products?.data?.find((product) => product?.title === selectedCategory) ||
    {};

  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }
  if (isError) {
    return <h2 className="text-center my-4">Error loading products</h2>;
  }

  return (
    <section className="pricing-section section-padding mt-0">
      <div className="container">
        <div className="pricing-wrapper">
          <div className="section-title text-center mb-0">
            <span data-aos-duration="800" data-aos="fade-up">
              Our Shop
            </span>
            <h2 data-aos-duration="800" data-aos="fade-up" data-aos-delay="300">
              Select a product according to <br /> your requirements
            </h2>
          </div>
          <ul className="nav" role="tablist">
            {isSuccess && products?.data?.length > 0 ? (
              products?.data?.map((product) => (
                <li
                  key={product?.id}
                  className="nav-item "
                  data-aos-duration="800"
                  data-aos="fade-up"
                  data-aos-delay="300"
                  role="presentation"
                >
                  <button
                    className={`nav-link box-shadow ${
                      product?.title === selectedCategory && "active"
                    }`}
                    onClick={() => setSelectedCategory(product?.title)}
                  >
                    {product?.title}
                  </button>
                </li>
              ))
            ) : (
              <>
                <h2 className="text-center my-4">No Categories Found</h2>
              </>
            )}
          </ul>
        </div>
        <div className="tab-content">
          <div id="monthly" className={``}>
            <div className="row">
              {isSuccess && selectedProducts?.products?.length > 0 ? (
                selectedProducts?.products?.map((product, idx) => (
                  <div
                    key={product?.id}
                    className="col-xl-4 col-lg-6 col-md-6 "
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    <div
                      className={`pricing-items ${
                        (idx + 1) % 3 === 2 ? "active" : ""
                      }`}
                    >
                      <div className="icon">
                        <img
                          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/pricing/icon.svg"
                          alt="icon-img"
                        />
                      </div>
                      <div className="element-shape">
                        <img
                          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/pricing/element.png"
                          alt="shape-img"
                        />
                      </div>
                      <div className="pricing-header">
                        <h4>{product?.title}</h4>
                        <h2>£{product?.price}</h2>
                      </div>
                      <ul className="pricing-list">
                        <li>
                          <i className="fa-solid fa-check"></i>
                          {product?.description?.substring(0, 130)}...
                        </li>
                      </ul>
                      <button
                        onClick={() => handleShow(product)}
                        className="theme-btn"
                      >
                        View Details{" "}
                        <i className="fa-solid fa-arrow-right-long"></i>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <h2 className="text-center my-4">No Products Found</h2>
                </>
              )}
            </div>
          </div>
          <ProductModal
            selectedProduct={selectedProduct}
            showModal={showModal}
            handleClose={handleClose}
          ></ProductModal>
        </div>
      </div>
    </section>
  );
};

export default PricingPlan;
