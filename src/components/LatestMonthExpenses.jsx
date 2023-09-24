import { Typography } from '@mui/material';
import { LineChart } from '@mui/x-charts';
import { useEffect, useState } from 'react';
import MonthlyExpenses from '../firebase/firestore/MonthlyExpenses';
import useAuthentication from '../providers/useAuthentication';
import getChartLabel from '../utils/date/getChartLabel';

const LatestMonthExpenses = () => {
  const { authenticatedUserId } = useAuthentication();
  const [monthlyExpenses, setMonthlyExpenses] = useState(
    /** @type {MonthlyExpense[]} */ ([])
  );

  useEffect(() => {
    const unsubscribe = MonthlyExpenses.latestMonths.listener(
      authenticatedUserId,
      (monthlyExpenses) => {
        setMonthlyExpenses(monthlyExpenses);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [authenticatedUserId]);

  if (!monthlyExpenses.length) {
    return null;
  }

  const xLabels = monthlyExpenses.map(getChartLabel);
  const yData = monthlyExpenses.map(({ value }) => value);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Typography variant="h6">Latest months expenses</Typography>
      <LineChart
        xAxis={[
          {
            id: 'barCategories',
            data: xLabels,
            scaleType: 'band',
          },
        ]}
        series={[
          {
            type: 'line',
            curve: 'linear',
            data: yData,
          },
        ]}
        height={300}
        margin={{
          top: 40,
          left: 40,
          right: 0,
          bottom: 40,
        }}
        sx={{
          width: '100%',
        }}
      />
    </div>
  );
};

export default LatestMonthExpenses;
