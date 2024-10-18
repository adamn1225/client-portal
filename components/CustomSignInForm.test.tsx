import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import CustomSignInForm from '../components/CustomSignInForm';

test('renders the sign-in form', () => {
  const { getByLabelText, getByText } = render(<CustomSignInForm />);
  
  // Test case 1: Check if the email input field is rendered
  const emailInput = getByLabelText('Email');
  expect(emailInput).toBeInTheDocument();

  // Test case 2: Check if the password input field is rendered
  const passwordInput = getByLabelText('Password');
  expect(passwordInput).toBeInTheDocument();

  // Test case 3: Check if the sign-in button is rendered
  const signInButton = getByText('Sign In');
  expect(signInButton).toBeInTheDocument();
});

test('submits the form with valid credentials', () => {
  const { getByLabelText, getByText } = render(<CustomSignInForm />);
  
  // Mock the API call
  const mockSubmit = jest.fn();
  jest.mock('../api', () => ({
    submitForm: mockSubmit,
  }));

  // Fill in the form fields
  const emailInput = getByLabelText('Email');
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

  const passwordInput = getByLabelText('Password');
  fireEvent.change(passwordInput, { target: { value: 'password123' } });

  // Submit the form
  const signInButton = getByText('Sign In');
  fireEvent.click(signInButton);

  // Check if the form is submitted with the correct credentials
  expect(mockSubmit).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'password123',
  });
});

test('displays an error message for invalid credentials', () => {
  const { getByLabelText, getByText } = render(<CustomSignInForm />);
  
  // Mock the API call to return an error
  const mockSubmit = jest.fn().mockRejectedValue(new Error('Invalid credentials'));
  jest.mock('../api', () => ({
    submitForm: mockSubmit,
  }));

  // Fill in the form fields
  const emailInput = getByLabelText('Email');
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

  const passwordInput = getByLabelText('Password');
  fireEvent.change(passwordInput, { target: { value: 'password123' } });

  // Submit the form
  const signInButton = getByText('Sign In');
  fireEvent.click(signInButton);

  // Check if the error message is displayed
  const errorMessage = getByText('Invalid credentials');
  expect(errorMessage).toBeInTheDocument();
});