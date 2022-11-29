describe('cancel poll', () => {
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

    it('can cancel', () => {
        cy.contains('Cancel').click();
        cy.get('.question-field').should('not.exist');
        cy.get('.creation-poll-name')
            .find('input')
            .invoke('val')
            .should('equal', '');
    });
});
