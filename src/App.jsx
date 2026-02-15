import React, { useState, useEffect } from 'react';
import { Heart, Timer, Flame, AlertCircle } from 'lucide-react';

const VALID_LICENSE_KEY = "SPICY2024";

const KNOW_ME_QUESTIONS = [
  "What's my favorite color?",
  "What's my love language?",
  "What's my favorite movie?",
  "What's my favorite position in bed?",
  "What's my biggest fear?",
  "What's my dream vacation destination?",
  "What's my favorite food?",
  "What's the first thing I notice about someone?",
  "What's my biggest turn-on?",
  "What's my favorite way to be kissed?",
  "What's my go-to comfort meal?",
  "What's my favorite time of day to be intimate?",
  "What body part of yours do I love most?",
  "What's my biggest insecurity?",
  "What's my favorite pet name you call me?",
  "What's my ideal date night?",
  "What's my favorite song right now?",
  "What's the sexiest thing I've ever worn?",
  "What's my biggest fantasy?",
  "What's my favorite way you touch me?",
  "What's my childhood dream job?",
  "What's my favorite season?",
  "What do I find most attractive about you?",
  "What's my guilty pleasure TV show?",
  "What's the kinkiest thing I've admitted to you?",
  "What's my favorite scent on you?",
  "What's my biggest relationship dealbreaker?",
  "What makes me feel most loved?",
  "What's my favorite thing about our sex life?",
  "What's the one thing I always say during intimacy?"
];

const DARE_CARDS = [
  "Drink 3 glasses (8oz each) of water straight without stopping",
  "Yell out the window: 'I LOVE TO LICK BUTT!'",
  "Do 20 jumping jacks while singing your favorite song",
  "Text your best friend 'I just learned something spicy about my partner'",
  "Speak in a British accent for the next 5 minutes",
  "Do your best impression of your partner during intimacy",
  "Post on social media: 'My partner is hotter than yours'",
  "Eat a spoonful of hot sauce or mustard",
  "Dance with no music for 2 minutes",
  "Let your partner draw on your face with lipstick",
  "Do 10 pushups while your partner sits on your back",
  "Wear your underwear on your head for 3 minutes",
  "Tell an embarrassing childhood story",
  "Let your partner go through your phone for 2 minutes",
  "Sing 'I'm a Little Teapot' with full choreography",
  "Do your best sexy walk across the room 3 times",
  "Let your partner style your hair however they want",
  "Confess your most embarrassing bedroom moment",
  "Do the worm across the floor",
  "Speak only in rhymes for the next 3 minutes",
  "Let your partner tickle you for 30 seconds without moving",
  "Recreate the most awkward pose from your partner's social media",
  "Eat a raw onion slice without reacting",
  "Do 15 squats while complimenting your partner",
  "Let your partner put makeup on you (blindfolded)",
  "Plank for 1 minute while your partner distracts you",
  "Serenade your partner with a love song dramatically",
  "Walk like a crab around the room twice",
  "Tell your partner's most embarrassing moment you witnessed",
  "Do your best impersonation of a celebrity during sex"
];

const SPICY_CARDS = [
  "Kiss your partner's neck for 30 seconds",
  "Give a long, full-body hug with passion for 2 minutes",
  "Kiss for 1 minute straight without breaking",
  "Take your partner's shirt off slowly",
  "Take your partner's pants off",
  "Tell them exactly how much you love them and why",
  "Tell them what made you fall in love with them",
  "Give them a sensual shoulder and neck massage for 3 minutes",
  "Whisper your deepest fantasy in their ear",
  "Kiss every finger on their hand slowly",
  "Trace your partner's lips with your finger, then kiss them",
  "Give them a passionate forehead kiss while holding their face",
  "Run your hands through their hair while maintaining eye contact",
  "Kiss your way from their hand to their shoulder",
  "Tell them the sexiest thing they've ever done",
  "Undress yourself slowly while they watch",
  "Give them a soft bite on their earlobe",
  "Slow dance together with full body contact",
  "Describe in detail what you want to do to them later",
  "Give them a sensual foot massage",
  "Kiss their collarbone and chest area",
  "Straddle your partner and make out for 2 minutes",
  "Tell them your favorite physical feature of theirs and kiss it",
  "Remove one piece of your clothing and one of theirs",
  "Give them goosebumps by lightly touching their arms and back",
  "Look into their eyes and tell them what turns you on most about them",
  "Kiss their stomach softly multiple times",
  "Give them a lap dance for 1 minute",
  "Nibble and kiss along their jawline",
  "Tell them exactly where you want them to touch you right now"
];

export default function DareOrSpicyGame() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [error, setError] = useState('');
  const [currentDeck, setCurrentDeck] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [timerActive, setTimerActive] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [usedCards, setUsedCards] = useState({ knowMe: [], dare: [], spicy: [] });

  useEffect(() => {
    let interval;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      handleTimeout();
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const handleLogin = () => {
    if (licenseKey === VALID_LICENSE_KEY) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid license key. Please try again.');
    }
  };

  const startTimer = () => {
    setTimeLeft(15);
    setTimerActive(true);
    setShowAnswer(false);
  };

  const handleTimeout = () => {
    setShowAnswer(true);
    setCurrentDeck('dare');
    pickRandomCard('dare');
  };

  const handleWrongAnswer = () => {
    setTimerActive(false);
    setCurrentDeck('dare');
    pickRandomCard('dare');
  };

  const handleCorrectAnswer = () => {
    setTimerActive(false);
    setCurrentDeck('spicy');
    pickRandomCard('spicy');
  };

  const pickRandomCard = (deck) => {
    const deckMap = {
      knowMe: KNOW_ME_QUESTIONS,
      dare: DARE_CARDS,
      spicy: SPICY_CARDS
    };
    
    const cards = deckMap[deck];
    const availableIndices = cards
      .map((_, i) => i)
      .filter(i => !usedCards[deck].includes(i));
    
    if (availableIndices.length === 0) {
      setUsedCards(prev => ({ ...prev, [deck]: [] }));
      setCurrentCardIndex(Math.floor(Math.random() * cards.length));
    } else {
      const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
      setCurrentCardIndex(randomIndex);
      setUsedCards(prev => ({
        ...prev,
        [deck]: [...prev[deck], randomIndex]
      }));
    }
  };

  const startNewQuestion = () => {
    setCurrentDeck('knowMe');
    pickRandomCard('knowMe');
    startTimer();
  };

  const resetGame = () => {
    setCurrentDeck(null);
    setCurrentCardIndex(0);
    setTimeLeft(15);
    setTimerActive(false);
    setShowAnswer(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-red-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-pink-500 to-red-500 p-4 rounded-full">
              <Heart className="w-12 h-12 text-white" fill="white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
            Dare or Spicy
          </h1>
          <p className="text-center text-gray-600 mb-6">A couples game for 18+</p>
          
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter License Key"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none"
            />
            
            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-red-600 transition-all transform hover:scale-105"
            >
              Enter Game
            </button>
          </div>
          
          <p className="text-xs text-gray-500 text-center mt-6">
            This game contains adult content. Must be 18+ to play.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-red-500 to-purple-600 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-4">
          <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
            Dare or Spicy
          </h1>

          {!currentDeck && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <p className="text-gray-700 text-lg mb-4">Choose how to start:</p>
                <button
                  onClick={startNewQuestion}
                  className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-pink-600 hover:to-red-600 transition-all transform hover:scale-105 shadow-lg"
                >
                  Start New Question
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-xl text-center">
                  <h3 className="font-bold text-blue-800 mb-2">Know Me?</h3>
                  <p className="text-sm text-blue-700">30 intimate questions</p>
                </div>
                <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-6 rounded-xl text-center">
                  <h3 className="font-bold text-orange-800 mb-2">Dare</h3>
                  <p className="text-sm text-orange-700">30 fun challenges</p>
                </div>
                <div className="bg-gradient-to-br from-pink-100 to-pink-200 p-6 rounded-xl text-center">
                  <Flame className="w-6 h-6 mx-auto mb-2 text-pink-600" />
                  <h3 className="font-bold text-pink-800 mb-2">Spicy</h3>
                  <p className="text-sm text-pink-700">30 sensual activities</p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-bold mb-3 text-gray-800">How to Play:</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Partner asks a "Know Me?" question (15 second timer)</li>
                  <li>• Correct answer → Pick a Spicy card 🔥</li>
                  <li>• Wrong answer or timeout → Pick a Dare card</li>
                  <li>• Take turns and have fun!</li>
                </ul>
              </div>
            </div>
          )}

          {currentDeck === 'knowMe' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Timer className="w-6 h-6 text-blue-600" />
                  <span className="text-3xl font-bold text-blue-600">{timeLeft}s</span>
                </div>
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">
                  Know Me?
                </span>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl min-h-[200px] flex items-center justify-center">
                <p className="text-2xl font-semibold text-blue-900 text-center">
                  {KNOW_ME_QUESTIONS[currentCardIndex]}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleCorrectAnswer}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105"
                >
                  ✓ Correct Answer
                </button>
                <button
                  onClick={handleWrongAnswer}
                  className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 rounded-xl font-semibold hover:from-red-600 hover:to-orange-600 transition-all transform hover:scale-105"
                >
                  ✗ Wrong Answer
                </button>
              </div>
            </div>
          )}

          {currentDeck === 'dare' && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <span className="bg-orange-100 text-orange-800 px-6 py-2 rounded-full font-semibold text-lg">
                  Dare Challenge
                </span>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl min-h-[200px] flex items-center justify-center">
                <p className="text-2xl font-semibold text-orange-900 text-center">
                  {DARE_CARDS[currentCardIndex]}
                </p>
              </div>

              <button
                onClick={resetGame}
                className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-4 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all"
              >
                Next Round
              </button>
            </div>
          )}

          {currentDeck === 'spicy' && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <span className="bg-pink-100 text-pink-800 px-6 py-2 rounded-full font-semibold text-lg flex items-center gap-2">
                  <Flame className="w-5 h-5" />
                  Spicy Time
                </span>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-8 rounded-2xl min-h-[200px] flex items-center justify-center border-2 border-pink-200">
                <p className="text-2xl font-semibold text-pink-900 text-center">
                  {SPICY_CARDS[currentCardIndex]}
                </p>
              </div>

              <button
                onClick={resetGame}
                className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-4 rounded-xl font-semibold hover:from-pink-600 hover:to-red-600 transition-all transform hover:scale-105"
              >
                Next Round
              </button>
            </div>
          )}
        </div>

        <div className="text-center text-white text-sm">
          <p>© 2024 Dare or Spicy • For Adults 18+ Only</p>
        </div>
      </div>
    </div>
  );
}
