import { render, screen, fireEvent } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import Question from '../Question';

test('Renders two text fields for question options when question type is selected', () => {
    const question = {
        title: '',
        description: '',
        visualType: '',
        minAnswers: 1,
        maxAnswers: 1,
        subQuestions: [{ title: '', description: '', type: '' }]
    };
    const onTypeChange = jest.fn();
    const onQuestionInput = jest.fn();
    const onOptionInput = jest.fn();
    const onQuestionRemove = jest.fn();

    render(
        <Question
            ques={question}
            ind={1}
            typeChangehandler={onTypeChange}
            questionInputHandler={onQuestionInput}
            optionInputHandler={onOptionInput}
            questionRemovalHandler={onQuestionRemove}
        />
    );

    UserEvent.click(screen.getByRole('button', { name: 'Question type' }));
    UserEvent.click(screen.getByText(/Pick One/i));
    const inputFields = screen.getAllByRole('textbox', { name: '' });
    expect(inputFields.length).toBe(2);
});

test('onTypeChange is called when question type is selected', () => {
    const question = {
        title: '',
        description: '',
        visualType: '',
        minAnswers: 1,
        maxAnswers: 1,
        subQuestions: [{ title: '', description: '', type: '' }]
    };
    const onTypeChange = jest.fn();
    const onQuestionInput = jest.fn();
    const onOptionInput = jest.fn();
    const onQuestionRemove = jest.fn();

    render(
        <Question
            ques={question}
            ind={1}
            typeChangehandler={onTypeChange}
            questionInputHandler={onQuestionInput}
            optionInputHandler={onOptionInput}
            questionRemovalHandler={onQuestionRemove}
        />
    );

    UserEvent.click(screen.getByRole('button', { name: 'Question type' }));
    UserEvent.click(screen.getByText(/Multi - choice/i));
    expect(onTypeChange).toHaveBeenCalledTimes(1);
});

test('onQuestionInput is called when question is entered in the text field', () => {
    const question = {
        title: '',
        description: '',
        visualType: '',
        minAnswers: 1,
        maxAnswers: 1,
        subQuestions: [{ title: '', description: '', type: '' }]
    };
    const onTypeChange = jest.fn();
    const onQuestionInput = jest.fn();
    const onOptionInput = jest.fn();
    const onQuestionRemove = jest.fn();

    render(
        <Question
            ques={question}
            ind={1}
            typeChangehandler={onTypeChange}
            questionInputHandler={onQuestionInput}
            optionInputHandler={onOptionInput}
            questionRemovalHandler={onQuestionRemove}
        />
    );

    fireEvent.change(screen.getByTestId('question-field'), {
        target: { value: 'new question is entered' }
    });
    expect(onQuestionInput).toHaveBeenCalledTimes(1);
});

test('optionInputHandler is called when options are entered in the text field', () => {
    const question = {
        title: '',
        description: '',
        visualType: '',
        minAnswers: 1,
        maxAnswers: 1,
        subQuestions: [{ title: '', description: '', type: '' }]
    };
    const onTypeChange = jest.fn();
    const onQuestionInput = jest.fn();
    const onOptionInput = jest.fn();
    const onQuestionRemove = jest.fn();

    render(
        <Question
            ques={question}
            ind={1}
            typeChangehandler={onTypeChange}
            questionInputHandler={onQuestionInput}
            optionInputHandler={onOptionInput}
            questionRemovalHandler={onQuestionRemove}
        />
    );

    // UserEvent.click(getByRole(screen.getByTestId('ques-type-field'), 'button')); commented due to lint error
    UserEvent.click(screen.getByRole('button', { name: 'Question type' }));
    UserEvent.click(screen.getByText(/Pick One/i));
    fireEvent.change(screen.getByTestId('option-field-0'), {
        target: { value: 'new option is entered' }
    });
    expect(onOptionInput).toHaveBeenCalledTimes(1);
});

test('option is removed delete icon is clicked', () => {
    const question = {
        title: '',
        description: '',
        visualType: '',
        minAnswers: 1,
        maxAnswers: 1,
        subQuestions: [{ title: '', description: '', type: '' }]
    };
    const onTypeChange = jest.fn();
    const onQuestionInput = jest.fn();
    const onOptionInput = jest.fn();
    const onQuestionRemove = jest.fn();

    render(
        <Question
            ques={question}
            ind={1}
            typeChangehandler={onTypeChange}
            questionInputHandler={onQuestionInput}
            optionInputHandler={onOptionInput}
            questionRemovalHandler={onQuestionRemove}
        />
    );

    // UserEvent.click(getByRole(screen.getByTestId('ques-type-field'), 'button'));
    UserEvent.click(screen.getByRole('button', { name: 'Question type' }));
    UserEvent.click(screen.getByText(/Pick One/i));
    UserEvent.click(screen.getByTestId('option-delete-0'));
    expect(onOptionInput).toHaveBeenCalledTimes(1);
});

test('new option field is added add an option btn is clicked', () => {
    const question = {
        title: '',
        description: '',
        visualType: '',
        minAnswers: 1,
        maxAnswers: 1,
        subQuestions: [{ title: '', description: '', type: '' }]
    };
    const onTypeChange = jest.fn();
    const onQuestionInput = jest.fn();
    const onOptionInput = jest.fn();
    const onQuestionRemove = jest.fn();

    render(
        <Question
            ques={question}
            ind={1}
            typeChangehandler={onTypeChange}
            questionInputHandler={onQuestionInput}
            questionRemovalHandler={onQuestionRemove}
            optionInputHandler={onOptionInput}
        />
    );

    // UserEvent.click(getByRole(screen.getByTestId('ques-type-field'), 'button'));
    UserEvent.click(screen.getByRole('button', { name: 'Question type' }));
    UserEvent.click(screen.getByText(/Pick One/i));
    UserEvent.click(screen.getByText(/Add a new option/i));
    const inputFields = screen.getAllByRole('textbox', { name: '' });
    expect(inputFields.length).toBe(3); // 1 default question field + 1 default option fields + 1 newly added field = 3
});
