import mongoose from 'mongoose';

export interface ITestimonial {
  _id?: string;
  name: string;
  position: string;
  company?: string;
  review: string;
  rating: number;
  imageUrl?: string;
  imagePublicId?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    trim: true,
    maxlength: [100, 'Position cannot exceed 100 characters']
  },
  company: {
    type: String,
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  review: {
    type: String,
    required: [true, 'Review is required'],
    trim: true,
    maxlength: [1000, 'Review cannot exceed 1000 characters']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  imageUrl: {
    type: String,
    trim: true
  },
  imagePublicId: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create indexes
testimonialSchema.index({ isActive: 1, createdAt: -1 });
testimonialSchema.index({ rating: -1 });

const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;