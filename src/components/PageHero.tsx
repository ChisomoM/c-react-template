import { motion, useReducedMotion } from 'framer-motion';

// Import background image
// import pageHeaderBg from '../assets/Page-Header-Background.png';
// import pageHeroBg from '../assets/Page-header-bg.png';

interface PageHeroProps {
  title: string;
  highlightText?: string;
  description?: string;
  backgroundImage?: string;
  className?: string;
}

function PageHero({ 
  title, 
  highlightText, 
  description, 
//   backgroundImage, // = pageHeroBg,
  className = ''
}: PageHeroProps) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <section
      className={`relative bg-[url('/ZUTE-IMAGE.jpg')] bg-cover bg-top bg-no-repeat py-20 sm:py-24 md:py-28 lg:py-32 overflow-hidden ${className}`}
    //   style={{
    //     backgroundImage: `url('${backgroundImage ?? '/ZUTE-IMAGE.jpg'}')`,
    //     backgroundSize: 'cover',
    //     backgroundPosition: 'center',
    //     backgroundRepeat: 'no-repeat'
    //   }}
    >
      {/* 60% overlay to allow hero image visibility */}
      <div className="absolute inset-0 bg-[#172E70]/60"></div>

      <motion.div
        initial={{ opacity: shouldReduceMotion ? 1 : 0, scale: shouldReduceMotion ? 1 : 0.995 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 z-10"
      >
        <div className="text-center">
          <motion.h1
            initial={{ opacity: shouldReduceMotion ? 1 : 0, scale: shouldReduceMotion ? 1 : 0.995 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5, ease: 'easeOut' }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-poppins"
          >
            {title}{highlightText && <span className="text-[#F15A29]"> {highlightText}</span>}
          </motion.h1>
          {description && (
            <motion.p
              initial={{ opacity: shouldReduceMotion ? 1 : 0, scale: shouldReduceMotion ? 1 : 0.995 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25, duration: 0.5, ease: 'easeOut' }}
              className="text-sm sm:text-base md:text-lg text-blue-100 max-w-4xl mx-auto leading-relaxed mt-4"
            >
              {description}
            </motion.p>
          )}
        </div>
      </motion.div>
  </section>
  );
}

export default PageHero;
