import 'cypress-localstorage-commands';

describe('submit a poll, edit votes, delete poll', () => {
    var random_string = generate_random_string(8);
    function generate_random_string(string_length) {
        let random_string = '';
        let random_ascii;
        for (let i = 0; i < string_length; i++) {
            random_ascii = Math.floor(Math.random() * 25 + 97);
            random_string += String.fromCharCode(random_ascii);
        }
        return random_string;
    }

    before(() => {
        cy.visit(
            'https://staging.knowit-anonymous-voting-app.aws.cybercom.dev/login'
        );
        cy.get('.fields').children().first().type('testAdmin');
        cy.get('.fields').children().eq(1).type('admin@1234');
        cy.get('.login-btn').click();
        const pollName = random_string;
        cy.get('.creation-poll-name').type(`${pollName}`);
        cy.contains('Add a question').click();
        cy.get('.type-dropdown').click();
        cy.contains('Star rating').click();
        const question = 'Is this working?';
        cy.get('.question-field').type(`${question}`);
        cy.saveLocalStorage();
    });

    it('can choose to show vote count', () => {
        cy.restoreLocalStorage();
        cy.get('.vote-count-toggle-btn').click();
        cy.get('.vote-count-toggle-btn').find('input').should('be.checked');
        cy.saveLocalStorage();
    });

    it('can submit poll', () => {
        cy.restoreLocalStorage();
        cy.get('.submit-poll-btn').click();
        cy.get('.MuiAlert-filledSuccess').should('exist');
        //eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(3500);
        cy.contains('Copy Result link').click();
        cy.get('.MuiAlert-filledSuccess').should('exist');
        //eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(3500);
        cy.contains('Copy Answering link').click();
        cy.get('.MuiAlert-filledSuccess').should('exist');
        cy.saveLocalStorage();
    });

    it('can edit poll', () => {
        cy.restoreLocalStorage();
        cy.contains('My polls').click();
        cy.contains('Search by').click();
        cy.contains('Poll name').click();
        cy.get('.searchField').type(random_string);
        cy.get('.searchButton').click();
        cy.contains('Edit').should('exist');
        cy.contains('Edit').click();
        cy.get('.page-header').type('change');
        cy.get('.vote-count-switch').click();
        cy.contains('Update').click();
        cy.get('.MuiAlert-filledSuccess').should('exist');
    });
});
