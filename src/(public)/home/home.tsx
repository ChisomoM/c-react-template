// "use client";
import Hero from '@/(public)/home/components/hero';
import Navbar from '../../components/navbar';
import { Footer } from '@/components/footer';
import SEO from '../../components/SEO';
// import { ScrollytellingFeatures } from './components/ScrollytellingFeatures';



export default function Home(){
    return(
        <div className="pt-20">
            <SEO
                title="Home - Your Site Name"
                description="Welcome to our homepage. Discover our services and features."
                keywords="home, welcome, services, features"
                type="website"
            />
            <Navbar/>
            <Hero/>


            
           
            <Footer/>
        </div>
        
        
    )
}