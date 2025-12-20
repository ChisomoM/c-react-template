import { ArrowRight, Shield, TrendingUp, Users, Award } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';


export default function Hero(){
    const highlights = [
        { icon: Shield, text: "Legal Protection" },
        { icon: TrendingUp, text: "Investment Opportunities" },
        { icon: Award, text: "Professional Growth" }
    ];

    return(
        <div className="">      
          <section className="relative bg-[url('/bg-t.png')] bg-cover bg-right overflow-hidden min-h-[90vh] flex items-center">
            {/* Enhanced Overlay with Gradient */}
            <div className='absolute inset-0 bg-gradient-to-r from-black/85  to-black/0'>
                {/* Animated Gradient Orbs */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#F15A29]/20 rounded-full blur-3xl"
                ></motion.div>
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                    className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#172E70]/20 rounded-full blur-3xl"
                ></motion.div>
            </div>

            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 w-full z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column - Main Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-left space-y-8 pt-12 lg:pt-0"
                    >                       

                        {/* Main Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="text-4xl sm:text-5xl lg:text-5xl font-bold text-white leading-[1.1] tracking-tight"
                        >
                            EMPOWERING{' '}
                            <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-[#F15A29] via-orange-400 to-[#F15A29]">
                                ZAMBIA'S TEACHERS
                            </span>
                        </motion.h1>

                        {/* Subheadline */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-lg text-gray-200 leading-relaxed max-w-2xl"
                        >
                            ZUTE empowers educators through advocacy, professional development, and economic opportunities through
                            our cooperative, ECOS. Together, we're building a stronger teaching profession.
                        </motion.p>

                        {/* Highlights */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="flex flex-wrap gap-4"
                        >
                            {highlights.map((highlight, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                                    className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-2 py-2 rounded-full border border-white/20"
                                >
                                    <highlight.icon className="text-[#F15A29]" size={16} />
                                    <span className="text-white font-medium text-[12px]">{highlight.text}</span>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.7 }}
                            className="flex flex-col sm:flex-row gap-4 pt-4"
                        >
                            <Link to="/join" className="group">
                                <Button 
                                    size="sm"
                                    className="w-full sm:w-auto bg-gradient-to-r from-[#F15A29] to-[#d94c1e] hover:from-[#d94c1e] hover:to-[#c4431a] text-white font-bold px-10 py-7 text-lg rounded-full shadow-lg hover:shadow-orange-500/50 transition-all duration-300"
                                >
                                    Become a Member
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Button 
                                variant="outline" 
                                size="sm"
                                className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-[#172E70] font-semibold px-10 py-7 text-lg rounded-full transition-all duration-300 bg-transparent backdrop-blur-sm"
                            >
                                Contact Us
                            </Button>
                        </motion.div>

                        {/* Trust Indicators
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.9 }}
                            className="flex items-center gap-6 pt-8 text-gray-300"
                        >
                            <div className="flex items-center gap-2">
                                <Users size={20} />
                                <span className="text-sm font-medium">5,000+ Members</span>
                            </div>
                            <div className="w-px h-6 bg-white/30"></div>
                            <div className="flex items-center gap-2">
                                <Shield size={20} />
                                <span className="text-sm font-medium">95% Success Rate</span>
                            </div>
                        </motion.div> */}
                    </motion.div>

                    {/* Right Column - Stats Cards
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="hidden lg:grid grid-cols-2 gap-6"
                    >
                        {[
                            { number: "5,000+", label: "Active Members", icon: Users, gradient: "from-purple-500 to-purple-700" },
                            { number: "15%+", label: "ROI Growth", icon: TrendingUp, gradient: "from-orange-500 to-red-600" },
                            { number: "95%", label: "Success Rate", icon: Shield, gradient: "from-blue-600 to-blue-800" },
                            { number: "24/7", label: "Support", icon: Award, gradient: "from-green-500 to-green-700" }
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300"
                            >
                                <div className={`w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center mb-4`}>
                                    <stat.icon className="text-white" size={28} />
                                </div>
                                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                                <div className="text-gray-300 font-medium">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div> */}
                </div>
            </div>
          </section>
        </div>
    )
}