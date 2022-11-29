describe('submit a poll with the option to show vote count', () => {
    before(() => {
        cy.visit(
            'https://staging.knowit-anonymous-voting-app.aws.cybercom.dev/'
        );
        const pollName = 'Test poll';
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
});
