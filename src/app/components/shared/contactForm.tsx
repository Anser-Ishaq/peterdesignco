'use client';

import { useState } from 'react';
import CustomButton from '../ui/customButton/customButton';
import CustomInput from '../ui/customInput/customInput';
import CustomTextarea from '../ui/customTextarea/customTextarea';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name || !formData.email || !formData.message) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);
            setError('');
            
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(true);
                setFormData({ name: '', email: '', phone: '', message: '' });
                setTimeout(() => setSuccess(false), 5000); // Hide success message after 5 seconds
            } else {
                setError(data.error || 'Failed to send message');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setError('Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[url('/model-bg.svg')] bg-cover bg-center w-full bg-accent">
            <div className="container mx-auto px-4 py-16 md:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="flex flex-col justify-start items-start">
                        <p className="text-base font-medium mb-5 text-black">Contact Us</p>
                        <p className="text-2xl md:text-4xl font-bold mb-10 text-black">Lets Start a New Project</p>
                        <p className="lg:w-90 font-normal text-xl mb-20">
                            Ready to transform your space? Get in touch with our expert design team to discuss your project requirements and bring your vision to life.
                        </p>
                        <div className="flex flex-col md:flex-row justify-between gap-20 font-normal text-xl">
                            <div>
                                <p className="font-semibold">Phone Number</p>
                                <p>+92 309 6737252</p>
                                <p>+92 336 6134347</p>
                            </div>
                            <div>
                                <p className="font-semibold">Email</p>
                                <p>info@peterdesignco.com</p>
                                <p>contact@peterdesignco.com</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col justify-between mt-10">
                        {success && (
                            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                                Thank you for your message! We'll get back to you soon.
                            </div>
                        )}
                        
                        {error && (
                            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-5">
                                <CustomInput 
                                    width="w-full" 
                                    height="h-[50px]" 
                                    placeholder="Name *" 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                                <CustomInput 
                                    width="w-full" 
                                    height="h-[50px]" 
                                    placeholder="Phone" 
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <CustomInput 
                                width="w-full" 
                                height="h-[50px]" 
                                placeholder="Email *" 
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                            <CustomTextarea 
                                width="w-full" 
                                height="h-[150px]" 
                                placeholder="Message *" 
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                required
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gold text-white py-3 px-6 rounded-lg hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? 'Sending...' : 'Submit'}
                                {!loading && (
                                    <img src="/arrow-forward.svg" alt="arrow" className="w-4 h-4" />
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactForm;
