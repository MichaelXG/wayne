import Slider from 'react-slick';
import { useState, useRef } from 'react';
import { Box, IconButton, useTheme } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function ImageCarousel({ images = [] }) {
  const theme = useTheme();
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

  const handlePrev = () => sliderRef.current?.slickPrev();
  const handleNext = () => sliderRef.current?.slickNext();

  return (
    <Box >
      {/* Slide Principal */}
      <Box
        sx={{
          display: 'block',
          width: '800px',
          maxWidth: 400,
          mx: 'auto',
          mb: 2,
          position: 'relative',
          borderRadius: 2,
          boxShadow: 4,
          overflow: 'hidden',
          backgroundColor: theme.palette.grey[900]
        }}
      >
        {/* Arrows */}
        <IconButton
          onClick={handlePrev}
          size="small"
          sx={{ position: 'absolute', top: '50%', left: 8, zIndex: 1, transform: 'translateY(-50%)' }}
        >
          <ChevronLeft />
        </IconButton>
        <IconButton
          onClick={handleNext}
          size="small"
          sx={{ position: 'absolute', top: '50%', right: 8, zIndex: 1, transform: 'translateY(-50%)' }}
        >
          <ChevronRight />
        </IconButton>

        <Slider ref={sliderRef} {...settings}>
          {images.map((img, index) => (
            <Box key={index} sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img
                src={typeof img === 'object' ? img.url : img}
                alt={`image-${index}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            </Box>
          ))}
        </Slider>

        {/* Contador */}
        <Box
          sx={{
            position: 'absolute',
            bottom: theme.spacing(1),
            right: theme.spacing(2),
            backgroundColor: 'grey.600',
            color: '#fff',
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
            onClick={() => sliderRef.current?.slickGoTo(index)}
            sx={{
              border: index === currentSlide ? `2px solid ${theme.palette.grey[600]}` : `1px solid ${theme.palette.divider}`,
              borderRadius: 1,
              cursor: 'pointer',
              overflow: 'hidden',
              width: 60,
              height: 60
            }}
          >
            <img
              src={typeof img === 'object' ? img.url : img}
              alt={`thumb-${index}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
