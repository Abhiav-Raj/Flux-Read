import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Badge, Button, Card, Heading, Text } from '@radix-ui/themes';
import { IoPlayCircleOutline, IoPauseCircleOutline } from 'react-icons/io5';
import { FiChevronRight, FiSettings } from 'react-icons/fi';
import Breadcrumbs from '../../components/Breadcrumb';
import { IoHomeOutline } from 'react-icons/io5';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function FixationExercise() {
  const location = useLocation();
  const [exercise, setExercise] = useState([]);
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(300);
  const [highlightColor, setHighlightColor] = useState('lightgreen');

  // Ref for scrolling container
  const scrollContainerRef = useRef(null);
  const wordRefs = useRef([]);

  // Fetch exercise data based on age group
  useEffect(() => {
    const fetchExerciseByAge = async () => {
      try {
        if (!location.state?.maxAge) return;
        const response = await axios.get(`http://localhost:8080/exercise/getByAge/${location.state.maxAge}`);
        setExercise(response.data || []);
        toast.success('Exercise fetched successfully!');
      } catch (error) {
        console.error('Error fetching exercise:', error);
        toast.error('Failed to fetch exercise. Please try again.');
      }
    };
    fetchExerciseByAge();
  }, [location.state?.maxAge]);

  // Extract sample text from fetched exercise
  useEffect(() => {
    if (exercise.length > 0) {
      const sampleText = exercise[0]?.content?.text || '';
      setWords(sampleText.split(' '));
    }
  }, [exercise]);

  // Function to start or pause the exercise
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Function to move to the next word
  const nextWord = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex < words.length - 1) {
        return prevIndex + 1;
      } else {
        setIsPlaying(false);
        return prevIndex;
      }
    });
  };

  // Auto-play words based on speed
  useEffect(() => {
    let intervalId;
    if (isPlaying) {
      intervalId = setInterval(nextWord, speed);
    } else {
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [isPlaying, speed]);

  // Smooth scroll the container to follow the highlighted word
  useEffect(() => {
    if (scrollContainerRef.current && wordRefs.current[currentIndex]) {
      const container = scrollContainerRef.current;
      const highlightedWord = wordRefs.current[currentIndex];

      if (highlightedWord) {
        const containerWidth = container.clientWidth;
        const wordOffset = highlightedWord.offsetLeft;
        const wordWidth = highlightedWord.clientWidth;

        container.scrollTo({
          left: wordOffset - containerWidth / 2 + wordWidth / 2,
          behavior: 'smooth',
        });
      }
    }
  }, [currentIndex]);

  // Construct words with smooth highlighting effect
  const renderedWords = useMemo(() => {
    return words.map((word, index) => (
      <Text
        key={index}
        ref={(el) => (wordRefs.current[index] = el)}
        className={`px-2 transition-all duration-500 ease-in-out transform ${
          index === currentIndex ? 'scale-110' : 'scale-100 opacity-80'
        }`}
        style={{
          backgroundColor: index === currentIndex ? highlightColor : 'transparent',
          padding: '4px 6px',
          borderRadius: '5px',
          transition: 'background-color 0.4s ease-in-out, transform 0.4s ease-in-out',
        }}
      >
        {word}{' '}
      </Text>
    ));
  }, [words, currentIndex, highlightColor]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Exercise 3: Fixation Type 2 Exercise', href: '/general-exercise' },
        ]}
        icon={IoHomeOutline}
      />
      <Heading as="h1" className="text-3xl font-bold mb-8">
        Exercise 3: Fixation Type 2 Exercise
      </Heading>

      {/* Scrolling container for words */}
      <Card className="p-6 mb-8">
        <div className="flex justify-between items-center">
          <div
            ref={scrollContainerRef}
            className="flex items-center space-x-2 overflow-x-auto whitespace-nowrap max-w-full p-2 border rounded-lg"
            style={{ scrollBehavior: 'smooth' }}
          >
            {renderedWords}
          </div>
          {/* Play/Pause button */}
          <Button onClick={handlePlayPause} variant="ghost" color="blue" className="flex items-center space-x-2">
            {isPlaying ? <IoPauseCircleOutline className="text-xl" /> : <IoPlayCircleOutline className="text-xl" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </Button>
          {/* Badge and Settings button */}
          <div className="flex items-center space-x-2">
            <Badge color="gray">
              {currentIndex + 1}/{words.length}
            </Badge>
            <Button variant="ghost" color="gray" className="flex items-center space-x-1">
              <FiSettings className="text-lg" />
              <span>Settings</span>
              <FiChevronRight className="text-lg" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Settings Card */}
      <Card className="p-6">
        <Heading as="h2" className="text-xl font-bold mb-4">Settings</Heading>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <span>Speed:</span>
            <select
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="border rounded p-2"
            >
              <option value={300}>Slow</option>
              <option value={200}>Medium</option>
              <option value={100}>Fast</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <span>Highlight Color:</span>
            <select
              value={highlightColor}
              onChange={(e) => setHighlightColor(e.target.value)}
              className="border rounded p-2"
            >
              <option value="lightgreen">Green</option>
              <option value="lightblue">Blue</option>
              <option value="lightpurple">Purple</option>
            </select>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default FixationExercise;
