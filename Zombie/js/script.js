// DOM selectors
const MAINCONTAINER = document.querySelector("#mainContainer");
const STARTGAME = document.querySelector("#start");
const SCORE = document.querySelector("#score");
const GOAL = document.querySelector("#objective");
const QUITGAME = document.querySelector("#quitGame");
const SPAWNTHRESHOLD = document.querySelector("#spawnArea");
const TIMERTEXT = document.querySelector("#timerText");

// Spawn rate timers
let spawnRate = 700;
let horizontalRate = 18;
let secondRate = 1000;
let bloodTimeOut = 10_000;

// UI or Menu counters for user display
let scoreCounter = 0;
let gameTimer = 60;

// DOM audio selectors
const menuMusic = document.getElementById("main-theme-audio");
const bgMusic = document.getElementById("in-game-bg-audio");
const zergDeathSound = document.getElementById("zerg-death-audio");
const terranVictory = document.getElementById("terran-win-audio");
const zergVictory = document.getElementById("zerg-victory-audio");

// Setting volume for sfx
menuMusic.volume = 0.05;
bgMusic.volume = 0.05;
terranVictory.volume = 0.1;
zergVictory.volume = 0.1;

function countdown() {
    TIMERTEXT.textContent = gameTimer;
    window.gameTime = setInterval(function() {
        gameTimer -= 1;
        TIMERTEXT.textContent = gameTimer;
        // ADD optional code to increment spawn rate here?? maybe??
        if (gameTimer === 0) {
            // bgMusic.pause();
            // terranVictory.play();
            MAINCONTAINER.innerHTML = `
            <div class="victory">
              <h1 class='game-win'>VICTORY</h1>
              <h2>You have stopped the zerglings from getting through! You have fought off the Zerg invasion</h2>
              <p class="button retry-button" onclick="window.location.reload()">Retry</p>
            </div>`;
            clearInterval(window.spawnGame);
            clearInterval(window.gameTime);
        }
    }, secondRate)
}

function randomYAxis() {
    return Math.floor(Math.random() * 90)
}

function zergling(counter) {
    window.spawnGame = setInterval(function() {
        // creating zergling element and declaring its class
        let zergling = document.createElement("img");
        zergling.src = 'images/zergling.gif';
        zergling.className = "zergling";
        zergling.classList.add("zergling" + counter);

        // applying zergling random y-axis and appending to spawn area div
        let yAxis = randomYAxis();
        SPAWNTHRESHOLD.appendChild(zergling);
        zergling.style.position = "absolute";
        zergling.style.top = yAxis + "%";

        // move zerglings incrementally to the right
        let left = 0;
        let horizontalMovement = setInterval(function() {
            zergling.style.left = left + "%";
            left += 0.2;

            // NOTE: Maybe for game-overs make a div and populate but make it invisible
            //       Then when game-over conditions are met clear container div and show game over div instead.
            // when zerglings pass certain threshold game is over and user has loss
            if (parseFloat(zergling.style.left) > 95 && gameTimer > 0) {
                // bgMusic.pause();
                // zergVictory.play();
                MAINCONTAINER.innerHTML = `
                <div class="defeat">
                  <h1 class='game-over'>DEFEAT</h1>
                  <h2>You allowed the Zerg swarm to surround and kill you</h2>
                  <p class="button retry-button" onclick="window.location.reload()">Retry</p>
                </div>`;
                clearInterval(window.spawnGame);
                clearInterval(window.gameTime);
                clearInterval(horizontalMovement);
            }
        }, horizontalRate);

        zergling.addEventListener('click', death(zergling, horizontalMovement));
        counter += 1;
    }, spawnRate)
}

function death(zergling, intervalTimer) {
    return function() {
        // calls function to stop element moving
        clearInterval(intervalTimer);

        // increments score counter and updates html
        scoreCounter += 1;
        SCORE.textContent = "Score: " + scoreCounter;

        // plays sound to indicate death cloning audio source to allow overlap
        let cloneDeathSound = zergDeathSound.cloneNode();
        cloneDeathSound.volume = 0.1;
        cloneDeathSound.play();

        // replaces image with death.gif and deactivates pointer
        zergling.src = "images/death.gif";
        zergling.className = "death";
        zergling.style.pointerEvents = 'none';

        // 800ms to change  death gif to static blood photo
        setTimeout(function () {
            zergling.src = "images/blood.gif";
        }, 800);

        //20sec after death element is deleted
        let clearBody = setTimeout(function () {
            SPAWNTHRESHOLD.removeChild(zergling)
        }, bloodTimeOut);
    }
}

function initializeGame() {
    MAINCONTAINER.removeChild(STARTGAME);
    // bgMusic.play();
    // menuMusic.pause();

    // initializes score and game timer
    countdown();
    SCORE.textContent = "Score: 0";
    GOAL.textContent = "Don't let the zerg escape to the other side until the timer runs out!";
    QUITGAME.textContent = "QUIT GAME";

    // starts zergling spawn
    let spawnCount = 0;
    zergling(spawnCount);
}

function main() {
    // menuMusic.play();
    STARTGAME.onclick = initializeGame;
}

main();