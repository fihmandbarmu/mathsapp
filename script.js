let currentLevel = 1;
let stars = 0;
const starsRequired = 100;
const maxLevel = 150;
let correctAnswer = 0;
let lastOutcome = null; // 'correct' or 'incorrect'

const levelDisplay = document.getElementById("level-display");
const starsDisplay = document.getElementById("stars-display");
const num1El = document.getElementById("num1");
const num2El = document.getElementById("num2");
const operatorEl = document.getElementById("operator");
const messageEl = document.getElementById("message");
const buttons = document.querySelectorAll(".answer-btn");
const winnerScreen = document.getElementById("winner-screen");

function getRandomMathType() {
    const types = ["+", "-", "x", "÷"];
    return types[Math.floor(Math.random() * types.length)];
}

function generateQuestion() {
    let num1, num2, operator;
    let mathType = "+";

    // Randomize addition and subtraction for the first 9000 levels
    if (currentLevel <= 9000) {
        mathType = Math.random() > 0.5 ? "+" : "-"; 
    } else if (currentLevel <= 50) {
        mathType = "x";
    } else if (currentLevel <= 40853) {
        mathType = "÷";
    } else {
        mathType = getRandomMathType();
    }

    // Difficulty adjustment: if the last answer was incorrect, make the next question easier;
    // if the last answer was correct, make it slightly harder.
    const easierFactor = lastOutcome === 'incorrect' ? 0.12 : 1; // reduce ranges when incorrect
    const harderFactor = lastOutcome === 'correct' ? 1.4 : 1; // increase ranges slightly when correct

    // REALLY HARD MATH LOGIC (with dynamic ranges)
    if (mathType === "+") {
        // 3-digit and 4-digit addition!
        const baseRange1 = Math.floor(9000 * easierFactor * harderFactor) + 100;
        const baseRange2 = Math.floor(9000 * easierFactor * harderFactor) + 100;
        num1 = Math.floor(Math.random() * Math.max(1, baseRange1)) + 100;
        num2 = Math.floor(Math.random() * Math.max(1, baseRange2)) + 100;
        operator = "+";
        correctAnswer = num1 + num2;
    } 
    else if (mathType === "-") {
        // 4-digit subtraction!
        const baseNum1Range = Math.floor(9000 * easierFactor * harderFactor) + 1000;
        num1 = Math.floor(Math.random() * Math.max(1, baseNum1Range)) + 1000;
        num2 = Math.floor(Math.random() * Math.max(1, num1 - 100)) + 100; // Always positive answer
        operator = "-";
        correctAnswer = num1 - num2;
    }
    else if (mathType === "x") {
        // Double-digit multiplication! (e.g., 45 x 23)
        const mulRange = Math.floor(90 * Math.max(0.3, easierFactor * harderFactor));
        num1 = Math.floor(Math.random() * Math.max(1, mulRange)) + 10;
        num2 = Math.floor(Math.random() * Math.max(1, mulRange)) + 10;
        operator = "x";
        correctAnswer = num1 * num2;
    }
    else if (mathType === "÷") {
        // Hard division! (e.g., 2415 ÷ 35)
        let answer = Math.floor(Math.random() * 90 * Math.max(0.3, easierFactor * harderFactor)) + 10;
        num2 = Math.floor(Math.random() * 90 * Math.max(0.3, easierFactor * harderFactor)) + 10;
        num1 = num2 * answer; 
        operator = "÷";
        correctAnswer = answer;
    }

    // Put numbers on screen
    num1El.textContent = num1.toLocaleString();
    num2El.textContent = num2.toLocaleString();
    operatorEl.textContent = operator;

    // Create TRICKY wrong answers!
    let answers = [correctAnswer];
    let tricks = [1, 10, 100, -1, -10, -100]; // Off by exactly 1, 10, or 100 to trick you!
    
    // Shuffle the trick numbers so it's different every time
    tricks.sort(() => Math.random() - 0.5);

    let trickIndex = 0;
    while (answers.length < 3) {
        let wrongAnswer = correctAnswer + tricks[trickIndex];
        trickIndex++;
        
        if (wrongAnswer >= 0 && !answers.includes(wrongAnswer)) {
            answers.push(wrongAnswer);
        }
    }

    // Mix up the buttons so the correct answer isn't always in the same spot
    answers.sort(() => Math.random() - 0.5);

    // Put the answers on the buttons
    for (let i = 0; i < 3; i++) {
        buttons[i].textContent = answers[i].toLocaleString();
        buttons[i].disabled = false; // ensure buttons are enabled for the new question
        buttons[i].classList.remove('correct', 'incorrect', 'shake');
    }

    // Clear message for the new question
    messageEl.textContent = "Choose the right answer!";
    messageEl.style.color = "#000";
}

function checkAnswer(button) {
    // Remove the commas to check the real number
    let chosenAnswer = parseInt(button.textContent.replace(/,/g, ''));

    if (chosenAnswer === correctAnswer) {
        // Correct answer flow
        messageEl.textContent = "Awesome! ✅";
        messageEl.style.color = "#32CD32";
        lastOutcome = 'correct';

        // Always give at least one star; small chance for a bonus
        let bonus = 0;
        if (Math.random() < 0.12) { // 12% chance of bonus
            bonus = Math.floor(Math.random() * 4) + 2; // 2-5 bonus stars
            // small celebratory highlight
            document.body.classList.add('flash-success');
            setTimeout(() => document.body.classList.remove('flash-success'), 400);
        }

        stars += 1 + bonus;

        // Visual feedback: mark the clicked button as correct
        button.classList.add('correct');

        if (stars >= starsRequired) {
            levelUp();
        } else {
            updateStats();
            setTimeout(() => {
                generateQuestion();
            }, 800);
        }
    } else {
        // Incorrect answer flow
        messageEl.textContent = "Oops! Look closely! ✖️";
        messageEl.style.color = "red";
        lastOutcome = 'incorrect';

        // Penalize a little but never below zero
        stars = Math.max(0, stars - 1);

        // Give the user a hint by briefly highlighting the correct button
        let correctBtn = null;
        buttons.forEach(b => {
            if (parseInt(b.textContent.replace(/,/g, '')) === correctAnswer) {
                correctBtn = b;
            }
        });

        // Mark clicked button as incorrect
        button.classList.add('incorrect');

        // Shake effect for the wrong button (CSS required)
        button.classList.add('shake');
        setTimeout(() => button.classList.remove('shake'), 600);

        if (correctBtn) {
            correctBtn.classList.add('correct');
            setTimeout(() => correctBtn.classList.remove('correct'), 1200);
        }

        updateStats();

        // After a short pause, give an easier question
        setTimeout(() => {
            generateQuestion();
        }, 1200);
    }
}

function updateStats() {
    starsDisplay.textContent = "Stars: " + stars + " / " + starsRequired + " 🌟";
    levelDisplay.textContent = "Level: " + currentLevel.toLocaleString();
}

function levelUp() {
    if (currentLevel === maxLevel) {
        document.getElementById("question-box").classList.add("hidden");
        document.querySelector(".options").classList.add("hidden");
        messageEl.classList.add("hidden");
        winnerScreen.classList.remove("hidden");
    } else {
        currentLevel++;
        stars = 0;
        updateStats();
        messageEl.textContent = "LEVEL UP! 🚀";
        setTimeout(generateQuestion, 1500);
    }
}

function restartGame() {
    currentLevel = 1;
    stars = 0;
    lastOutcome = null;
    updateStats();
    messageEl.textContent = "Choose the right answer!";
    
    document.getElementById("question-box").classList.remove("hidden");
    document.querySelector(".options").classList.remove("hidden");
    messageEl.classList.remove("hidden");
    winnerScreen.classList.add("hidden");
    
    generateQuestion();
}

// Start the game!
generateQuestion();
updateStats();
