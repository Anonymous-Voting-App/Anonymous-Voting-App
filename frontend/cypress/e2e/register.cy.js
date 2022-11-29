describe('view sign up page and enter text to texfields', () => {
    it('can view sign up page', () => {
        cy.visit(
            'https://staging.knowit-anonymous-voting-app.aws.cybercom.dev/login'
        );
        cy.contains('Register').click();
        cy.url().should('include', '/register');
    });
    it('can fill textfields', () => {
        cy.get('.fields').children().first().type('xx_JaneD_xx');
        cy.get('.fields').children().eq(1).type('password');
        cy.get('.fields').children().eq(2).type('password');
        cy.get('.fields').children().eq(3).type('Jane');
        cy.get('.fields').children().eq(4).type('Doe');
        cy.get('.fields').children().eq(5).type('jane.doe@gmail.com');

        cy.get('.fields')
            .children()
            .first()
            .find('input')
            .invoke('val')
            .should('equal', 'xx_JaneD_xx');

        cy.get('.fields')
            .children()
            .eq(1)
            .find('input')
            .invoke('val')
            .should('equal', 'password');

        cy.get('.fields')
            .children()
            .eq(2)
            .find('input')
            .invoke('val')
            .should('equal', 'password');

        cy.get('.fields')
            .children()
            .eq(3)
            .find('input')
            .invoke('val')
            .should('equal', 'Jane');

        cy.get('.fields')
            .children()
            .eq(4)
            .find('input')
            .invoke('val')
            .should('equal', 'Doe');

        cy.get('.fields')
            .children()
            .eq(5)
            .find('input')
            .invoke('val')
            .should('equal', 'jane.doe@gmail.com');
    });
});
