// "use client";
import Hero from '@/(public)/home/components/hero';
import Navbar from '../../components/navbar';
import { Footer } from '@/components/footer';
// import { ScrollytellingFeatures } from './components/ScrollytellingFeatures';



export default function Home(){
    return(
        <div className="pt-20">
            <Navbar/>
            <Hero/>


            
           
            <Footer/>
        </div>
        
        
    )
}