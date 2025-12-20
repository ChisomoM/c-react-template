import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Calendar, TrendingUp, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const NewsUpdates = () => {
  const newsItems = [
    {
      id: 1,
      title: "ZUTE Secures Commitment for Q1 2026 Salary Review",
      excerpt: "After months of negotiation, the ministry has agreed to a comprehensive review of teacher salaries starting next year.",
      category: "Advocacy Win",
      categoryColor: "bg-gradient-to-r from-orange-500 to-red-500 text-white",
      date: "Dec 5, 2024",
      readTime: "3 min read",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      featured: true
    },
    {
      id: 2,
      title: "Member Spotlight: Mrs. Mulenga's Farming Success",
      excerpt: "How one teacher used ZUTE's agricultural investment program to build a thriving maize farm in Chongwe.",
      category: "Member Spotlight",
      categoryColor: "bg-gradient-to-r from-purple-500 to-purple-700 text-white",
      date: "Nov 28, 2024",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "New Pension Reform Policy: What You Need to Know",
      excerpt: "A breakdown of the recent changes to the pension scheme and how they affect your retirement planning.",
      category: "Policy Update",
      categoryColor: "bg-gradient-to-r from-blue-600 to-blue-800 text-white",
      date: "Nov 15, 2024",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="text-[#F15A29]" size={24} />
              <span className="text-[#F15A29] font-semibold text-sm uppercase tracking-wider px-4 py-2 bg-orange-50 rounded-full border border-orange-200">
                Stay Informed
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-poppins bg-clip-text text-transparent bg-gradient-to-r from-[#172E70] to-[#F15A29]">
              Latest News & Updates
            </h2>
            <p className="text-gray-600 text-xl max-w-2xl leading-relaxed">
              Stay informed on advocacy wins, policy changes, and ZUTE initiatives
            </p>
          </div>
          <Link to="/news" className="hidden lg:block">
            <Button 
              size="lg"
              className="bg-[#172E70] hover:bg-[#0f1d47] text-white font-semibold px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              View All News 
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {newsItems.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className="group"
            >
              <Link to={`/news/${item.id}`} className="block h-full">
                <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col border border-gray-100">
                  {/* Image Container with Overlay */}
                  <div className="relative overflow-hidden h-64">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Floating Badge */}
                    <div className="absolute top-4 left-4 z-20">
                      <Badge className={`${item.categoryColor} border-none px-4 py-2 text-sm font-semibold shadow-lg backdrop-blur`}>
                        {item.category}
                      </Badge>
                    </div>

                    {/* Featured Badge */}
                    {item.featured && (
                      <div className="absolute top-4 right-4 z-20">
                        <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                          <TrendingUp size={14} />
                          Trending
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex-grow flex flex-col">
                    {/* Meta Information */}
                    <div className="flex items-center text-xs text-gray-500 mb-4 gap-4">
                      <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                        <Calendar className="h-3 w-3" />
                        <span className="font-medium">{item.date}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                        <Clock className="h-3 w-3" />
                        <span className="font-medium">{item.readTime}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold leading-tight mb-3 group-hover:text-[#172E70] transition-colors line-clamp-2 font-poppins text-gray-900">
                      {item.title}
                    </h3>
                    
                    {/* Excerpt */}
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow leading-relaxed">
                      {item.excerpt}
                    </p>
                    
                    {/* Read More Link */}
                    <div className="flex items-center text-[#F15A29] font-bold text-sm group-hover:gap-3 gap-2 transition-all duration-300">
                      <span>Read Full Story</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center lg:hidden"
        >
          <Link to="/news">
            <Button 
              size="lg"
              className="w-full sm:w-auto bg-[#172E70] hover:bg-[#0f1d47] text-white font-semibold px-8 py-6 rounded-full shadow-lg"
            >
              View All News
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsUpdates;
