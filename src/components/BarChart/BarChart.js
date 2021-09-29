import { useMemo, useRef } from 'react';

import uniqueId from '../../lib/uniqueId';

import styles from './BarChart.module.scss';

export default function BarChart({ className, labels, datasets }) {
  const { x: xLabels, y: yLabels } = labels;
  const { current: WIDTH } = useRef(1200);
  const { current: HEIGHT } = useRef(500);
  const { current: PADDING } = useRef(100);
  const { current: contentWidth } = useRef(WIDTH - PADDING * 2);
  const { current: contentHeight } = useRef(HEIGHT - PADDING * 2);

  const yTexts = useMemo(() => {
    const clonedYLabels = [...yLabels];
    clonedYLabels.sort((a, b) => b - a)
    return clonedYLabels
      .map((label, index) => {
        const position = PADDING + index / (yLabels.length - 1) * contentHeight;
        const TEXT_OFFSET = 20;

        return (
          <text
            key={uniqueId()}
            className={styles.BarChart__Text}
            x={PADDING - TEXT_OFFSET}
            y={position}
          >{label}</text>
        )
      })
  }, [PADDING, contentHeight, yLabels]);

  const xTexts = useMemo(() => {
    return xLabels.map((label, index) => {
      const position = PADDING + index / xLabels.length * contentWidth;
      const TEXT_OFFSET = 20;

      return (
        <text
          key={uniqueId()}
          className={styles.BarChart__Text}
          x={position}
          y={PADDING + contentHeight + TEXT_OFFSET}
        >{label}</text>
      )
    })
  }, [PADDING, contentWidth, contentHeight, xLabels]);

  const bars = useMemo(() => {
    console.log(yLabels[0], yLabels[yLabels.length - 1])
    const [minY, maxY] = [yLabels[0], yLabels[yLabels.length - 1]];
    const points = maxY - minY;
    console.log(points);

    return datasets.map(([minData, maxData], index) => {
      const positionX = PADDING + index / xLabels.length * contentWidth;
      const width = 1 / xLabels.length * 0.5 * contentWidth;

      const positionY = PADDING + (maxY - maxData) / points * contentHeight;
      const height = (maxData - minData) / points * contentHeight;

      return (
        <g
          key={uniqueId()}
          style={{
            transform: `translate(${positionX}px, ${positionY}px)`,
          }}
        >
          <text>
            <tspan>max:{maxData}</tspan>
            <tspan dx="10">min:{minData}</tspan>
          </text>
          <rect
            width={width}
            height={height}
          ></rect>
        </g>
      )
    })
  }, [PADDING, contentWidth, contentHeight, xLabels, yLabels, datasets])

  return (
    <svg className={`${styles.BarChart} ${className}`} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
      {xTexts}
      {yTexts}

      <line x1={PADDING} x2={PADDING} y1={PADDING} y2={PADDING + contentHeight} className={styles.BarChart__Line}></line>
      <line x1={PADDING} x2={PADDING + contentWidth} y1={PADDING + contentHeight} y2={PADDING + contentHeight} className={styles.BarChart__Line}></line>

      {bars}
    </svg>
  )
}