// Define the game state object
// Store all dynamic values that change during gameplay
// Centralize game data so functions can read/update it easily

const state = {
    playerScore: 0,              //Tracks how many rounds the player has won
    computerScore: 0,            //Tracks how many rounds the computer has won
    roundsRemaining: 0,          // Counts down each rounds until game ends
    difficulty: "Easy",         //Stores selected difficulty level
    patternMode: false,         //Whether the computer uses prediction logic
    lastPlayerMove: null,       //Stores last move for prediction in Medium/Hard
};

// Confetti controls variables

let confettiActive = false;         //Whetther confetti is currently running
let confettiAnimationId = null;         //Stores requestAnimationFrame ID

// DOM elements references
// Connect JavaScript to HTML elements
// Allows updating text/elements

const difficultySelect = document.getElementById("difficulty-select");
const roundsSelect = document.getElementById("rounds-select");
const startBtn = document.getElementById("start-btn");

const scoreCard = document.getElementById("score-card");
const roundsInfo = document.getElementById("rounds-info");
const patternInfo = document.getElementById("pattern-info");

const playerChoiceEl = document.getElementById("player-choice");
const computerChoiceEl = document.getElementById("computer-choice");
const outcomeEl = document.getElementById("round-outcome");

const choiceButtons = document.querySelectorAll("[data-move]");

const banner = document.getElementById("game-over-banner");
const bannerMessage = document.getElementById("game-over-message");
const bannerRestart = document.getElementById("game-over-restart");
const bannerClose = document.getElementById("game-over-close");

const howToToggle = document.getElementById("how-to-toggle");
const howToContent = document.getElementById("how-to-content");


// Define game rules

const rules = {
    rock: ["scissors", "lizard"],       //Rock beats scissors and lizard
    paper: ["rock", "spock"],           //Paper beats rock and spock
    scissors: ["paper", "spock"],       //Scissors beats paper and lizard
    lizard: ["paper", "spock"],         //Lizard beats paper and spock
    spock: ["scissors", "rock"],        //Spock beats scissors and rock
};

// How-to-play dropdown logic
// Toggle visibility of instructions on mobile/tablet
// Update arrow icon to reflect opened/closed state

howToToggle.addEventListener("click", () => {
    const isHidden = howToContent.hidden;   // Check current visibility

    howToContent.hidden = !isHidden;        // Toggle hidden attribute

    // Update button text to show ▲ or ▼
    howToToggle.textContent = isHidden ? "How to Play ▲" : "How to Play ▼";
});

// Random move generator
// Used for EASY difficulty and fallback logic

function getRandomMove() {
    const moves = Object.keys(rules);                 // ["rock","paper","scissors","lizard","spock"]
    return moves[Math.floor(Math.random() * moves.length)]; // Pick random index
}

// STEP 7: Predict Player move (Medium/Hard)
// Computer tries to counter the player's last move.

function predictPlayerMove() {
    if (!state.lastPlayerMove) return getRandomMove(); // random

    const counters = Object.entries(rules)
        .filter(([move, beats]) => beats.includes(state.lastPlayerMove))
        .map(([move]) => move);  // Find moves that beat the player's last move

    return counters.length ? counters[0] : getRandomMove(); // If prediction fails, fall back to random
}

// Computer move selection

function getComputerMove() {
    if (state.difficulty === "Easy") return getRandomMove();    // Always random

    if (state.difficulty === "Medium") {
        // 50% random, 50% predictive
        return Math.random() < 0.5 ? getRandomMove() : predictPlayerMove();
    }

    return predictPlayerMove();     // Hard mode always predicts
}

// Determine round winner

function determineWinner(player, computer) {

    if (player === computer) return "draw"; // Same move -> draw

    if (rules[player].includes(computer)) return "player";    // If computer's move is in the list of moves the player beats

    return "computer";      // Otherwise computer wins
}