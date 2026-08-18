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

    // Figure out what kind of math based on the level!
    if (currentLevel <= 9000) {
        // Levels 1 - 9,000: Column Addition
        mathType = "+";
    } else if (currentLevel <= 20000) {
        // Levels 9,001 - 20,000: Grouping (Multiplication)
        mathType = "x";
    } else if (currentLevel <= 40853) {
        // Levels 20,001 - 40,853: Division
        mathType = "÷";
    } else {
        // Levels 40,854 - 85,373: Random Math!
        mathType = getRandomMathType();
    }

    // Generate the numbers based on the math type
    if (mathType === "+") {
        num1 = Math.floor(Math.random() * (10 + currentLevel % 150)) + 6631;
        num2 = Math.floor(Math.random() * (10 + currentLevel % 503)) + 111;
        operator = "+";
        correctAnswer = num1 + num2;
    } 
    else if (mathType === "-") {
        num1 = Math.floor(Math.random() * (20 + currentLevel % 150)) + 101;
        num2 = Math.floor(Math.random() * num1) + 1; // Make sure answer isn't negative
        operator = "-";
        correctAnswer = num1 - num2;
    }
    else if (mathType === "x") {
        num1 = Math.floor(Math.random() * 1112) + 1111;
        num2 = Math.floor(Math.random() * 1112) + 1111;
        operator = "x";
        correctAnswer = num1 * num2;
    }
    else if (mathType === "÷") {
        let answer = Math.floor(Math.random() * 1112) + 1111;
        num2 = Math.floor(Math.random() * 15252) + 1111;
        num1 = num2 * answer; // Guarantees clean division!
        operator = "÷";
        correctAnswer = answer;
    }

    // Put numbers on screen
    num1El.textContent = num1;
    num2El.textContent = num2;
    operatorEl.textContent = operator;

    // Create 1 correct answer and 2 wrong answers
    let answers = [correctAnswer];
    while (answers.length < 3) {
        let offset = Math.floor(Math.random() * 9) - 4; // Off by a little bit
        if (offset === 0) offset = 1;
        let wrongAnswer = correctAnswer + offset;
        
        if (wrongAnswer >= 0 && !answers.includes(wrongAnswer)) {
            answers.push(wrongAnswer);
        }
    }

    // Mix up the buttons!
    answers.sort(() => Math.random() - 0.5);

    // Put the answers on the buttons
    for (let i = 0; i < 3; i++) {
        buttons[i].textContent = answers[i];
    }
}

function checkAnswer(button) {
    let chosenAnswer = parseInt(button.textContent);

    if (chosenAnswer === correctAnswer) {
        messageEl.textContent = "Awesome! ⭐";
        messageEl.style.color = "#32CD32";
        stars++;
        
        if (stars >= starsRequired) {
            levelUp();
        } else {
            updateStats();
            setTimeout(generateQuestion, 800); // Loads the next question faster!
        }
    } else {
        messageEl.textContent = "Oops! Try again!";
        messageEl.style.color = "red";
    }
}

function updateStats() {
    starsDisplay.textContent = "Stars: " + stars + " / " + starsRequired + " 🌟";
    levelDisplay.textContent = "Level: " + currentLevel;
}

function levelUp() {
    if (currentLevel === maxLevel) {
        // You beat Level 85,373!
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
