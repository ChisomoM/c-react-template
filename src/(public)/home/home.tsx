// "use client";
import Hero from '@/(public)/home/components/hero';
import Navbar from '../../components/navbar';
import { Footer } from '@/components/footer';
import Trusted from '@/components/trusted';
import { APIDocs } from './components/APISection';
// import { ScrollytellingFeatures } from './components/ScrollytellingFeatures';
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { stickyScrollContent } from './components/StickyScrollContent';
import HowItWorks from './components/HowItWorks';
import CTASection from './components/CTASection';



export default function Home(){
    return(
        <div className="pt-20">
            <Navbar/>
            <Hero/>
           <Trusted/>
            <div className="py-2">
                <StickyScroll content={stickyScrollContent} />
            </div>
            <div className='py-12 mx-auto flex flex-col items-center'> <APIDocs/></div>
            
            
            
 <div className='pt-12'>
                <HowItWorks />
            </div>
            <CTASection />
            
           
            {/* <APISection/> */}
            <Footer/>
        </div>
        
        
    )
}