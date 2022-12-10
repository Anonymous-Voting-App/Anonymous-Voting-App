import 'cypress-localstorage-commands';

describe('edit and delete users ', () => {
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

    before(() => {
        cy.visit(
            'https://staging.knowit-anonymous-voting-app.aws.cybercom.dev/register'
        );
        cy.get('.fields').children().first().type(random_string);
        cy.get('.fields').children().eq(1).type('password');
        cy.get('.fields').children().eq(2).type('password');
        cy.get('.fields').children().eq(3).type('Jane');
        cy.get('.fields').children().eq(4).type('Doe');
        cy.get('.fields')
            .children()
            .eq(5)
            .type(random_string + '@gmail.com');
        cy.get('.login-btn').click();
        //eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(2000);
        cy.get('.fields').children().first().type('testAdmin');
        cy.get('.fields').children().eq(1).type('admin@1234');
        cy.get('.login-btn').click();
        cy.saveLocalStorage();
    });
    it('can edit password and admin status', () => {
        cy.restoreLocalStorage();
        //eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(2000);
        cy.contains('My polls').click();
        cy.contains('Search by').click();
        cy.contains('User name').click();
        cy.get('.searchField').type(random_string);
        cy.get('.searchButton').click();
        cy.contains('Edit').should('exist');
        cy.contains('Edit').click();
        //cy.get('.field').first().type('2');
        cy.get('.field').last().type('newpassword');
        cy.get('.vote-count-switch').click();
        cy.contains('Update').click();
        cy.get('.MuiAlert-filledSuccess').should('exist');
        //eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(2000);
        cy.contains('Logout').click();
        cy.contains('Login').click();
        cy.get('.fields').children().first().type(random_string);
        cy.get('.fields').children().eq(1).type('newpassword');
        cy.get('.login-btn').click();
        cy.url().should(
            'eq',
            'https://staging.knowit-anonymous-voting-app.aws.cybercom.dev/'
        );
    });
    it('can delete user', () => {
        cy.visit(
            'https://staging.knowit-anonymous-voting-app.aws.cybercom.dev/login'
        );
        cy.get('.fields').children().first().type('testAdmin');
        cy.get('.fields').children().eq(1).type('admin@1234');
        cy.get('.login-btn').click();
        //eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(2000);
        cy.contains('My polls').click();
        cy.contains('Search by').click();
        cy.contains('User name').click();
        cy.get('.searchField').type(random_string);
        cy.get('.searchButton').click();
        cy.contains('Delete user').click();
        cy.contains('No data found').should('exist');
    });
});
