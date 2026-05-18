'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { contentAPI, quizAPI } from '@/lib/api';
import { QuestionCard, QuizTimer } from '@/components/quiz/QuizComponents';

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const contentId = params.id;

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [answers, setAnswers] = useState({}); // { 0: 'Option A', 1: 'Option B' }
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null); // API response

  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes default
  
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await contentAPI.getById(contentId);
        setContent(res.data.data.content);
        if (res.data.data.content?.mcqs?.length) {
            setTimeLeft(res.data.data.content.mcqs.length * 60); // 1 min per question
        }
      } catch (err) {
        setError('Failed to fetch quiz content');
      } finally {
        setLoading(false);
      }
    };
    if (contentId) fetchContent();
  }, [contentId]);

  useEffect(() => {
    if (loading || result) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
            clearInterval(timer);
            handleSubmit(); // Auto submit when time is up
            return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, result, content]);

  const handleSelectOption = (questionIndex, option) => {
    if (result) return;
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: option
    }));
  };

  const handleSubmit = async () => {
    if (result || isSubmitting || !content || loading) return;
    setIsSubmitting(true);
    try {
      // Map frontend answers object to API payload
      const formattedAnswers = Object.entries(answers).map(([qIndex, opt]) => ({
        questionIndex: parseInt(qIndex),
        selectedOption: opt
      }));
      
      const payload = {
        contentId,
        answers: formattedAnswers
      };
      
      const res = await quizAPI.submitQuiz(payload);
      setResult(res.data.data);
      // Optional: Scroll to top after completion
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      alert('Failed to submit quiz. Ensure you are logged in as a student.');
    } finally {
        setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <p className="text-xl text-red-500 font-semibold">{error}</p>
        <button onClick={() => router.push('/dashboard')} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
           Go Back
        </button>
      </div>
    );
  }

  if (!content || !content.mcqs || content.mcqs.length === 0) {
      return (
        <div className="flex justify-center items-center h-screen">
           <p className="text-gray-500 text-xl">No MCQs available for this content.</p>
        </div>
      );
  }

  const allQuestionsAnswered = content.mcqs.every((_, i) => answers[i] !== undefined);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 pb-24 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 sticky top-0 bg-white/95 backdrop-blur z-10 py-4 border-b">
        <div className="mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{content.title}</h1>
            <p className="text-gray-500 text-sm md:text-base mt-1">
               {result ? 'Quiz Completed' : 'Answer all complete questions below.'}
            </p>
        </div>
        {!result && (
            <div className="shrink-0 w-full md:w-auto">
               <QuizTimer timeLeft={timeLeft} totalTime={content.mcqs.length * 60} />
            </div>
        )}
      </div>

      {result && (
        <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-xl flex flex-col md:flex-row items-center justify-between shadow-sm">
           <div>
               <h2 className="text-2xl font-extrabold text-green-700">Quiz Submitted Successfully!</h2>
               <p className="text-green-600 mt-1">You scored {result.percentage}% on this quiz.</p>
           </div>
           <div className="mt-4 md:mt-0 text-center">
               <div className="text-4xl font-black text-green-600 tracking-tight">
                  {result.score} <span className="text-xl text-green-500 font-semibold">/ {result.totalQuestions}</span>
               </div>
           </div>
        </div>
      )}

      <div className="space-y-6">
        {content.mcqs.map((mcq, index) => (
          <QuestionCard
            key={index}
            index={index}
            question={{ question: mcq.question, options: mcq.options }}
            selected={answers[index]}
            onSelect={(option) => handleSelectOption(index, option)}
            disabled={!!result || isSubmitting}
            showResult={!!result}
            correctAnswer={mcq.correctAnswer}
          />
        ))}
      </div>

      <div className="mt-12 flex justify-end border-t pt-6">
        {!result ? (
            <button
              onClick={handleSubmit} 
              disabled={isSubmitting || !allQuestionsAnswered}
              className={`px-8 py-3 rounded-lg font-bold text-white transition-colors duration-200 flex items-center justify-center gap-2 min-w-[200px] ${
                  isSubmitting || !allQuestionsAnswered 
                  ? 'bg-gray-400 cursor-not-allowed opacity-70' 
                  : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
              }`}
            >
              {isSubmitting ? (
                 <>
                   <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                   <span>Submitting...</span>
                 </>
              ) : (
                  'Submit Quiz'
              )}
            </button>
        ) : (
            <button
                onClick={() => router.push('/dashboard')}
                className="px-6 py-3 rounded-lg font-bold bg-gray-800 text-white hover:bg-gray-900 transition-colors shadow-md"
            >
                Return to Dashboard
            </button>
        )}
      </div>
    </div>
  );
}
