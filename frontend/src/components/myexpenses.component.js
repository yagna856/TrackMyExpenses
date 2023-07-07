import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import '../StaticFiles/MyExpenses.css';

const MyExpenses = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const username = searchParams.get('username');

  const [name, setName] = useState('');
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState('Select type');
  const [shortNote, setShortNote] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    // Enable or disable the button based on input field values
    const hasValidInput =
      name !== '' &&
      amount !== 0 &&
      type !== 'Select type' &&
      shortNote !== '' &&
      transactionDate !== '';
    setIsButtonDisabled(!hasValidInput);
  }, [name, amount, type, shortNote, transactionDate]);

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      // Perform logout actions if necessary

      alert('Logged out successfully');

      window.location = '/';
    }
  };

  const handlePostExpense = () => {
    const expenseData = {
      name,
      amount,
      type,
      shortNote,
      transactionDate,
    };
  
    const updatedExpenses = [...expenses, expenseData]; // Add the new expense to the existing expenses array
  
    fetch(`http://localhost:5000/api/${username}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ expenses: updatedExpenses }), // Send the updated expenses array
    })
      .then((response) => {
        if (response.ok) {
          alert('Expense created successfully');
          // Clear input fields
          setName('');
          setAmount(0);
          setType('Select type');
          setShortNote('');
          setTransactionDate('');
          // Update the expenses state with the updated array
          setExpenses(updatedExpenses);
        } else {
          throw new Error('Failed to create expense');
        }
      })
      .catch((error) => {
        console.error('Error creating expense:', error);
        alert('Failed to create expense');
      });
  };
  
  const fetchExpenses = useCallback(() => {
    fetch(`http://localhost:5000/api/${username}/expenses`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch expenses');
        }
      })
      .then(data => {
        setExpenses(data); // Replace the expenses array with the fetched data
      })
      .catch(error => {
        console.error('Error fetching expenses:', error);
        alert('Failed to fetch expenses');
      });
  }, [username]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleDeleteExpense = (index) => {
    const updatedExpenses = [...expenses];
    updatedExpenses.splice(index, 1);
  
    fetch(`http://localhost:5000/api/${username}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ expenses: updatedExpenses }), // Send the updated expenses array
    })
      .then((response) => {
        if (response.ok) {
          alert('Expense deleted successfully');
          // Update the expenses state with the updated array
          setExpenses(updatedExpenses);
        } else {
          throw new Error('Failed to delete expense');
        }
      })
      .catch((error) => {
        console.error('Error deleting expense:', error);
        alert('Failed to delete expense');
      });
  };

  return (
    <div>
      <header>
        <h1>Welcome {username}</h1>
        <h1 className="header-title">Expenses</h1>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <div className="expense-form">
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div>
          <label>Amount:</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={e => setAmount(parseFloat(e.target.value))}
          />
        </div>

        <div>
          <label>Type:</label>
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="Select type">Select type</option>
            <option value="Credit">Credit</option>
            <option value="Debit">Debit</option>
          </select>
        </div>

        <div>
          <label>Short Note:</label>
          <input
            type="text"
            value={shortNote}
            onChange={e => setShortNote(e.target.value)}
          />
        </div>

        <div>
          <label>Transaction Date:</label>
          <input
            type="date"
            value={transactionDate}
            onChange={e => setTransactionDate(e.target.value)}
          />
        </div>

        <button onClick={handlePostExpense} disabled={isButtonDisabled}>
          Post Expense
        </button>
      </div>

      <div className="expense-table">
        <h2>Expense Table</h2>
        {expenses.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Short Note</th>
                <th>Transaction Date</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense, index) => (
                <tr key={index}>
                  <td>{expense.name}</td>
                  <td>{expense.amount}</td>
                  <td>{expense.type}</td>
                  <td>{expense.shortNote}</td>
                  <td>{expense.transactionDate}</td>
                  <td>
                  <button onClick={() => handleDeleteExpense(index)}>
                    Delete
                  </button>
                </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No expenses found.</p>
        )}
      </div>
    </div>
  );
};

export default MyExpenses;
