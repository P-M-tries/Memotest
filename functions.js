function fillBackOfCards() {
    const cardContainers = document.querySelectorAll('.memory-card');

    function fillEach (container) {
        const backImageHtml = document.createElement('img');
        backImageHtml.setAttribute('src','imgs/back.png');
        backImageHtml.setAttribute('alt','back');
        backImageHtml.setAttribute('class','back-face');
        
        container.appendChild(backImageHtml);
    };
    cardContainers.forEach(container => fillEach(container));
};

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;

};

function sortFrontOfCardsRandomly(shuffledArray) {
    const cardContainers = document.querySelectorAll('.memory-card');
    let i = 0;

    function fillEach(container) {
        const frontImageHtml = document.createElement('img');
        frontImageHtml.setAttribute('src', `imgs/${shuffledArray[i]}.png`);
        frontImageHtml.setAttribute('alt','front');
        frontImageHtml.setAttribute('class','front-face');
        frontImageHtml.setAttribute('class','not-display');

        container.appendChild(frontImageHtml)

        i += 1;

    }

    cardContainers.forEach(container => fillEach(container));
};


function changeSubtitle() {
    const subtitle = document.querySelector('#subtitle');
    subtitle.innerHTML = 'Hurry! Time is ticking!';
};

function stopwatch (element) {
    let time = 0;
    let interval;
    let offset;

    function update() {
        time += delta();
        let formattedTime = timeFormatter(time);
        element.textContent = formattedTime;
    };

    function delta() {
        let now = Date.now();
        let timePassed = now - offset;
        offset = now;
        return timePassed;
    };

    function timeFormatter(timeInMilliseconds){
        let time = new Date(timeInMilliseconds);
        let minutes = time.getMinutes().toString();
        let seconds = time.getSeconds().toString();
        let milliseconds = time.getMilliseconds().toString();

        if (minutes.length < 2){
            minutes = '0' + minutes;
        };

        if (seconds.length < 2) {
            seconds = '0' + seconds;
        };

        while (milliseconds.length < 3) {
            milliseconds = '0' + milliseconds;
        }

        return minutes + ' : ' + seconds + ' . ' + milliseconds;

    };


    this.isOn = false;
    this.start = function () {
        if(!this.isOn) {
            interval = setInterval(update,10);
            offset = Date.now();
            this.isOn = true;
        }
    }

    this.stop = function() {
        if(this.isOn) {
            clearInterval(interval);
            interval = null;
            this.isOn = false;
        }
    }

};

var watch = new stopwatch(timerbox);
function startTimer() {
    const timerbox = document.querySelector('#timerbox')
    watch.start();
}

const cards = document.querySelectorAll('.memory-card');
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let turns = 0;
let matchedCards = [];

function manageCardUponClick() {
    if (lockBoard) return;
    if (this === firstCard) return;

    let backImage = this.getElementsByTagName('img')[0];
    backImage.classList.add('flip');
    let frontImage = this.getElementsByTagName('img')[1];

    function hideBackFace () {
        backImage.classList.toggle('not-display');
    };

    function showFrontFace () {
        frontImage.classList.toggle('not-display');
    };
    setTimeout(hideBackFace,250)
    setTimeout(showFrontFace,250)

    if (!hasFlippedCard){
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    hasFlippedCard = false;
    secondCard = this;

    checkForMatch(firstCard, secondCard);
    checkForWin();

    
};

function checkForMatch(firstCard, secondCard) {
    let srcFirstCard = firstCard.getElementsByTagName('img')[1].getAttribute('src');
    let srcSecondCard = secondCard.getElementsByTagName('img')[1].getAttribute('src');

    let isMatch = srcFirstCard === srcSecondCard;

    isMatch ? disableCards() : unflipCards();

    const turnbox = document.getElementById('trybox');

    updateTurnCounter(turnbox);
};

function updateTurnCounter(turnbox) {
    turns += 1;
    turnbox.innerHTML = `Turns: ${turns}`
};

function disableCards() {
    firstCard.removeEventListener('click', manageCardUponClick);
    secondCard.removeEventListener('click', manageCardUponClick);

    matchedCards.push(firstCard);
    matchedCards.push(secondCard);

    resetBoard();
};

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.getElementsByTagName('img')[0].classList.toggle('not-display');
        firstCard.getElementsByTagName('img')[0].classList.remove('flip');
        firstCard.getElementsByTagName('img')[1].classList.toggle('not-display');
        secondCard.getElementsByTagName('img')[0].classList.toggle('not-display');
        secondCard.getElementsByTagName('img')[0].classList.remove('flip');
        secondCard.getElementsByTagName('img')[1].classList.toggle('not-display');

        resetBoard();
        },1200);

}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false]
    [firstCard, secondCard] = [null, null];
}

function checkForWin() {
    
    let matchedLenght = matchedCards.length;
    if (matchedLenght >= 16) {
        stopTimer();
        setTimeout(cleanBoardAndAlert, 2000)
        
        
    }else {
        return;
    }
};

function stopTimer() {
    const timerbox = document.querySelector('#timerbox')
    watch.stop();
}

function cleanBoardAndAlert() {
    let table = document.querySelector('#memorygame')
    table.innerHTML = '';
    winAlert();
    
};

function winAlert(space) {
    const $winAlert = document.querySelector('#win-alert');
    const $resetButton = document.querySelector('#reset-button');
    const $subtitle = document.querySelector('#subtitle');
    const $title = document.querySelector('#title');

    $winAlert.classList.remove('not-display');
    $resetButton.classList.remove('not-display');
    $subtitle.remove();
    $title.remove();

};


cards.forEach(card => card.addEventListener('click',manageCardUponClick))

