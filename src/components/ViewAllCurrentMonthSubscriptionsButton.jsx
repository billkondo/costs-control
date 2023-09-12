import CurrentMonthSubscriptionsTable from './CurrentMonthSubscriptionsTable';
import DialogButton from './common/DialogButton';

const ViewAllCurrentMonthSubscriptionsButton = () => {
  return (
    <DialogButton
      dialogTitle="This month's subscriptions"
      buttonText="View All"
      dialogBody={<CurrentMonthSubscriptionsTable />}
    />
  );
};

export default ViewAllCurrentMonthSubscriptionsButton;
