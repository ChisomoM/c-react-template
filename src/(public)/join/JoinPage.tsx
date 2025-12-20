import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HelpCircle
} from 'lucide-react';
import JoinZuteForm from '../../components/JoinZuteForm';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import PageHero from '@/components/PageHero';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function JoinPage() {
  const [activeTab, setActiveTab] = useState('why-join');

  const faqs = [
    {
      question: "What are the membership fees?",
      answer: "Membership fee is only 2% and is deducted directly from your salary through checkoff. The standard monthly contribution is affordable and provides access to all ZUTE benefits including ECOS investment opportunities.",
    },
    {
      question: "How long does approval take?",
      answer: "Most applications are reviewed and approved within 2-5 business days. You'll receive email or SMS notifications about your application status.",
    },
    {
      question: "Can I join if I'm already in another union?",
      answer: "Yes, you can switch unions. However, you'll need to formally resign from your current union before your ZUTE membership becomes active. We can guide you through this process.",
    },
    {
      question: "What documents do I need?",
      answer: "You'll need clear photos/scans of your NRC (front and back), your Teaching Service Commission (TSC) number, and employment details including your school and district.",
    },
    {
      question: "Do I get immediate access to ECOS investments?",
      answer: "Yes! Once your membership is approved, you gain immediate access to ECOS investment opportunities, savings plans, and low-interest loan facilities.",
    },
    {
      question: "What if I transfer to another district?",
      answer: "Your ZUTE membership follows you anywhere in Zambia. Simply update your school and district information through your member portal, and you'll continue enjoying all benefits.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <PageHero 
        title="Join"
        highlightText="ZUTE"
        backgroundImage="/4dd7ba40-e8da-4ca4-b65e-1c2f0d4de0a3.jpg"
      />

      {/* Mobile Tabs */}
      <div className="lg:hidden bg-white border-b sticky top-16 z-40">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2 h-14">
            <TabsTrigger value="why-join" className="text-sm font-semibold">
              Why Join ZUTE
            </TabsTrigger>
            <TabsTrigger value="become-member" className="text-sm font-semibold">
              Become a Member
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <main className="flex-grow">
        {/* Desktop Split Layout */}
        <div className="hidden lg:grid lg:grid-cols-5 min-h-screen">
          {/* Left Side - Form (60%) */}
          <div className="lg:col-span-3 bg-white">
            <div className="max-w-3xl mx-auto px-8 py-12">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3 font-poppins">Become a Member</h2>
                <p className="text-lg text-gray-600">Join 5,000+ teachers building a stronger future together</p>
              </div>
              <JoinZuteForm />
            </div>
          </div>

          {/* Right Side - Scrollable Content (40%) */}
          <div className="lg:col-span-2 bg-gradient-to-br from-gray-50 to-white border-l border-gray-200">
            <div className="sticky top-20 p-8 max-h-[calc(100vh-5rem)] overflow-y-auto">
              <WhyJoinContent faqs={faqs} />
            </div>
          </div>
        </div>

        {/* Mobile Tabbed Content */}
        <div className="lg:hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="why-join" className="m-0">
              <div className="px-4 py-8">
                <WhyJoinContent faqs={faqs} />
              </div>
            </TabsContent>
            <TabsContent value="become-member" className="m-0">
              <div className="px-4 py-8 bg-gray-50">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Become a Member</h2>
                  <p className="text-gray-600">Join 5,000+ teachers building a stronger future together</p>
                </div>
                <JoinZuteForm />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Separate component for the "Why Join" content to keep code organized
interface WhyJoinContentProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

function WhyJoinContent({ faqs }: WhyJoinContentProps) {
  return (
    <>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="inline-block mb-3">
          <span className="text-[#F15A29] font-semibold text-xs uppercase tracking-wider px-3 py-1.5 bg-orange-50 rounded-full border border-orange-200">
            Empowering Teachers
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 font-poppins">
          Why Join <span className="text-[#F15A29]">ZUTE?</span>
        </h1>
        <p className="text-base text-gray-600 leading-relaxed">
          ZUTE is more than a union—it's a movement for teacher empowerment, professional growth, and economic independence. 
          Join 5,000+ teachers building a stronger teaching profession across Zambia.
        </p>
      </motion.div>

      {/* FAQ Section */}
      <section>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="w-6 h-6 text-[#F15A29]" />
            <h2 className="text-xl font-bold text-gray-900 font-poppins">Frequently Asked Questions</h2>
          </div>
          <p className="text-sm text-gray-600">Everything you need to know about joining</p>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, index: number) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-white border border-gray-200 rounded-lg px-4 overflow-hidden"
            >
              <AccordionTrigger className="text-left text-sm font-semibold text-gray-900 hover:text-[#F15A29] py-3">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600 pb-3">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </>
  );
}
