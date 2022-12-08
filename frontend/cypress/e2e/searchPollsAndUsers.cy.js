describe('search users and polls as admin', () => {
    before(() => {
        cy.visit(
            'https://staging.knowit-anonymous-voting-app.aws.cybercom.dev/login'
        );
        cy.get('.fields').children().first().type('testAdmin');
        cy.get('.fields').children().eq(1).type('admin@1234');
        cy.get('.login-btn').click();
    });
    it('can search users and get results', () => {
        //eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(2000);
        cy.contains('My polls').click();
        cy.contains('Search by').click();
        cy.contains('User name').click();
        cy.get('.searchField').type('user');
        cy.get('.searchButton').click();
        cy.get('.pinkLink').should('exist');
    });
    it('can search polls and get results', () => {
        cy.contains('User name').click();
        cy.contains('Poll name').click();
        cy.get('.searchField').clear();
        cy.get('.searchField').type('poll');
        cy.get('.searchButton').click();
        //eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(2000);
        cy.get('.pinkLink').should('exist');
    });
});
