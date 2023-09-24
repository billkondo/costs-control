import { LineChart } from '@mui/x-charts';
import PropTypes from 'prop-types';
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

  return (
    <LineChart
      xAxis={[
        {
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
  );
};

MonthlyExpensesChart.propTypes = {
  monthlyExpenses: PropTypes.array,
};

export default MonthlyExpensesChart;
