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