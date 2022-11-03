import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './Sidebar';
import UserEvent from '@testing-library/user-event';

test('Renders sidebar page', () => {
    render(
        <Router>
            <Sidebar />
        </Router>
    );
    const pageTitle = screen.getByText('Create poll');
    expect(pageTitle).toBeInTheDocument();
});

test('Redirects to home page rather than admin page', () => {
    render(
        <Router>
            <Sidebar />
        </Router>
    );
    const button = screen.getByRole('button', { name: 'Create poll' });
    expect(button).toBeInTheDocument();
    UserEvent.click(button);
    expect(global.window.location.href).not.toContainEqual('/admin');
});

test('Redirects to admin page', () => {
    render(
        <Router>
            <Sidebar />
        </Router>
    );
    const button = screen.getByRole('button', { name: 'My polls' });
    expect(button).toBeInTheDocument();
    UserEvent.click(button);
    expect(global.window.location.href).toContain('/admin');
});
