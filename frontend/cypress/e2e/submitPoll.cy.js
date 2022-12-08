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
    });

    it('can choose to show vote count', () => {
        cy.get('.vote-count-toggle-btn').click();
        cy.get('.vote-count-toggle-btn').find('input').should('be.checked');
    });

    it('can submit poll', () => {
        cy.get('.submit-poll-btn').click();
        cy.get('.MuiAlert-filledSuccess').should('exist');
    });

    it('can edit poll', () => {
        cy.contains('My polls').click();
        cy.contains('Search by').click();
        cy.contains('Poll name').click();
        cy.get('.searchField').type(random_string);
        cy.get('.searchButton').click();
        cy.contains('Edit').click();
    });
});
