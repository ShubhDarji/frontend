import { Fragment, useEffect } from "react";
import Wrapper from "../components/wrapper/Wrapper";
import Section from "../components/Section";
import { products, discoutProducts, salebest } from "../utils/products";
import SliderHome from "../components/Slider";
import useWindowScrollToTop from "../hooks/useWindowScrollToTop";
import './Home.css';

const Home = () => {
 

  const newArrivalData = products.filter(
    (item) => item.category === "oven" || item.category === "ac"
  );

  const bestSale = products.filter((item) => item.category === "tv");

  const featuredProducts = products.filter((item) => item.category === "featured");

  useWindowScrollToTop();
  return (
    <Fragment>
      <SliderHome />
      <Wrapper />
      <hr />
      <Section title="Big Discount" productItems={discoutProducts} />
      <hr />
      <Section title="New Arrivals" productItems={newArrivalData} />
      <hr />
      <Section title="Best Sale" productItems={bestSale} />
      <hr />
      <Section title="Featured Products" productItems={featuredProducts} />
      <hr />
    </Fragment>
  );
};

export default Home;
