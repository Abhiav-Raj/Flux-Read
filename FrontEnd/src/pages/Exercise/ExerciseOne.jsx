import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Heading,
  Flex,
  Callout,
  Badge,
  Dialog,
} from "@radix-ui/themes";
import { IoPlayCircleOutline, IoPauseCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { toast } from "react-hot-toast";
import axios from "axios";
import { FaRegArrowAltCircleRight } from "react-icons/fa";

function ExerciseOne() {
  const [exercise, setExercise] = useState([]);
  const [isReading, setIsReading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [readingSpeed, setReadingSpeed] = useState(null);
  const [showReadingSpeedPopup, setShowReadingSpeedPopup] = useState(false);
  const [isReadingStopped, setIsReadingStopped] = useState(false);

  useEffect(() => {
    const getExercisebyAge = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/exercise/getByAge/10`);
        if (response.data.length > 0) {
          setExercise(response.data);
          toast.success("Exercise fetched successfully!");
        } else {
          toast.error("No exercises found.");
        }
      } catch (error) {
        console.error("Error fetching exercise:", error);
        toast.error("Failed to fetch exercise.");
      }
    };
    getExercisebyAge();
  }, []);

  useEffect(() => {
    let interval;
    if (isReading) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isReading]);

  useEffect(() => {
    if (!isReading) {
      setIsReadingStopped(true);
    }
  }, [isReading]);

  const handleStartReading = () => {
    setIsReading(true);
    setIsReadingStopped(false);
    setTimer(0); // Reset timer
    toast.success("Reading started!");

    const card = document.getElementById("reading-card");
    card.classList.add("start-reading-animation");
  };

  const handleEndReading = () => {
    setIsReading(false);
    calculateReadingSpeed();
    setTimeout(() => setIsReadingStopped(true), 500);

    const card = document.getElementById("reading-card");
    card.classList.remove("start-reading-animation");
  };

  const calculateReadingSpeed = () => {
    const text = exercise[0]?.content?.text;
    if (text && timer > 0) {
      const words = text.split(/\s+/).length;
      const speed = Math.floor((words / timer) * 60);

      console.log("📝 Text Content:", text);
      console.log("🔢 Word Count:", words);
      console.log("⏳ Timer (seconds):", timer);
      console.log("⚡ Calculated WPM:", speed);

      setReadingSpeed(speed);
      setShowReadingSpeedPopup(true);
    } else {
      console.error("🚨 Error: No text available to read or invalid timer.");
      toast.error("No text available to read or invalid timer.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Heading as="h1" className="text-3xl font-bold mb-4">
        Exercise 1: Read the Text Below
      </Heading>
      <Callout.Root>
        <Callout.Icon>
          <InfoCircledIcon />
        </Callout.Icon>
        <Callout.Text>
          Click "Start Reading" to begin the exercise.
        </Callout.Text>
      </Callout.Root>

      <Card className="p-6 mt-2 mb-8 bg-gray-200">
        <Flex gap="4" justify="center" align="center" mb="4">
          <Button onClick={handleStartReading} className="mr-2" disabled={isReading}>
            Start Reading <IoPlayCircleOutline />
          </Button>
          <Heading as="h2">
            <Badge size={"3"} color="gray" variant="outline">
              Timer: {timer} Sec
            </Badge>
          </Heading>
        </Flex>

        {/* Scrollable Text Area */}
        <Card className="mb-8 w-full max-w-lg mx-auto p-4 bg-white overflow-auto" id="reading-card" style={{ maxHeight: "300px" }}>
          <div key={timer}>
            {exercise[0]?.content?.text || "Loading text..."}
          </div>
        </Card>

        <Flex gap="4" justify="center" align="center" mb="4">
          <Button onClick={handleEndReading} className="mr-2" disabled={!isReading}>
            End Reading <IoPauseCircleOutline />
          </Button>
          <Link to="/comprehension" state={{ exercisedata: exercise[0], readingSpeed: readingSpeed }}>
            <Button className="mr-2" disabled={!isReadingStopped}>
              Next <FaRegArrowAltCircleRight />
            </Button>
          </Link>
        </Flex>
      </Card>

      <Dialog.Root open={showReadingSpeedPopup} onOpenChange={setShowReadingSpeedPopup}>
        <Dialog.Content>
          <Card className="p-6 mt-4">
            <Heading as="h2" className="text-xl font-bold mb-4">
              Reading Speed
            </Heading>
            <p>Your reading speed is {readingSpeed} WPM.</p>
            <Flex justify="center" mt="4">
              <Button onClick={() => setShowReadingSpeedPopup(false)}>Close</Button>
            </Flex>
          </Card>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
}

export default ExerciseOne;
