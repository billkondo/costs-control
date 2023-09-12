import { useEffect } from 'react';
import useExpenses from '../providers/useExpenses';
import ExpensesListGroupedByDay from './ExpensesListGroupedByDay';
import DialogButton from './common/DialogButton';

const ViewAllCurrentMonthExpensesButton = () => {
  return (
    <DialogButton
      dialogTitle="This month's expenses"
      buttonText="View All"
      dialogBody={<CurrentMonthExpensesDialogBody />}
      fullScreen
    />
  );
};

const CurrentMonthExpensesDialogBody = () => {
  const { loadCurrentMonthExpenses, currentMonthExpenses } = useExpenses();

  useEffect(() => {
    loadCurrentMonthExpenses();
  }, [loadCurrentMonthExpenses]);

  return <ExpensesListGroupedByDay expenses={currentMonthExpenses} />;
};

export default ViewAllCurrentMonthExpensesButton;
