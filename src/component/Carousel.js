import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const Carousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: 'auto' }}>
      <Slider {...settings}>
        <div>
          <img
            src="./images/losma1.png"
            alt="Image 1"
            style={{ width: '100%', height: '300px', objectFit: 'cover' }}
          />
        </div>
        <div>
          <img
            src="./images/l1.jpg"
            alt="Image 2"
            style={{ width: '100%', height: '300px', objectFit: 'cover' }}
          />
        </div>
        <div>
          <img
            src="./images/l3.jpg"
            alt="Image 3"
            style={{ width: '100%', height: '300px', objectFit: 'cover' }}
          />
        </div>
        <div>
          <img
            src="./images/l2.jpg"
            alt="Image 4"
            style={{ width: '100%', height: '300px', objectFit: 'cover' }}
          />
        </div>
      </Slider>
    </div>
  );
};

export default Carousel;
