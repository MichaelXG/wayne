import Slider from 'react-slick';
import { useState, useRef } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function ImageCarousel({ images = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (index) => setCurrentSlide(index)
  };

  const handlePrev = () => {
    sliderRef.current?.slickPrev();
  };

  const handleNext = () => {
    sliderRef.current?.slickNext();
  };

  return (
    <Box>
      {/* Navegação + Slide Principal */}
      <Box
        sx={{
          width: '100%',
          position: 'relative',
          maxWidth: 400,
          mx: 'auto',
          mb: 2,
          borderRadius: 2,
          boxShadow: 4,
          overflow: 'hidden',
          backgroundColor: 'background.paper'
        }}
      >
        {/* Arrows */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: 0,
            transform: 'translateY(-50%)',
            zIndex: 1
          }}
        >
          <IconButton onClick={handlePrev}>
            <ChevronLeft />
          </IconButton>
        </Box>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            right: 0,
            transform: 'translateY(-50%)',
            zIndex: 1
          }}
        >
          <IconButton onClick={handleNext}>
            <ChevronRight />
          </IconButton>
        </Box>

        {/* Carousel */}
        <Slider ref={sliderRef} {...settings}>
          {images.map((img, index) => (
            <Box key={index} sx={{ px: 2 }}>
              <img
                src={img}
                alt={`image-${index}`}
                className="minimal__image__img"
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 8,
                  objectFit: 'cover'
                }}
              />
            </Box>
          ))}
        </Slider>

        {/* Slide Count */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 16,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            fontSize: 12
          }}
        >
          {`${currentSlide + 1} / ${images.length}`}
        </Box>
      </Box>

      {/* Miniaturas */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
        {images.map((img, index) => (
          <Box
            key={index}
            sx={{
              border: index === currentSlide ? '2px solid #1976d2' : '1px solid #ccc',
              borderRadius: 1,
              cursor: 'pointer',
              overflow: 'hidden',
              width: 60,
              height: 60
            }}
            onClick={() => sliderRef.current?.slickGoTo(index)}
          >
            <img
              src={img}
              alt={`thumb-${index}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
