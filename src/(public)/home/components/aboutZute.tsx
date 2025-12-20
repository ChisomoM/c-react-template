import { motion } from 'framer-motion';
// import { Users, TrendingUp, Award, Target } from 'lucide-react';

export default function AboutZUTE(){
    // const stats = [
    //     { icon: Users, value: "5,000+", label: "Active Members" },
    //     { icon: TrendingUp, value: "15%", label: "ROI Growth" },
    //     { icon: Award, value: "25+", label: "Years Combined Experience" },
    //     { icon: Target, value: "100%", label: "Committed to Teachers" }
    // ];

    return (
        <section className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                <div className="absolute top-1/4 right-0 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Image Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="relative aspect-[692/546] rounded-3xl overflow-hidden shadow-2xl">
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#172E70]/20 to-transparent z-10"></div>
                            
                            <img 
                                src="/bg-t.png" 
                                alt="About ZUTE" 
                                className="w-full h-full object-cover"
                            />
                            
                            {/* Floating Badge
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl z-20"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#F15A29] to-[#d94c1e] rounded-xl flex items-center justify-center">
                                        <Users className="text-white" size={24} />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900">5,000+</div>
                                        <div className="text-sm text-gray-600">Teachers United</div>
                                    </div>
                                </div>
                            </motion.div> */}

                            {/* Decorative Elements */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#F15A29] rounded-full opacity-20 blur-2xl"></div>
                            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#172E70] rounded-full opacity-20 blur-2xl"></div>
                        </div>
                    </motion.div>

                    {/* Content Column */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6"
                    >
                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <span className="text-[#F15A29] font-semibold text-sm uppercase tracking-wider px-4 py-2 bg-orange-50 rounded-full border border-orange-200 inline-block">
                                    Who We Are
                                </span>
                            </motion.div>
                            
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="text-3xl md:text-4xl lg:text-5xl font-bold mt-6 mb-6 font-poppins leading-tight"
                            >
                                A Union made to{' '}
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#172E70] to-[#F15A29]">
                                    empower teachers
                                </span>
                            </motion.h2>
                            
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="text-lg text-gray-600 leading-relaxed"
                            >
                                ZUTE unites educators through advocacy, professional development, and economic opportunities 
                                through our cooperative, ECOS. Together, we're building a stronger teaching profession that 
                                values growth, protection, and financial empowerment.
                            </motion.p>
                        </div>

                        {/* Stats Grid
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="grid grid-cols-2 gap-4 pt-8"
                        >
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 bg-gradient-to-br from-[#172E70] to-[#2a4595] rounded-xl flex items-center justify-center">
                                            <stat.icon className="text-white" size={20} />
                                        </div>
                                        <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                                    </div>
                                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                                </motion.div>
                            ))}
                        </motion.div> */}
                    </motion.div>
                </div>
            </div>
        </section>
    )
}