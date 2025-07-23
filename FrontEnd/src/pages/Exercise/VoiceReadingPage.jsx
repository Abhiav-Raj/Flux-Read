import React, { useState, useEffect } from 'react';
import { Badge, Button, Callout, Card, Heading } from '@radix-ui/themes';
import { Text } from '@radix-ui/themes';
import { FaMicrophone } from 'react-icons/fa';
import { tw } from 'twind';
import Breadcrumbs from '../../components/Breadcrumb';
import { IoHomeOutline } from 'react-icons/io5';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import ResultPage from './VoiceReading/VoiceResult';

function VoiceReadingPage() {
  const Breadcrumbitems = [
    { href: '/', label: 'Home' },
    { href: '/exercise', label: 'Exercise' },
    { href: '/exercise/voicereading', label: 'Voice Reading' },
  ];
  const [originalText, setOriginalText] = useState(''); // State to store the original text
  const [currentWordIndex, setCurrentWordIndex] = useState(0); // State to track the current word index
  const [mistakes, setMistakes] = useState([]); // State to store mistakes
  const [isListening, setIsListening] = useState(false);
  const [showResult, setShowResult] = useState(false); // State to control result display
  const recognitionRef = React.useRef(null);
  const [isRestarting, setIsRestarting] = useState(false); // New state to track if recognition is restarting

  useEffect(() => {
    // Simulated original content
    const sampleText =
      'This sample text for voice model Please read this text out loud';
    setOriginalText(sampleText);

    // Check if SpeechRecognition is available in the browser
    if (!window.webkitSpeechRecognition) {
      console.error("Speech Recognition is not supported by this browser.");
      return;
    }
  }, []);

  useEffect(() => {
    if (isListening) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.maxAlternatives = 5; // Allow up to 5 alternative results

      recognitionRef.current.onstart = () => {
        console.log("Speech recognition started.");
      };

      recognitionRef.current.onresult = (event) => {
        console.log("onresult triggered: ", event);
        const transcript = event.results[event.results.length - 1][0].transcript.trim();
        console.log("Transcript: ", transcript);

        const currentWord = originalText.split(' ')[currentWordIndex];
        console.log("Current word: ", currentWord);

        if (event.results[event.results.length - 1].isFinal) {
          // Use more lenient matching for the spoken word
          const isMatch = transcript.toLowerCase().includes(currentWord.toLowerCase());
          
          if (isMatch) {
            // Move to the next word if the current word is recognized in the transcript
            setCurrentWordIndex((prevIndex) => {
              const nextIndex = prevIndex + 1;
              if (nextIndex >= originalText.split(' ').length) {
                setShowResult(true); // Show the result when all words are completed
              }
              return nextIndex;
            });
          } else {
            // Add mistake to the list if the word is not recognized correctly
            setMistakes((prevMistakes) => [...prevMistakes, currentWord]);
          }
        }
      };

      recognitionRef.current.onend = () => {
        console.log("Speech recognition ended.");

        // Only restart recognition if it's not already restarting
        if (!isRestarting && currentWordIndex < originalText.split(' ').length) {
          setIsRestarting(true); // Set flag to indicate recognition is restarting
          recognitionRef.current.start(); // Restart recognition
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error: ", event.error);
        if (event.error === 'aborted') {
          // Handle aborted errors and retry recognition
          recognitionRef.current.start();
        }
      };

      recognitionRef.current.start(); // Start recognition
    }
  }, [isListening, currentWordIndex, originalText, isRestarting]);

  const handleSpeechRecognition = () => {
    console.log("Starting Speech Recognition...");
    setIsListening(true);
  };

  const handleStopRecognition = () => {
    console.log("Stopping Speech Recognition...");
    setIsListening(false);
    recognitionRef.current.stop();
    setIsRestarting(false); // Reset the restarting flag when manually stopping recognition
  };

  const handleRestart = () => {
    setShowResult(false); // Reset showResult state to false
    setCurrentWordIndex(0); // Reset currentWordIndex
    setMistakes([]); // Clear mistakes
  };

  if (showResult) {
    return (
      <ResultPage
        originalText={originalText}
        mistakes={mistakes}
        handleRestart={handleRestart}
      />
    );
  }

  return (
    <div className={tw`max-w-4xl mx-auto px-4 py-8`}>
      <Heading as="h1" className={tw`text-3xl font-bold mb-8`}>
        Voice Reading Exercise
      </Heading>
      <Breadcrumbs items={Breadcrumbitems} icon={IoHomeOutline} />
      <Callout.Root className="mb-2">
        <Callout.Icon>
          <InfoCircledIcon />
        </Callout.Icon>
        <Callout.Text>Read the following text out loud</Callout.Text>
      </Callout.Root>

      <Card className={tw`p-6 mb-8`}>
        <Text>
          {originalText.split(' ').map((word, index) => (
            <span
              key={index}
              className={tw`font-semibold`}
              style={{
                backgroundColor: currentWordIndex === index ? '#8cff32' : 'transparent',
                padding: '2px',
              }}
            >
              {word}{' '}
            </span>
          ))}
        </Text>
      </Card>
      <div>
        <strong>Mistakes:</strong>{' '}
        {mistakes.length > 0 ? (
          <Badge color="red">{mistakes.join(', ')}</Badge>
        ) : (
          <span>No mistakes</span>
        )}
      </div>
      <div className={tw`flex items-center space-x-4 mt-4`}>
        <Button
          onClick={handleSpeechRecognition}
          disabled={isListening}
          className={tw`flex items-center space-x-1`}
        >
          <FaMicrophone className={tw`${isListening && 'animate-pulse'}`} />
          <span>{isListening ? 'Listening...' : 'Start Reciting'}</span>
        </Button>
        {isListening && (
          <Button onClick={handleStopRecognition} className={tw`flex items-center space-x-1`}>
            Stop Reciting
          </Button>
        )}
      </div>
    </div>
  );
}

export default VoiceReadingPage;
