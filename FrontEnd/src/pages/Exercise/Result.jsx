import React, { useEffect, useState } from "react";
import { Button, Card, Heading, Flex, Badge, Callout } from "@radix-ui/themes";
import Breadcrumbs from "../../components/Breadcrumb";
import { IoHomeOutline } from "react-icons/io5";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaSave, FaHistory } from "react-icons/fa";
import axios from "axios";
import ConfettiExplosion from "react-confetti-explosion";
import { MdSportsScore } from "react-icons/md";
import { IoSpeedometer } from "react-icons/io5";
import { getUserData } from "../../services/authService";
import { toast } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

function Result() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [userResults, setUserResults] = useState([]);
  const [showResults, setShowResults] = useState(false); // Toggle for previous results

  console.log("State:", state);

  const userdata = getUserData();
  const percentageCorrect = state?.percentageCorrect;
  const readingSpeed = state?.readingSpeed;
  const exercisedata = state?.exercisedata;
  const userEmail = userdata?.user?.userEmail;

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (userDetails?._id) {
      fetchUserResults(userDetails._id);
    }
  }, [userDetails]);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Unauthorized! Please log in.");
        navigate("/login");
        return;
      }

      const decoded = jwtDecode(token);
      if (Date.now() >= decoded.exp * 1000) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        "http://localhost:8080/user/getAllDetails",
        { email: userEmail },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      setUserDetails(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to fetch user details.");
    }
  };

  const fetchUserResults = async (userId) => {
    try {
      if (!userId) return;
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Unauthorized! Please log in.");
        navigate("/login");
        return;
      }

      const response = await axios.get(`http://localhost:8080/user/results/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserResults(response.data);
    } catch (error) {
      console.error("Error fetching results:", error);
      toast.error("Failed to load results.");
    }
  };

  const handleResult = async () => {
    if (!userDetails?._id || !exercisedata?._id) {
      toast.error("Missing user or exercise data.");
      return;
    }

    try {
      await axios.post("http://localhost:8080/user/result/create", {
        userId: userDetails._id,
        exerciseId: exercisedata._id,
        score: Math.round(percentageCorrect),
        wpm: readingSpeed,
      });

      toast.success("Result saved successfully!");
      fetchUserResults(userDetails._id);
    } catch (error) {
      console.error("Error in handleResult:", error);
      toast.error("Failed to save the result.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Exercise 1", href: "/general-exercise" }, { label: "Result" }]} icon={IoHomeOutline} />

      <Heading as="h1" className="text-3xl font-bold mb-8">Result</Heading>

      <Callout.Root className="mb-4">
        <Callout.Icon><IoSpeedometer className="text-2xl" /></Callout.Icon>
        <Callout.Text>Your reading speed is the number of words you can read in a minute. The average adult reading speed is 200-250 words per minute.</Callout.Text>
      </Callout.Root>

      <Card className="p-6 mb-8">
        {readingSpeed >= 100 && <ConfettiExplosion numberOfPieces={200} duration={5400} force={0.8} width={1600} />}
        <Heading as="h2" className="text-xl font-bold mb-4">
          Your Score <MdSportsScore className="inline" /> : <span className="text-green-500">+{Math.round(percentageCorrect)} Score Points</span>
        </Heading>
        <Flex direction="column" gap="2" className="mb-4">
          <Heading as="h3" className="text-lg font-bold">Reading Speed : {readingSpeed} WPM</Heading>
          <Heading as="h3" className="text-lg font-bold">Comprehension Percentage: <Badge size={"3"}>{percentageCorrect}%</Badge></Heading>
        </Flex>
      </Card>

      {/* Button to toggle previous results */}
      <Button onClick={() => setShowResults(!showResults)} className="mb-4">
        <FaHistory className="mr-2" /> {showResults ? "Hide" : "Show"} Previous Results
      </Button>

      {/* Previous Results - Display when showResults is true */}
      {showResults && userResults.length > 0 && (
        <Card className="p-6 mb-8 overflow-y-auto max-h-60 border border-gray-300 shadow-lg">
          <Heading as="h2" className="text-xl font-bold mb-4">Previous Results</Heading>
          <table className="w-full border-collapse">
  <thead className="bg-gray-200 dark:bg-gray-800">
    <tr className="text-gray-900 dark:text-white">
      <th className="border px-4 py-2">Date</th>
      <th className="border px-4 py-2">Score</th>
      <th className="border px-4 py-2">WPM</th>
    </tr>
  </thead>
  <tbody>
  {userResults.slice().reverse().map((result) => ( // Reverse the order
    <tr key={result._id} className="text-center bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700">
      <td className="border px-4 py-2 text-gray-900 dark:text-white">
        {new Date(result.createdAt).toLocaleString()}
      </td>
      <td className="border px-4 py-2 text-gray-900 dark:text-white">{result.score}</td>
      <td className="border px-4 py-2 text-gray-900 dark:text-white">{result.wpm}</td>
    </tr>
  ))}
</tbody>

</table>

        </Card>
      )}

      <Flex gap="4" justify="center" alignItems="center">
        <Link to="/" className="flex items-center"><Button className="mr-2"><IoHomeOutline className="mr-1" /> Home</Button></Link>
        <Button onClick={handleResult}><FaSave className="mr-1" /> Save Result & Continue</Button>
      </Flex>
    </div>
  );
}

export default Result;

