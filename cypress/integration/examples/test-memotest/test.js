const URL = 'http://192.168.0.31:8080';
// cy.get('form').should('have.class', 'form-horizontal')
context('memotest', () => {
    before(() => {
        cy.visit(URL);
    });

    describe ('Verifies the game is ready to start', () => {
        // board, n de cuadros, timer, turnbox, back placed, front placed randomly
        const cardQuantity = 16;
        it('Verifies there is a board with 16 spaces', () => {
            cy.get('#memorygame').find('.memory-card').should('have.length', cardQuantity);
        });

        it('Verifies there is a timerbox', () => {
            cy.get('#timerbox').should('be.visible').and('have.html', '00 : 00 . 000');
        });

        it('Verifies there is a turnbox', () => {
            cy.get('#trybox').should('be.visible').and('have.html', 'Turns: 0');

        })

        it('Verifies the back of the cards are placed in the board', () => {
            const backOfCards = cy.get('#memorygame').find('.memory-card').find('.back-face');
            backOfCards.should('exist').and('have.length', cardQuantity).and('have.attr','src','imgs/back.png');
        })

        it('Verifies the front of the cards are placed randomly', () => {
            cy.get('.front-face').then(frontFaces => {
                let originalFrontFaces = [];
                frontFaces.each(function(i, front) {
                    let frontSource = front.getAttribute('src');
                    originalFrontFaces.push(frontSource);
                });

                cy.visit(URL);

                let newFrontFaces = [];
                cy.get('.front-face').then(newFronts => {
                    newFronts.each(function(i, front) {
                        let frontSource = front.getAttribute('src');
                        newFrontFaces.push(frontSource);
                    });
                    cy.wrap(originalFrontFaces).should('not.deep.equal', newFrontFaces);
                });
            });
        });

        it('Verifies the victory message and reset button are not showing', () => {
            const winAlert = cy.get('#win-alert');
            const resetButton = cy.get('#reset-button');
            winAlert.should('exist').and('be.hidden');
            resetButton.should('exist').and('be.hidden');
        });
    
    });

    describe('Verifies the game functions properly', () => {

        

        it('Verifies the timer starts when the board is clicked', () => {
            const firstCard = cy.get(`[src="imgs/1.png"]`).first().siblings('.back-face');
            firstCard.click()
            cy.get('#timerbox').should('not.have.html', '00 : 00 . 000');

        });

        it ('Verifies the cards flip when clicked', () => {
            const backOfFirstCard = cy.get(`[src="imgs/1.png"]`).first().siblings('.back-face');
            backOfFirstCard.should('have.class', 'flip');
            backOfFirstCard.should('have.class', 'not-display');

            const frontOfFirstCard = cy.get(`[src="imgs/1.png"]`).first();
            frontOfFirstCard.should('not.have.class','not-display');
        });

        it('Verifies matching cards are detected as such', () => {
            const frontOfFirstCard = cy.get(`[src="imgs/1.png"]`).first().then(($firstCard) => {
                frontOfFirstCard.invoke("attr","src").then(($src) => {
                    const srcValue = $src;
                    const matchingSecondCard = cy.get(`[src="${srcValue}"]`).not($firstCard).siblings('.back-face');
                    matchingSecondCard.click();

                    cy.wait(500)

                    const matchingCards = cy.get(`[src="${srcValue}"]`);
                    
                    matchingCards.should('have.class','matched');
                });
            });     

        });

        it('Verifies non-matching cards are detected as such', () => {
            const firstCard = cy.get(`[src="imgs/5.png"]`).first().siblings('.back-face');
            firstCard.click();
            firstCard.should('have.class','flip');

            const secondCard = cy.get(`[src="imgs/8.png"]`).first().siblings('.back-face');
            secondCard.click();
            secondCard.should('have.class','flip');

            cy.wait(500);

            cy.get(`[src="imgs/5.png"]`).first().siblings('.back-face').should('not.have.class','flip');

            cy.get(`[src="imgs/8.png"]`).first().siblings('.back-face').should('not.have.class','flip');

        });

        it ('Verifies turns are being counted', () => {
            cy.get('#trybox').should('have.html', 'Turns: 2');

        });

        it ('Verifies the game can be won', () => {
            for (let i = 2; i <= 8; i++){
                cy.get(`[src="imgs/${i}.png"]`).first().siblings('.back-face').click();
                cy.get(`[src="imgs/${i}.png"]`).last().siblings('.back-face').click();
            };
        });
    });

    describe ('Verifies the player is awarded for their victory', () => {
        it('Verifies the board disappears', () => {
            cy.wait(700);
            cy.get('#memorygame').should('not.exist');
        });

        it('Verifies the timer stops', () => {
            cy.get('#timerbox').invoke('text').then((time) => {
                const timeNow = time;

                cy.wait(700);

                cy.get('#timerbox').should('have.html', timeNow);                
            });
            
        });

        it('Verifies the victory message and reset button is shown', () => {
            const winAlert = cy.get('#win-alert');
            const resetButton = cy.get('#reset-button');
            winAlert.should('exist').and('be.visible');
            resetButton.should('exist').and('be.visible');

        });

        it('Verifies the reset button functions properly', () => {
            cy.get('#reset-button').click();
            
            cy.wait(700);

            cy.get('#memorygame').should('exist');

        });


    });
    /*
    describe('Verifies the timer starts when the board is clicked')
    describe('Verifies cards flip when clicked')
    describe('Verifies the card-matching function works properly')
    describe('Verifies turns are being counted')
    describe('Verifies the board disappears and a victory message is displayed when the player wins')
*/

})