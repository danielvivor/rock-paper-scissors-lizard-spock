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

// UI update helpers

function updateScoreboard() {
    scoreCard.textContent = `Your score: ${state.playerScore} | Computer score: ${state.computerScore}`;
}

function updateRoundsInfo() {
    roundsInfo.textContent = `Rounds remaining: ${state.roundsRemaining}`;
}

function updatePatternInfo() {
    patternInfo.textContent = `Pattern mode: ${state.patternMode ? "on" : "off"}`;
}

function resetRoundDisplay() {
    playerChoiceEl.textContent = "—";      // Reset player choice display
    computerChoiceEl.textContent = "—";    // Reset computer choice display
    outcomeEl.textContent = "—";           // Reset outcome display
}

// Confetti animation

function launchConfetti() {
    const canvas = document.getElementById("confetti-canvas");
    const ctx = canvas.getContext("2d");

    // Match canvas to full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    confettiActive = true; // Mark animation as active

    const confetti = [];   // Array to store confetti particles
    const colors = ["#4A90E2", "#50E3C2", "#F5A623", "#D0021B", "#9013FE"]; // Color palette

    // Create 150 confetti particles
    for (let i = 0; i < 150; i++) {
        confetti.push({
            x: Math.random() * canvas.width,                 // Random horizontal position
            y: Math.random() * canvas.height - canvas.height,   // Start above screen
            r: Math.random() * 6 + 4,                        // Size of particle
            d: Math.random() * 0.5 + 0.5,                    // Fall speed
            color: colors[Math.floor(Math.random() * colors.length)], // Random color
            tilt: Math.random() * 10 - 10                    // Tilt angle
        });
    }

    // Update particle positions
    function update() {
        confetti.forEach((p) => {
            p.y += p.d * 4;                  // Move downward
            p.x += Math.sin(p.y * 0.02);     // Slight horizontal sway
            p.tilt += 0.1;                   // Rotate particle

            // Reset particle when it falls off screen
            if (p.y > canvas.height) {
                p.y = -10;                   // Move back above screen
                p.x = Math.random() * canvas.width;
            }
        });
    }

    // Draw particles each frame
    function draw() {
        if (!confettiActive) return;         // Stop animation if flag is false

        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

        confetti.forEach((p) => {
            ctx.fillStyle = p.color;         // Set particle color
            ctx.fillRect(p.x, p.y, p.r, p.r * 2);   // Draw rectangle particle
        });

        update();                            // Update positions
        confettiAnimationId = requestAnimationFrame(draw); // Loop animation
    }

    draw(); // Start animation loop
}

// Stop confetti
// Stop animation loop
// Clear canvas

function stopConfetti() {
    confettiActive = false; // Stop animation loop

    const canvas = document.getElementById("confetti-canvas");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear screen

    if (confettiAnimationId) {
        cancelAnimationFrame(confettiAnimationId);    // Cancel animation frame
        confettiAnimationId = null;                   // Reset ID
    }
}

// Show game over banner
// Display final result
// Trigger confetti if player wins

function showGameOverBanner() {
    banner.classList.remove("win", "loss", "draw"); // Reset banner style

    let finalMessage = ""; // Will hold final text

    if (state.playerScore > state.computerScore) {
        finalMessage = "Game Over — You Won!";
        banner.classList.add("win"); // Green border
        launchConfetti();            // Celebrate!
    } 
    else if (state.playerScore < state.computerScore) {
        finalMessage = "Game Over — You Lost!";
        banner.classList.add("loss"); // Red border
    } 
    else {
        finalMessage = "Game Over — It's a Draw!";
        banner.classList.add("draw"); // Blue border
    }

    bannerMessage.textContent = finalMessage; // Update banner text
    banner.hidden = false;                    // Show banner
}


// Start game
// Reset all game values
// Prepare UI for a new game

function startGame() {
    state.playerScore = 0;                          // Reset player score
    state.computerScore = 0;                        // Reset computer score
    state.roundsRemaining = Number(roundsSelect.value);     // Read selected rounds
    state.difficulty = difficultySelect.value;      // Read selected difficulty
    state.patternMode = state.difficulty !== "Easy"; // Enable prediction except in Easy
    state.lastPlayerMove = null;                    // Reset prediction memory

    updateScoreboard();                             // Update UI
    updateRoundsInfo();
    updatePatternInfo();
    resetRoundDisplay();

    banner.hidden = true;                           // Hide game-over banner
    stopConfetti();                                 // Stop any leftover confetti

    startBtn.textContent = "Reset Game";            // Change button label
}