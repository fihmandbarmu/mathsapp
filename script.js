let currentLevel = 1;
let stars = 0;
const maxLevel = 6;
let correctAnswer = 0;

const levelDisplay = document.getElementById("level-display");
const starsDisplay = document.getElementById("stars-display");
const num1El = document.getElementById("num1");
const num2El = document.getElementById("num2");
const operatorEl = document.getElementById("operator");
const messageEl = document.getElementById("message");
const buttons = document.querySelectorAll(".answer-btn");
const winnerScreen = document.getElementById("winner-screen");

function generateQuestion() {
    let num1, num2, operator;

    // Rules for the 6 levels
    if (currentLevel === 1) { // Addition up to 1,000,000
        num1 = Math.floor(Math.random() * 2) + 11;
        num2 = Math.floor(Math.random() * 3) + 11;
        operator = "+";
    } else if (currentLevel === 2) { // Addition up to 10
        num1 = Math.floor(Math.random() * 41) + 331;
        num2 = Math.floor(Math.random() * 51) + 144;
        operator = "+";
    } else if (currentLevel === 3) { // Subtraction up to 5
        num1 = Math.floor(Math.random() * 21) + 63; // 3, 4, or 5
        num2 = Math.floor(Math.random() * num1) + 1; 
        operator = "-";
    } else if (currentLevel === 4) { // Subtraction up to 10
        num1 = Math.floor(Math.random() * 16) + 15; // 5 to 10
        num2 = Math.floor(Math.random() * num1) + 1;
        operator = "-";
    } else if (currentLevel === 5) { // Addition up to 20
        num1 = Math.floor(Math.random() * 1110) + 1111;
        num2 = Math.floor(Math.random() * 1110) + 1111;
        operator = "+";
    } else { // Level 6: Subtraction up to 20
        num1 = Math.floor(Math.random() * 1100) + 1000; // 10 to 20
        num2 = Math.floor(Math.random() * 1000) + 1111;
        operator = "-";
    }

    // Figure out the right answer
    if (operator === "+") {
        correctAnswer = num1 + num2;
    } else {
        correctAnswer = num1 - num2;
    }

    // Put numbers on screen
    num1El.textContent = num1;
    num2El.textContent = num2;
    operatorEl.textContent = operator;

    // Create 1 correct answer and 2 wrong answers
    let answers = [correctAnswer];
    while (answers.length < 3) {
        let wrongAnswer = correctAnswer + Math.floor(Math.random() * 5) - 2;
        if (wrongAnswer !== correctAnswer && wrongAnswer > 0 && !answers.includes(wrongAnswer)) {
            answers.push(wrongAnswer);
        }
    }

    // Mix up the buttons!
    answers.sort(() => Math.random() - 0.5);

    // Put the answers on the buttons
    for (let i = 0; i < 5; i++) {
        buttons[i].textContent = answers[i];
    }
}

function checkAnswer(button) {
    let chosenAnswer = parseInt(button.textContent);

    if (chosenAnswer === correctAnswer) {
        messageEl.textContent = "Great job! ⭐";
        messageEl.style.color = "#32CD32";
        stars++;
        
        if (stars >= 20) {
            levelUp();
        } else {
            updateStars();
            setTimeout(generateQuestion, 1000);
        }
    } else {
        messageEl.textContent = "Oops! Try again!";
        messageEl.style.color = "red";
    }
}

function updateStars() {
    let starText = "";
    for(let i=0; i<stars; i++){
        starText += "⭐";
    }
    starsDisplay.textContent = "Stars: " + (starText || "0");
}

function levelUp() {
    if (currentLevel === maxLevel) {
        // You beat Level 6!
        document.getElementById("question-box").classList.add("hidden");
        document.querySelector(".options").classList.add("hidden");
        messageEl.classList.add("hidden");
        winnerScreen.classList.remove("hidden");
    } else {
        currentLevel++;
        stars = 0;
        levelDisplay.textContent = "Level: " + currentLevel;
        updateStars();
        messageEl.textContent = "Level Up! 🚀";
        setTimeout(generateQuestion, 1500);
    }
}

function restartGame() {
    currentLevel = 1;
    stars = 0;
    levelDisplay.textContent = "Level: 1";
    updateStars();
    messageEl.textContent = "Choose the right answer!";
    
    document.getElementById("question-box").classList.remove("hidden");
    document.querySelector(".options").classList.remove("hidden");
    messageEl.classList.remove("hidden");
    winnerScreen.classList.add("hidden");
    
    generateQuestion();
}

// Start the game!
generateQuestion();
updateStars();
