// "use client";
import Hero from '@/(public)/home/components/hero';
import Navbar from '../../components/navbar';
import Footer  from '@/components/footer';
import AboutZUTE from './components/aboutZute';
import WhatWeDo from './components/WhatWeDo';
import BecomeMember from './components/BecomeMember';
import NewsUpdates from './components/NewsUpdates';
import PreFooter from './components/PreFooter';
// import { ScrollytellingFeatures } from './components/ScrollytellingFeatures';



export default function Home(){
    return(
        <div className="min-h-screen flex flex-col">
            <Navbar/>
            <main className="flex-grow">
                <Hero/>
                <AboutZUTE/>
                <WhatWeDo/>
                <BecomeMember/>
                <NewsUpdates/>
                <PreFooter/>
            </main>
            <Footer/>
        </div>
        
        
    )
}