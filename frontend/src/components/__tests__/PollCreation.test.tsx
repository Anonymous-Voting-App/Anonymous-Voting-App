import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import PollCreation from '../PollCreation';
// import UserEvent from '@testing-library/user-event';

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate
}));

test('Renders page heading', () => {
    render(
        <Router>
            <PollCreation />
        </Router>
    );
    const pageTitle = screen.getByText('Create poll');
    expect(pageTitle).toBeInTheDocument();
});

test('Renders submit button for submitting the poll questions', () => {
    render(
        <Router>
            <PollCreation />
        </Router>
    );
    const button = screen.getByRole('button', { name: 'Create a poll' });
    expect(button).toBeInTheDocument();
    expect(button.getAttribute('type')).toBe('submit');
});

test('Renders button for adding a poll question', () => {
    render(
        <Router>
            <PollCreation />
        </Router>
    );
    const button = screen.getByRole('button', { name: 'Add a question' });
    expect(button).toBeInTheDocument();
});

test('Page includes text input for poll name', () => {
    render(
        <Router>
            <PollCreation />
        </Router>
    );
    const field = screen.getByTestId('poll-name-field');
    expect(field).toBeInTheDocument();

    fireEvent.change(field, { target: { value: 'text field value' } });
    expect(field).toHaveValue('text field value');
});

// test('Question component is rendered when add question btn is clicked', () => {
//     render(<PollCreation />);
//     const button = screen.getByRole('button', { name: 'Add a question' });
//    console.log(expect(button).toBeInTheDocument()) ;
//     UserEvent.click(button);
//     expect(screen.getByLabelText('Question type')).toBeInTheDocument();
//     expect(screen.getByTestId('question-field')).toBeInTheDocument();
// });
