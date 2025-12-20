import { Sprout, Megaphone, Scale, TrendingUp, Shield, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const WhatWeDo = () => {
  const features = [
    {
      title: "Economic Empowerment",
      description: "Build wealth while teaching. Through our partner ECOS, access investment opportunities in agriculture, mining, property, and more. Benefit from savings plans, low-interest loans, financial literacy training, and referral rewards.",
      icon: Sprout,
      gradient: "from-purple-600 to-purple-800",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
      iconBg: "bg-gradient-to-br from-purple-500 to-purple-700",
      hoverGlow: "group-hover:shadow-purple-500/50",
      stats: [
        { icon: TrendingUp, label: "Investment Growth", value: "15%+" },
        { icon: Users, label: "Active Members", value: "5,000+" }
      ]
    },
    {
      title: "Teacher Advocacy & Rights",
      description: "Your voice, amplified. We negotiate for fair salaries, improved working conditions, and better benefits. From policy reform to workplace disputes, ZUTE represents teachers with strength and unity.",
      icon: Megaphone,
      gradient: "from-orange-600 to-red-600",
      bgColor: "bg-gradient-to-br from-orange-50 to-orange-100",
      iconBg: "bg-gradient-to-br from-[#F15A29] to-[#d94c1e]",
      hoverGlow: "group-hover:shadow-orange-500/50",
      stats: [
        { icon: Shield, label: "Recent Wins", value: "Q1 2026" },
        { icon: Users, label: "Teachers", value: "5,000+" }
      ]
    },
    {
      title: "Legal Support & Representation",
      description: "Protected at every step. Access legal counsel for employment disputes, contract issues, workplace grievances, and disciplinary matters. Our expert team ensures your rights are defended.",
      icon: Scale,
      gradient: "from-blue-800 to-blue-950",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      iconBg: "bg-gradient-to-br from-[#172E70] to-[#0f1d47]",
      hoverGlow: "group-hover:shadow-blue-500/50",
      stats: [
        { icon: Shield, label: "Legal Cases", value: "200+" },
        { icon: Users, label: "Success Rate", value: "95%" }
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse [animation-delay:1s]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4">
            <span className="text-[#F15A29] font-semibold text-sm uppercase tracking-wider px-4 py-2 bg-orange-50 rounded-full border border-orange-200">
              Our Commitment
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-poppins bg-clip-text text-transparent bg-gradient-to-r from-[#172E70] to-[#F15A29]">
            What We Do For Teachers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Three pillars of support designed to empower, protect, and elevate your teaching career
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative"
            >
              {/* Card Background with Gradient Border Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl ${feature.hoverGlow}`}></div>
              
              <div className={`relative ${feature.bgColor} rounded-3xl p-8 h-full backdrop-blur-sm border border-white shadow-xl transition-all duration-500 group-hover:shadow-2xl overflow-hidden`}>
                {/* Decorative Corner Element */}
                <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${feature.gradient} rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>
                
                {/* Icon Container */}
                <div className="relative mb-6">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className={`w-20 h-20 ${feature.iconBg} rounded-2xl flex items-center justify-center shadow-lg mx-auto`}
                  >
                    <feature.icon className="text-white" size={40} strokeWidth={2} />
                  </motion.div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-4 text-gray-900 font-poppins text-center group-hover:text-[#172E70] transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-700 leading-relaxed mb-6 text-center">
                  {feature.description}
                </p>

                {/* Stats Mini Cards */}
                <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-gray-200">
                  {feature.stats.map((stat, idx) => (
                    <div key={idx} className="flex flex-col items-center bg-white/70 backdrop-blur rounded-xl p-3 group-hover:bg-white transition-all duration-300">
                      <stat.icon className={`text-gray-600 mb-1`} size={18} />
                      <span className="text-xs text-gray-500 mb-1">{stat.label}</span>
                      <span className="text-lg font-bold text-gray-900">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhatWeDo;
