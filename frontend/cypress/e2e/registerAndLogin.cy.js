describe('login and register', () => {
    before(() => {
        cy.visit(
            'https://staging.knowit-anonymous-voting-app.aws.cybercom.dev/login'
        );
        cy.contains('Register').click();
    });

    var random_string = generate_random_string(8);
    function generate_random_string(string_length) {
        let random_string = '';
        let random_ascii;
        for (let i = 0; i < string_length; i++) {
            random_ascii = Math.floor(Math.random() * 25 + 97);
            random_string += String.fromCharCode(random_ascii);
        }
        return random_string;
    }

    it('can register', () => {
        cy.get('.fields').children().first().type(random_string);
        cy.get('.fields').children().eq(1).type('password');
        cy.get('.fields').children().eq(2).type('password');
        cy.get('.fields').children().eq(3).type('Jane');
        cy.get('.fields').children().eq(4).type('Doe');
        cy.get('.fields')
            .children()
            .eq(5)
            .type(random_string + '@gmail.com');

        cy.get('.fields')
            .children()
            .first()
            .find('input')
            .invoke('val')
            .should('equal', random_string);

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
            .should('equal', random_string + '@gmail.com');
        cy.get('.login-btn').click();
        cy.url().should('include', '/login');
    });
    it('can login', () => {
        cy.get('.fields').children().first().type(random_string);
        cy.get('.fields').children().eq(1).type('password');
        cy.get('.fields')
            .children()
            .first()
            .find('input')
            .invoke('val')
            .should('equal', random_string);
        cy.get('.fields')
            .children()
            .eq(1)
            .find('input')
            .invoke('val')
            .should('equal', 'password');

        cy.get('.login-btn').click();
        cy.url().should(
            'eq',
            'https://staging.knowit-anonymous-voting-app.aws.cybercom.dev/'
        );
    });
});
