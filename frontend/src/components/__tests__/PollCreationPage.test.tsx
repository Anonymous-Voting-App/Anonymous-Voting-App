import { render, screen, fireEvent } from '@testing-library/react';
import PollCreationPage from '../PollCreationPage';
import UserEvent from '@testing-library/user-event';

test('Renders page heading', () => {
    render(<PollCreationPage />);
    const pageTitle = screen.getByText('Create poll');
    expect(pageTitle).toBeInTheDocument();
});

test('Renders submit button for submitting the poll questions', () => {
    render(<PollCreationPage />);
    const button = screen.getByRole('button', { name: 'Submit Poll' });
    expect(button).toBeInTheDocument();
    expect(button.getAttribute('type')).toBe('submit');
});

test('Renders button for adding a poll question', () => {
    render(<PollCreationPage />);
    const button = screen.getByRole('button', { name: 'Add a question' });
    expect(button).toBeInTheDocument();
});

test('Page includes text input for poll name', () => {
    render(<PollCreationPage />);
    const field = screen.getByTestId('poll-name-field');
    expect(field).toBeInTheDocument();

    fireEvent.change(field, { target: { value: 'text field value' } });
    expect(field).toHaveValue('text field value');
});

test('Question component is rendered when add question btn is clicked', () => {
    render(<PollCreationPage />);
    const button = screen.getByRole('button', { name: 'Add a question' });
    UserEvent.click(button);
    expect(screen.getByLabelText('Question type')).toBeInTheDocument();
    expect(screen.getByTestId('question-field')).toBeInTheDocument();
});
