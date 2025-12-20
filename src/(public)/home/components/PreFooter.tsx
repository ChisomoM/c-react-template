import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, TrendingUp, Users, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const PreFooter = () => {
  const features = [
    { icon: Shield, text: "Legal Protection" },
    { icon: TrendingUp, text: "Financial Growth" },
    { icon: Users, text: "Strong Community" },
    { icon: Award, text: "Career Development" }
  ];

  return (
    <section className="py-32 bg-gradient-to-br from-[#0a1128] via-[#172E70] to-[#0f1d47] text-white text-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-purple-500 blur-3xl"
        ></motion.div>
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-[#F15A29] blur-3xl"
        ></motion.div>
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-1/2 left-0 w-80 h-80 rounded-full bg-blue-400 blur-3xl"
        ></motion.div>
      </div>

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0
            }}
            animate={{
              y: [null, Math.random() * -500],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
      

          {/* Main Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 font-poppins tracking-tight leading-tight"
          >
            Join A Union that{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F15A29] via-orange-400 to-[#F15A29] animate-pulse">
              empowers you.
            </span>
          </motion.h2>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Be part of a movement that values your contribution, protects your rights, and invests in your future.
          </motion.p>

          {/* Feature Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <feature.icon className="text-[#F15A29] mx-auto mb-2" size={32} />
                <span className="text-sm font-semibold text-white block">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row justify-center gap-6"
          >
            <Link to="/join" className="group">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-[#F15A29] to-[#d94c1e] hover:from-[#d94c1e] hover:to-[#c4431a] text-white font-bold px-12 py-8 text-xl rounded-full shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 w-full sm:w-auto relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Join ZUTE Now
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
              </Button>
            </Link>
            
            <Link to="/contact">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-white text-white hover:bg-white hover:text-[#172E70] font-bold px-12 py-8 text-xl rounded-full transition-all duration-300 w-full sm:w-auto bg-transparent backdrop-blur-sm hover:scale-105"
              >
                Contact Us
              </Button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-16 pt-8 border-t border-white/20"
          >
            <div className="flex flex-wrap justify-center items-center gap-8 text-blue-200">
              <div className="flex items-center gap-2">
                <Users className="text-[#F15A29]" size={24} />
                <span className="font-semibold">A Union for you</span>
              </div>
              {/* <div className="hidden sm:block w-px h-6 bg-white/30"></div> */}
              {/* <div className="hidden sm:block w-px h-6 bg-white/30"></div> */}
              {/* <div className="flex items-center gap-2">
                <Award className="text-[#F15A29]" size={24} />
                <span className="font-semibold">Trusted Since 2020</span>
              </div> */}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default PreFooter;
