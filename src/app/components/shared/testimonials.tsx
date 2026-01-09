'use client';

import { useState, useEffect } from 'react';
import Slider from './slider';

interface Testimonial {
  _id: string;
  name: string;
  position: string;
  company?: string;
  review: string;
  rating: number;
  imageUrl?: string;
  isActive: boolean;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials?isActive=true&limit=10');
      const data = await response.json();

      if (data.success) {
        setTestimonials(data.data);
      } else {
        console.error('Failed to fetch testimonials:', data.error);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  // Transform testimonials to match the slider component format
  const testimonialsForSlider = testimonials.map((testimonial, index) => ({
    id: index + 1, // Convert to number for slider component
    imgSrc: testimonial.imageUrl || '/testimonial-1.svg',
    review: testimonial.review,
    name: testimonial.name,
    position: testimonial.company 
      ? `${testimonial.position}, ${testimonial.company}`
      : testimonial.position,
    stars: testimonial.rating
  }));

  // Fallback testimonials if no data is available
  const fallbackTestimonials = [
    {
      id: 1,
      imgSrc: '/testimonial-1.svg',
      review: 'Peter Design Co. transformed our office into a modern and functional space. Their attention to detail and professionalism were outstanding.',
      name: 'John Doe',
      position: 'CEO, Company A',
      stars: 5
    },
    {
      id: 2,
      imgSrc: '/testimonial-1.svg',
      review: 'Exceptional service and beautiful designs. Highly recommend Peter Design Co. for any interior design needs.',
      name: 'Jane Smith',
      position: 'Manager, Company B',
      stars: 5
    },
    {
      id: 3,
      imgSrc: '/testimonial-1.svg',
      review: 'Professional team with creative solutions. They exceeded our expectations in every way.',
      name: 'Mike Johnson',
      position: 'Director, Company C',
      stars: 5
    }
  ];

  const displayTestimonials = testimonialsForSlider.length > 0 ? testimonialsForSlider : fallbackTestimonials;

  return (
    <div className="container mx-auto px-4 pt-[80px] md:pt-[140px]">
      <div>
        <div className="flex flex-col justify-center items-center">
          <p className="text-base font-medium mb-5 text-black">TESTIMONIALS</p>
          <p className="text-2xl md:text-4xl font-bold mb-10 text-black">What Our Client Say's</p>
        </div>
        <div>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading testimonials...</p>
            </div>
          ) : (
            <Slider
              variant="testimonial"
              testimonials={displayTestimonials}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;