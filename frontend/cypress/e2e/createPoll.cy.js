describe('example to-do app', () => {
    beforeEach(() => {
        //cy.visit('https://staging.knowit-anonymous-voting-app.aws.cybercom.dev/');
    });

    it('can open page', () => {
        cy.visit(
            'https://staging.knowit-anonymous-voting-app.aws.cybercom.dev/'
        );
    });

    it('can add pollname', () => {
        cy.get('.creation-poll-name').should('not.have.text');
        const pollName = 'Test poll';
        cy.get('.creation-poll-name').type(`${pollName}`);
    });

    it('can add a question', () => {
        cy.contains('Add a question').click();
    });

    it('can choose question type', () => {
        cy.get('.type-dropdown').click();
        cy.contains('Pick one').click();
    });

    it('can fill out question fields', () => {
        const question = 'Is this working?';
        const option = 'Yes';
        cy.get('.question-field').type(`${question}`);
        cy.get('.option-field').type(`${option}`);
    });

    it('can delete option', () => {
        cy.get('.adornment-span').last().click();
    });

    it('can delete question', () => {
        cy.get('.adornment-span').first().click();
    });
});
