describe('view login page and enter text to texfields', () => {
    it('can view log in page', () => {
        cy.visit(
            'https://staging.knowit-anonymous-voting-app.aws.cybercom.dev/'
        );
        cy.contains('Login').click();
        cy.url().should('include', '/login');
    });
    it('can fill textfields', () => {
        cy.get('.fields').children().first().type('Jane');
        cy.get('.fields').children().eq(1).type('password');
        cy.get('.fields')
            .children()
            .first()
            .find('input')
            .invoke('val')
            .should('equal', 'Jane');
        cy.get('.fields')
            .children()
            .eq(1)
            .find('input')
            .invoke('val')
            .should('equal', 'password');
    });
});
