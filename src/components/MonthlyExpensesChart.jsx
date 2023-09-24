import { LineChart } from '@mui/x-charts';
import PropTypes from 'prop-types';
import brlFormat from '../utils/currency/brlFormat';
import getChartLabel from '../utils/date/getChartLabel';

/**
 * @typedef {object} MonthlyExpensesChartProps
 * @property {MonthlyExpense[]} monthlyExpenses
 */

/**
 * @param {MonthlyExpensesChartProps} props
 */
const MonthlyExpensesChart = (props) => {
  const { monthlyExpenses } = props;

  if (!monthlyExpenses.length) {
    return null;
  }

  const xLabels = monthlyExpenses.map(getChartLabel);
  const yData = monthlyExpenses.map(({ value }) => value);
  const allZeros = yData.reduce(
    (allZeros, value) => allZeros && value === 0,
    true
  );

  return (
    <LineChart
      xAxis={[
        {
          id: 'months',
          data: xLabels,
          scaleType: 'band',
        },
      ]}
      series={[
        {
          type: 'line',
          curve: 'linear',
          data: yData,
          valueFormatter: brlFormat,
        },
      ]}
      yAxis={[
        {
          max: allZeros ? 1000 : undefined,
        },
      ]}
      height={300}
      margin={{
        top: 40,
        left: 40,
        right: 0,
        bottom: 40,
      }}
      bottomAxis={{
        axisId: 'months',
        disableTicks: true,
      }}
      sx={{
        width: '100%',
      }}
    />
  );
};

MonthlyExpensesChart.propTypes = {
  monthlyExpenses: PropTypes.array,
};

export default MonthlyExpensesChart;
