before(() => {
    cy.visit('https://staging.knowit-anonymous-voting-app.aws.cybercom.dev/');
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
});

it('can add multi-choice question', () => {
    cy.contains('Multi - choice').click();
    const option = 'Yes';
    cy.get('.option-field').last().type(`${option}`);
    cy.get('.add-option-btn').last().click();
    cy.get('.option-field').last().type(`${option}`);
});
it('can add star rating question', () => {
    cy.contains('Star rating').click();
});
it('can add free test question', () => {
    cy.contains('Free text').click();
});
it('can add yes/no question', () => {
    cy.contains('Yes/No').click();
});
it('can add thumbs up/down question', () => {
    cy.contains('Thumbs Up/Down').click();
});
