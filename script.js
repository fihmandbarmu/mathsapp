let currentLevel = 1;
let stars = 0;
const starsRequired = 100;
const maxLevel = 85373;
let correctAnswer = 0;

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
    } else if (currentLevel <= 20000) {
        mathType = "x";
    } else if (currentLevel <= 40853) {
        mathType = "÷";
    } else {
        mathType = getRandomMathType();
    }

    // REALLY HARD MATH LOGIC
    if (mathType === "+") {
        // 3-digit and 4-digit addition!
        num1 = Math.floor(Math.random() * 9000) + 100;
        num2 = Math.floor(Math.random() * 9000) + 100;
        operator = "+";
        correctAnswer = num1 + num2;
    } 
    else if (mathType === "-") {
        // 4-digit subtraction!
        num1 = Math.floor(Math.random() * 9000) + 1000;
        num2 = Math.floor(Math.random() * (num1 - 100)) + 100; // Always positive answer
        operator = "-";
        correctAnswer = num1 - num2;
    }
    else if (mathType === "x") {
        // Double-digit multiplication! (e.g., 45 x 23)
        num1 = Math.floor(Math.random() * 90) + 10;
        num2 = Math.floor(Math.random() * 90) + 10;
        operator = "x";
        correctAnswer = num1 * num2;
    }
    else if (mathType === "÷") {
        // Hard division! (e.g., 2415 ÷ 35)
        let answer = Math.floor(Math.random() * 90) + 10;
        num2 = Math.floor(Math.random() * 90) + 10;
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
    }
}

function checkAnswer(button) {
    // Remove the commas to check the real number
    let chosenAnswer = parseInt(button.textContent.replace(/,/g, ''));

    if (chosenAnswer === correctAnswer) {
        messageEl.textContent = "Genius! ⭐";
        messageEl.style.color = "#32CD32";
        stars++;
        
        if (stars >= starsRequired) {
            levelUp();
        } else {
            updateStats();
            setTimeout(generateQuestion, 800); 
        }
    } else {
        messageEl.textContent = "Oops! Look closely!";
        messageEl.style.color = "red";
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
