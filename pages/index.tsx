// pages/index.js

import { use, useState } from 'react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import QuestionCard from '@/components/QuestionCard';
import PastQuestions from '@/components/PastQuestions';

export default function Home() {
  if (typeof window !== "undefined") {
    localStorage.setItem('pastQuestions', localStorage.getItem('pastQuestions') || JSON.stringify([]));
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-between">
      
      <Header/>
      

      <main className="flex-grow flex items-center flex-col justify-center space-y-6 md:space-y-0 md:space-x-6 md:flex-row py-12">
          
          {/* Welcome Message */}
          <div className="max-w-4xl w-full flex flex-col items-center justify-center mb-8 space-y-4 text-center md:text-left">
          
          <QuestionCard />
          </div>
          <PastQuestions />
      </main>


      <Footer/>
      
    </div>
  );
}
