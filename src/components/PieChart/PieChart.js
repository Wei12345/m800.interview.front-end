import styles from './PieChart.module.scss';

export default function PieChart({ className, percentage }) {
  const PI = 3.1415926;

  const SIZE = 64;
  const radius = SIZE / 2;
  const circumference = radius * 2 * PI;
  const percentageLength = percentage * circumference / 100;

  return (
    <svg className={`${styles.PieChart} ${className}`} viewBox={`0 0 ${SIZE} ${SIZE}`}>
      <circle
        r="50%"
        cx="50%"
        cy="50%"
        strokeDasharray={`${percentageLength} ${circumference}`}
        className={styles.PieChart__Circle}
      />
      <text x="50%" y="50%" className={styles.PieChart__Text} >{percentage}%</text>
    </svg>
  )
}