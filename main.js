function sortGame() {
    const imageArray = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
    fillBackOfCards();
    sortFrontOfCardsRandomly(shuffleArray(imageArray));
};

function startGame() {
    changeSubtitle();
    startTimer();
    memoryGame.removeEventListener('click',startGame);
};

const memoryGame = document.getElementById('memorygame');
memoryGame.addEventListener('click',startGame);



