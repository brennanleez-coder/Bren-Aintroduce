import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import Button from './Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Spinner from './Spinner';
import {Question as QuestionType} from '../types/questions';

const QuestionCard = () => {
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [askedQuestion, setAskedQuestion] = useState<string | null>(null);
  const [disableSubmit, setDisableSubmit] = useState(false);

  const BASE_URL = 'http://localhost:3000/api';
  const formik = useFormik({
    initialValues: {
      question: '',
      answer: ''
    },
    validationSchema: Yup.object({
      question: Yup.string()
        .required('Required field')
        .test('wordCount', 'Must be 200 characters or less', value => {
          if (!value) return true;
          return value.length <= 200;
        })
    }),
    onSubmit: async (values, {setFieldError, resetForm}) => {
      setIsLoading(true);
      setShowModal(true);
      setAskedQuestion(values.question)
      let pastQuestions = JSON.parse(localStorage.getItem("pastQuestions") || "[]");

      if (isDuplicate(values.question)) {
        setFieldError("question", "This question has already been asked.");
        setIsLoading(false);
        setShowModal(false);
        setDisableSubmit(true);
        return;
      }
      try {
        const response = await axios.post(`${BASE_URL}/generateResponse`, {
          userInput: values.question,
        });
        // console.log(response.data.reply.content);
        if (response.data && response.data.reply) {
          setAnswer(response?.data.reply.content);
        }
        const qna: QuestionType = {
          question: values.question,
          answer: response.data.reply.content
        }
        localStorage.setItem('pastQuestions', JSON.stringify([...pastQuestions, qna]));
    
      
      resetForm();
      } catch (error: unknown) {
        setAnswer(error instanceof Error ? error.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    }
  });
  const closeModal = () => {
    setShowModal(false);
    setAnswer('');
}


  const questions = [
    { label: "Passion?", text: "Tell me about your passion" },
    { label: "Major", text: "What is your major?" },
    { label: "Time at NUS?", text: "Tell me about your time at NUS."},
    { label: "Influence of Badminton?", text: "How has badminton influenced your professional life?" },
  ];
  const isDuplicate = (newQuestion: string): boolean => {
    const pastQuestions: QuestionType[] = JSON.parse(localStorage.getItem("pastQuestions") || "[]");
    return pastQuestions.some(q => q.question.toLowerCase() === newQuestion.toLowerCase());
  };

  
  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md w-full space-y-6">
          <div className="text-center text-gray-400">
          <p>Quick Questions:</p>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {questions.map((question, index) => (
              <Button key={index} onClick={() => formik.setFieldValue("question",question.text)}>
                {question.label}
              </Button>
            ))}
          </div>

        </div>


          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="neu-input">
              <textarea
                id="question"
                name="question"
                value={formik.values.question}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Ask your question..."
                className="w-full p-4 bg-gray-800 rounded-xl focus:outline-none text-gray-300 placeholder-gray-500"
                rows={4}
              ></textarea>
              
            </div>
            {formik.touched.question && formik.errors.question ? (
                <div className="text-red-500 mt-2">Error: {formik.errors.question}</div>
              ) : null}
            
            <div className="flex gap-3">
              <Button
                type="button"
                onClick={() => {
                  formik.resetForm();
                  setAnswer('');
                }}
              >
                Clear
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
          {showModal && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-gray-800 rounded-xl p-8 max-w-2xl w-full">
              <h2 className="text-xl mb-4 text-gray-400">Your Question:</h2>
              <p className="mb-6 text-gray-300">{askedQuestion}</p>

                {isLoading ? (
                  <div className="flex justify-center">
                    <Spinner />
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl mb-4 text-gray-400">AI Response:</h2>
                    <p className="mb-6 text-gray-300">{answer}</p>
                  </>
                )}

                <div className="flex justify-center mt-2">
                  <button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-xl focus:outline-none" onClick={closeModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
  )
}

export default QuestionCard
