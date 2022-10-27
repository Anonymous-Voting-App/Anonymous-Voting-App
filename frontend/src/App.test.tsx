import React from 'react';
import { render } from '@testing-library/react';
import App from './components/App';

test('renders App', () => {
    render(<App />);
    // const linkElement = screen.getByText(/Backend not connected/i);
    //const linkElement = screen.getByText(/Create poll/i);

    //expect(linkElement).toBeInTheDocument();
});
