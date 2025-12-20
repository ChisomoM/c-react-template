import { motion } from 'framer-motion';
import { useState } from 'react';
import PageHero from '@/components/PageHero';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, Phone, Mail, MapPin } from 'lucide-react';
import { submitContactMessage } from '@/lib/apiClient';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

function Contact() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await submitContactMessage(formData);
      setIsSuccess(true);
      toast({
        title: "Message Sent",
        description: "We've received your message and will get back to you shortly.",
      });
      setFormData({
        name: '',
        phone: '',
        email: '',
        message: ''
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
      <SEO 
        title="Contact Us - ZUTE"
        description="Contact ZUTE for inquiries, support, or membership information. We are here to serve Zambian teachers."
        keywords="contact ZUTE, teacher union Zambia, education support, join ZUTE"
        url="https://zute.org.zm/contact"
      />
      {/* Hero Section with Background */}
     <PageHero 
       title='Contact'
       highlightText='Us'
       backgroundImage='/4dd7ba40-e8da-4ca4-b65e-1c2f0d4de0a3.jpg'
     />

      {/* Contact Section */}
      <div className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Details */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:pr-8"
            >
              <div className="mb-12">
                <h3 className="text-sm font-bold text-[#F15A29] uppercase tracking-wider mb-3">
                  CONTACT DETAILS
                </h3>
                <h2 className="text-4xl lg:text-5xl font-bold text-[#172E70] mb-6 leading-tight">Get in Touch!</h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Fill in the form or contact our support team<br />
                  and we will get back to you.
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                {/* Phone */}
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-[#F15A29]/10 rounded-xl flex items-center justify-center mr-5">
                    <Phone className="w-7 h-7 text-[#F15A29]" />
                  </div>
                  <div>
                    <p className="text-[#172E70] font-semibold text-lg">+260 970 000 000</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-[#F15A29]/10 rounded-xl flex items-center justify-center mr-5">
                    <Mail className="w-7 h-7 text-[#F15A29]" />
                  </div>
                  <div>
                    <p className="text-[#172E70] font-semibold text-lg">info@zute.org.zm</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start">
                  <div className="w-14 h-14 bg-[#F15A29]/10 rounded-xl flex items-center justify-center mr-5 mt-1">
                    <MapPin className="w-7 h-7 text-[#F15A29]" />
                  </div>
                  <div>
                    <p className="text-[#172E70] font-semibold text-lg leading-relaxed">
                    Lusaka, Zambia
                    </p>
                  </div>
                </div>
              </div>

             
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}

            >
              <div className="bg-gray-50 rounded-2xl p-4 lg:p-8">
                {isSuccess ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
                    <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="h-10 w-10 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                      <p className="text-slate-600 max-w-xs mx-auto">We have received your message and will get back to you shortly.</p>
                    </div>
                    <Button 
                      onClick={() => setIsSuccess(false)} 
                      className="bg-[#F15A29] text-white hover:bg-[#d94c1e] hover:shadow-lg"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F15A29] focus:border-transparent outline-none transition-all duration-300 text-gray-700 placeholder-gray-500"
                        required
                      />
                    </div>

                    <div>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Your Phone Number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F15A29] focus:border-transparent outline-none transition-all duration-300 text-gray-700 placeholder-gray-500"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        name="email"
                        placeholder="Your Email Address"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F15A29] focus:border-transparent outline-none transition-all duration-300 text-gray-700 placeholder-gray-500"
                        required
                      />
                    </div>

                    <div>
                      <textarea
                        name="message"
                        placeholder="Message"
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F15A29] focus:border-transparent outline-none transition-all duration-300 resize-none text-gray-700 placeholder-gray-500"
                        required
                      ></textarea>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-[#F15A29] text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send"
                      )}
                    </motion.button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Map Section - Optional, keeping generic or removing specific iframe if not needed. 
          I'll keep a generic Lusaka map for now. */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl overflow-hidden shadow-xl"
          >
            <div className="h-96 lg:h-[500px] bg-gray-200 flex items-center justify-center">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d123053.8382675674!2d28.2551665!3d-15.416667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1940f3635677883f%3A0x300f3635677883f!2sLusaka%2C%20Zambia!5e0!3m2!1sen!2szm!4v1625140000000!5m2!1sen!2szm"
                width="100%"
                height="100%"
                className="border-0"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                title="Lusaka, Zambia"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}

export default Contact;
