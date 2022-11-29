describe('toggle hamburger menu', () => {
    before(() => {
        cy.visit(
            'https://staging.knowit-anonymous-voting-app.aws.cybercom.dev/'
        );
    });
    it('can open and close menu', () => {
        cy.contains('My polls').should('exist');
        cy.get('.hamburgerMenu').click();
        cy.contains('My polls').should('not.exist');
        cy.get('.hamburgerMenu').click();
        cy.contains('My polls').should('exist');
    });
    it('can navigate via menu', () => {
        cy.contains('My polls').click();
        cy.contains('Search').should('exist');
        cy.contains('Create poll').click();
        cy.get('.creation-poll-name').should('exist');
    });
});
