describe('add a question of each type', () => {
    before(() => {
        cy.visit(
            'https://staging.knowit-anonymous-voting-app.aws.cybercom.dev/'
        );
        cy.get('.creation-poll-name').should('not.have.text');
        const pollName = 'Test poll';
        cy.get('.creation-poll-name').type(`${pollName}`);
    });

    beforeEach(() => {
        cy.contains('Add a question').click();
        cy.get('.type-dropdown').last().click();
    });

    afterEach(() => {
        const question = 'Is this working?';
        cy.get('.question-field').last().type(`${question}`);
    });

    it('can add pick one question', () => {
        cy.contains('Pick one').click();
        const option = 'Yes';
        cy.get('.option-field').last().type(`${option}`);
        cy.get('.add-option-btn').last().click();
        cy.get('.option-field').last().type(`${option}`);
        cy.contains('Pick one').should('exist');
        cy.get('.question-field').should('have.length', 1);
    });

    it('can add multi-choice question', () => {
        cy.contains('Multi - choice').click();
        const option = 'Yes';
        cy.get('.option-field').last().type(`${option}`);
        cy.get('.add-option-btn').last().click();
        cy.get('.option-field').last().type(`${option}`);
        cy.contains('Multi - choice').should('exist');
        cy.get('.question-field').should('have.length', 2);
    });

    it('can add star rating question', () => {
        cy.contains('Star rating').click();
        cy.contains('Star rating').should('exist');
        cy.get('.question-field').should('have.length', 3);
    });

    it('can add free test question', () => {
        cy.contains('Free text').click();
        cy.contains('Free text').should('exist');
        cy.get('.question-field').should('have.length', 4);
    });

    it('can add yes/no question', () => {
        cy.contains('Yes/No').click();
        cy.contains('Yes/No').should('exist');
        cy.get('.question-field').should('have.length', 5);
    });

    it('can add thumbs up/down question', () => {
        cy.contains('Thumbs Up/Down').click();
        cy.contains('Thumbs Up/Down').should('exist');
        cy.get('.question-field').should('have.length', 6);
    });
});
