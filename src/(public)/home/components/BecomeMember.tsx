import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Users, TrendingUp, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import './home-components.css';

const BecomeMember = () => {
  const benefits = [
    { icon: TrendingUp, text: "Investment Opportunities" },
    { icon: Shield, text: "Legal Protection" },
    { icon: Users, text: "5,000+ Members" }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="bg-gradient-to-br from-[#172E70] via-[#1e3a8a] to-[#172E70] rounded-3xl shadow-2xl overflow-hidden">
            {/* Decorative Grid Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 grid-pattern"></div>
            </div>

            {/* Glowing Orbs */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#F15A29] rounded-full mix-blend-screen filter blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20"></div>
            
            <div className="relative z-10 p-8 md:p-12 lg:p-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="inline-block mb-4">
                    <span className="text-[#F15A29] font-semibold text-sm uppercase tracking-wider px-4 py-2 bg-orange-500/20 rounded-full border border-orange-400/30 backdrop-blur">
                      Join Today
                    </span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 font-poppins text-white leading-tight">
                    Ready to Join the <span className="text-[#F15A29]">Movement?</span>
                  </h2>
                  
                  <p className="text-lg text-blue-100 mb-8 leading-relaxed">
                    Become part of a community that prioritizes your growth, rights, and financial future. 
                    Join ZUTE today and start your journey towards empowerment.
                  </p>

                  {/* Benefits List */}
                  <div className="space-y-4 mb-8">
                    {benefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <div className="flex-shrink-0 w-10 h-10 bg-[#F15A29]/20 rounded-xl flex items-center justify-center backdrop-blur">
                          <benefit.icon className="text-[#F15A29]" size={20} />
                        </div>
                        <span className="text-white font-medium">{benefit.text}</span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/join" className="flex-1 sm:flex-initial">
                      <Button 
                        size="lg" 
                        className="w-full sm:w-auto bg-[#F15A29] hover:bg-[#d94c1e] text-white font-bold px-10 py-7 text-lg rounded-full shadow-lg hover:shadow-orange-500/50 transition-all duration-300 group"
                      >
                        Become a Member
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-[#172E70] font-semibold px-10 py-7 text-lg rounded-full transition-all duration-300 bg-transparent"
                    >
                      Learn More
                    </Button>
                  </div>
                </motion.div>

                {/* Right Side - Stats Cards */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="hidden lg:grid grid-cols-2 gap-6"
                >
                  {[
                    { number: "5,000+", label: "Active Members", icon: Users },
                    { number: "15%+", label: "ROI Growth", icon: TrendingUp },
                    { number: "95%", label: "Success Rate", icon: CheckCircle2 },
                    { number: "24/7", label: "Support", icon: Shield }
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05, rotate: 2 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
                    >
                      <stat.icon className="text-[#F15A29] mb-4" size={32} />
                      <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                      <div className="text-blue-200 font-medium">{stat.label}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BecomeMember;
