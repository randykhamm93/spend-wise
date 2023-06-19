import { useState } from 'react';

export const IncomeList = ({ incomes, setIncomes, incomeFrequencies, incomeCategories, onAddIncome, isEditMode, setIsEditMode }) => {
  const [selectedIncome, setSelectedIncome] = useState(null);

  const handleCheckboxChange = (event, income) => {
    if (event.target.checked) {
      setSelectedIncome(income);
    } else {
      setSelectedIncome(null);
      setIsEditMode(false);
    }
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleDelete = () => {
    // Delete income from the database
    fetch(`http://localhost:8088/incomes/${selectedIncome.id}`, {
      method: 'DELETE'
    })
      .then(response => {
        // Remove the deleted income from the incomes list
        setIncomes(incomes.filter(item => item.id !== selectedIncome.id));
        setSelectedIncome(null);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleSave = () => {
    // Save the edited income to the database
    fetch(`http://localhost:8088/incomes/${selectedIncome.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(selectedIncome)
    })
      .then(response => response.json())
      .then(data => {
        // Update the incomes list with the edited income
        setIncomes(incomes.map(item => (item.id === selectedIncome.id ? selectedIncome : item)));
        setSelectedIncome(null);
        setIsEditMode(false);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <table className="table">
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Amount</th>
          <th>Frequency</th>
          <th>Category</th>
        </tr>
      </thead>
      <tbody>
        {incomes.map(income => (
          <tr key={income.id}>
            <td>
              <input type="checkbox" onChange={(event) => handleCheckboxChange(event, income)} />
            </td>
            <td>
              {isEditMode && selectedIncome.id === income.id ? (
                <input type="text" value={selectedIncome.name} onChange={(e) => setSelectedIncome({ ...selectedIncome, name: e.target.value })} />
              ) : (
                income.name
              )}
            </td>
            <td>
              {isEditMode && selectedIncome.id === income.id ? (
                <input type="number" value={selectedIncome.amount} onChange={(e) => setSelectedIncome({ ...selectedIncome, amount: parseFloat(e.target.value) })} />
              ) : (
                income.amount
              )}
            </td>
            <td>
              {isEditMode && selectedIncome.id === income.id ? (
                <select value={selectedIncome.incomeFrequencyId} onChange={(e) => setSelectedIncome({ ...selectedIncome, incomeFrequencyId: parseInt(e.target.value) })}>
                  {incomeFrequencies.map(frequency => (
                    <option key={frequency.id} value={frequency.id}>{frequency.name}</option>
                  ))}
                </select>
              ) : (
                incomeFrequencies.find(frequency => frequency.id === Number(income.incomeFrequencyId))?.name || ''
              )}

            </td>
            <td>
              {isEditMode && selectedIncome.id === income.id ? (
                <select value={selectedIncome.incomeCategoryId} onChange={(e) => setSelectedIncome({ ...selectedIncome, incomeCategoryId: parseInt(e.target.value) })}>
                  {incomeCategories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              ) : (
                incomeCategories.find(category => category.id === Number(income.incomeCategoryId))?.name || ''
              )}

            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan="5">
            <button className="btn btn-primary" onClick={handleEdit} disabled={!selectedIncome}>Edit</button>
            <button className="btn btn-danger" onClick={handleDelete} disabled={!selectedIncome}>Delete</button>
            {isEditMode && <button className="btn btn-success" onClick={handleSave}>Save</button>}
          </td>
        </tr>
      </tfoot>
    </table>
  );
};
