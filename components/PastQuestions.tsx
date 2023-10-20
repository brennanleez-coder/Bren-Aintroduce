// components/PastQuestions.tsx

import React, { useState, useEffect } from 'react';
import { Question as QuestionType } from '@/types/questions';
const PastQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionType | null>(null);

  useEffect(() => {
    const storedQuestions = JSON.parse(localStorage.getItem("pastQuestions") || "[]");
    setQuestions(storedQuestions);
}, [questions]);

  const filteredQuestions = questions.filter(
    question => question?.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clearQuestions = () => {
    localStorage.removeItem("pastQuestions");
    setQuestions([]);
  };
  const handleQuestionClick = (question: QuestionType) => {
    setSelectedQuestion(question);
    setShowModal(true);
  }
  const closeModal = () => {
    setSelectedQuestion(null);
    setShowModal(false);
  }
  
  return (
    <div className="w-full max-w-4xl">
      {questions.length ? (
        <>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search past questions..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full p-3 rounded-xl bg-gray-800 focus:ring-2 focus:ring-gray-700 focus:outline-none text-gray-300 placeholder-gray-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {filteredQuestions.map((question, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-xl shadow-2xl cursor-pointer"
              onClick={() => handleQuestionClick(question)}>
                <span className="text-gray-400 text-sm">Question {index + 1}:</span>
                <p className="text-gray-300 mt-2">{question?.question}</p>
              </div>
            ))}
          </div>
          <button 
            onClick={clearQuestions} 
            className="mt-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-xl focus:outline-none"
          >
            Clear Past Questions
          </button>
        </>
      ) : (
        <div className="bg-gray-800 p-6 rounded-xl shadow-2xl text-center text-gray-400">
          <p>You haven&apos;t asked any questions yet!</p>
          <p className="mt-2">Start a conversation by submitting a question above.</p>
        </div>
      )}
      {showModal && selectedQuestion && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 rounded-xl p-8 max-w-2xl w-full">
            <h2 className="text-xl mb-4 text-gray-400">Question:</h2>
            <p className="mb-6 text-gray-300">{selectedQuestion.question}</p>
            <h2 className="text-xl mb-4 text-gray-400">Answer:</h2>
            <p className="mb-6 text-gray-300">{selectedQuestion.answer}</p>
            <button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-xl focus:outline-none" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PastQuestions;
