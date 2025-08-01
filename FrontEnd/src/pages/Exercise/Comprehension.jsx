import React, { useState, useEffect } from 'react';
import { Button, Card, Heading, Text, Callout } from '@radix-ui/themes';
import Breadcrumbs from '../../components/Breadcrumb';
import { IoHomeOutline } from 'react-icons/io5';
import { Link, useLocation } from 'react-router-dom';
import { InfoCircledIcon } from '@radix-ui/react-icons';

function Comprehension() {
  const { state } = useLocation();
  console.log('State:', state);
  const exercisedata = state?.exercisedata;
  const readingSpeed = state?.readingSpeed;
  // console.log(exercisedata);
  const questions = exercisedata?.content?.mcqs;

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [percentageCorrect, setPercentageCorrect] = useState(0);
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);
  const [answersChecked, setAnswersChecked] = useState(false);

  const handleAnswerSelect = (questionIndex, selectedOption) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: { answer: selectedOption, correct: null },
    }));
  };

  useEffect(() => {
    // Check if all questions are answered whenever selectedAnswers changes
    const answeredQuestions = Object.keys(selectedAnswers);
    setAllQuestionsAnswered(answeredQuestions?.length === questions?.length);
  }, [selectedAnswers, questions]);

  const handleCheckAnswers = () => {
    if (allQuestionsAnswered) {
      const correctAnswers = questions.map((question) => question.correctAnswer);
      const numQuestions = questions?.length;
      let numCorrect = 0;
  
      for (let i = 0; i < numQuestions; i++) {
        const correctAnswer = correctAnswers[i]?.trim().toLowerCase();
        const selectedAnswer = selectedAnswers[i]?.answer?.trim().toLowerCase();
  
        if (correctAnswer === selectedAnswer) {
          numCorrect++;
          setSelectedAnswers((prevAnswers) => ({
            ...prevAnswers,
            [i]: { ...prevAnswers[i], correct: true },
          }));
        } else {
          setSelectedAnswers((prevAnswers) => ({
            ...prevAnswers,
            [i]: { ...prevAnswers[i], correct: false },
          }));
        }
      }
  
      // ✅ Calculate Correct Answer Percentage
      const percentageCorrect = (numCorrect / numQuestions) * 100;
      setPercentageCorrect(percentageCorrect);
      setAnswersChecked(true);
    } else {
      alert('Please answer all questions before checking your answers.');
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Exercise 1: ', href: '/exercise-one' },
          { label: 'Comprehension' },
        ]}
        icon={IoHomeOutline}
      />
      <Heading as="h1" className="text-3xl font-bold mb-4">
        Comprehension Questions
      </Heading>

      <Callout.Root className="mb-4">
        <Callout.Icon>
          <InfoCircledIcon />
        </Callout.Icon>
        <Callout.Text>
          Choose the correct answer for each question. Once you have answered all the questions, click the "Check Your Answers" button to see your results.
        </Callout.Text>
      </Callout.Root>

      <Card className="p-6 mb-8">
        <form id="comprehension_form">
          {questions &&
            questions.map((question, index) => (
              <div key={index} className="mb-4">
                <Text className="block font-bold mb-2">Q-{index+1} {question.question}</Text>
                {question.options.map((option, optionIndex) => (
                  <label key={optionIndex} className="inline-block mr-4">
                    <input
                      type="radio"
                      name={`question_${index}`}
                      value={option}
                      checked={selectedAnswers[index]?.answer === option}
                      onChange={() => handleAnswerSelect(index, option)}
                      disabled={answersChecked}
                    />
                    <span
                      className={`ml-2 ${
                        answersChecked && selectedAnswers[index]?.answer === option && selectedAnswers[index]?.correct
                          ? 'text-green-500'
                          : answersChecked && selectedAnswers[index]?.answer === option && !selectedAnswers[index]?.correct
                          ? 'text-red-500'
                          : ''
                      }`}
                    >
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            ))}
        </form>
      </Card>

      {allQuestionsAnswered && !answersChecked && (
        <div className="flex justify-center">
          <Button variant="ghost" onClick={handleCheckAnswers}>
            Check Your Answers
          </Button>
        </div>
      )}

      <Link to="/result" state={{readingSpeed:readingSpeed,  percentageCorrect:percentageCorrect, exercisedata:exercisedata}}>
        <Button className="mr-2 mt-4">
          Next <IoHomeOutline />
        </Button>
      </Link>
    </div>
  );
}

export default Comprehension;
