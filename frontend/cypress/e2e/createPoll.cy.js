describe('add poll name, question, option and then delete question and option', () => {
    it('can open page', () => {
        cy.visit(
            'https://staging.knowit-anonymous-voting-app.aws.cybercom.dev/api/'
        );
        cy.contains('Create poll').click();
        cy.url(
            'should.include',
            'https://staging.knowit-anonymous-voting-app.aws.cybercom.dev/'
        );
    });

    it('can add pollname', () => {
        cy.get('.creation-poll-name').should('not.have.text');
        const pollName = 'Test poll';
        cy.get('.creation-poll-name').type(`${pollName}`);
        cy.get('.creation-poll-name')
            .find('input')
            .invoke('val')
            .should('equal', `${pollName}`);
    });

    it('can add a question', () => {
        cy.contains('Add a question').click();
        cy.get('.question-field').should('have.length', 1);
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
        cy.get('.question-wrapper')
            .find('textarea')
            .invoke('val')
            .should('equal', `${question}`);
        cy.get('.question-wrapper')
            .find('input')
            .last()
            .invoke('val')
            .should('equal', `${option}`);
        cy.get('.option-field').should('have.length', 1);
    });

    it('can delete option', () => {
        cy.get('.adornment-span').last().click();
        cy.get('.option-field').should('not.exist');
    });

    it('can delete question', () => {
        cy.get('.adornment-span').first().click();
        cy.get('.question-field').should('not.exist');
    });
});
