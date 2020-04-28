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

