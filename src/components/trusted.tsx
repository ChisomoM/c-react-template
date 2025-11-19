import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
// import { Badge } from '@/components/ui/badge';

const LOGOS = [
  { id: 'logo-1', src: '/client_logos/stanbic-bank-logo-a21408e06e8cc21ab4a3b70000615e67.png', name: 'Stanbic Bank' },
  { id: 'logo-2', src: '/client_logos/bayport-logo-b1c17fc0c2e8a28d1db983c5b8c960cd.jpg', name: 'Bayport' },
  { id: 'logo-3', src: '/client_logos/itnio-tech-logo-9e78a7acb2aaddb9b0c2e6b5965ccecf.jpeg', name: 'Itnio Tech' },
  { id: 'logo-4', src: '/client_logos/mulungushi-logo-c08916aa470c7648e3eb4aab4706e0cb.jpg', name: 'Mulungushi' },
  { id: 'logo-5', src: '/client_logos/nhina-logo-e861a6d7b9b092e9bb964e8d62eabae2.jpg', name: 'Nhina' },
  { id: 'logo-6', src: '/client_logos/Picture9 1.png', name: 'Partner 6' },
  { id: 'logo-7', src: '/client_logos/Picture20 1.png', name: 'Partner 7' },
  { id: 'logo-8', src: '/client_logos/Picture24 1.png', name: 'Partner 8' },
  { id: 'logo-9', src: '/client_logos/Rectangle-2.png', name: 'Partner 9' },
];

export default function Trusted() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = React.useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5;

    const animate = () => {
      if (!isPaused && scrollContainer) {
        scrollPosition += scrollSpeed;
        

        const firstSetWidth = scrollContainer.scrollWidth / 3;
        if (scrollPosition >= firstSetWidth) {
          scrollPosition = 0;
        }
        
        scrollContainer.scrollLeft = scrollPosition;
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isPaused]);


  const tripleLogos = [...LOGOS, ...LOGOS, ...LOGOS];

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
         {/* <Badge className="bg-orange-100 text-orange-700 mb-4">Our Partners</Badge> */}
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4 ">
            <span className="text-orange-500">Trusted</span> by leading organizations
          </h2>
          <p className="text-base text-gray-400 max-w-3xl mx-auto">
            Trusted by leading financial institutions and enterprises. From large-scale 
            settlements to real-time digital payments.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          ref={scrollRef}
        //   onMouseEnter={() => setIsPaused(true)}
        //   onMouseLeave={() => setIsPaused(false)}
          className="overflow-hidden flex gap-8 pb-6"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div className="flex gap-8 items-center">
            {tripleLogos.map((logo, idx) => (
              <div
                key={`${logo.id}-${idx}`}
                className="flex-shrink-0 flex items-center justify-center"
                style={{ minWidth: '160px' }}
              >
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="h-12 w-auto object-contain filter grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300 ease-in-out"
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
