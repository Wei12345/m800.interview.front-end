import { useCallback, useState, useRef, useMemo, useEffect } from "react";

import uniqueId from "./lib/uniqueId";

import { getLocations, getLocation } from './apis/metaweather'

import PieChart from './components/PieChart/PieChart';
import BarChart from './components/BarChart/BarChart';

import styles from './App.module.scss'

function App() {
  const [value, setValue] = useState('')
  const valueRef = useRef('');

  const [locations, setLocations] = useState([]);
  const [consolidatedWeather, setConsolidatedWeather] = useState(null);

  const handleChange = useCallback(async (e) => {
    setValue(e.target.value);
    valueRef.current = e.target.value;

    const locations = await getLocations({ query: e.target.value });
    if (e.target.value === valueRef.current) {
      setLocations(locations)
    }
  }, [])

  const locationWoeid = useMemo(() => {
    const location = locations.find(({ title }) => title === value)
    return location?.woeid ?? -1;
  }, [value, locations]);

  const datalistOptions = useMemo(() => {
    if (locationWoeid > -1) {
      return null;
    }

    return locations.map(({ woeid, title }) => <option key={woeid} value={title} />);
  }, [locationWoeid, locations])

  useEffect(() => {
    const fetchLocation = async (woeid) => {
      const location = await getLocation({ woeid });
      setConsolidatedWeather(location?.consolidated_weather ?? null)
    }
    fetchLocation(locationWoeid);
  }, [locationWoeid])

  const chartData = useMemo(() => {
    if (!consolidatedWeather) {
      return {
        pie: [],
        bar: {
          labels: [],
          datasets: [],
        }
      }
    }

    const pie = consolidatedWeather.map(({ humidity, applicable_date }) => ({
      humidity,
      label: applicable_date,
    }))

    const roundToTwoDecimalPoint = num => Math.round(num * 100) / 100

    const barLabels = consolidatedWeather.map(({ applicable_date }) => applicable_date);
    const barDatasets = consolidatedWeather.map(({ max_temp, min_temp }) => [
      roundToTwoDecimalPoint(min_temp),
      roundToTwoDecimalPoint(max_temp)
    ]);

    return {
      pie,
      bar: {
        labels: barLabels,
        datasets: barDatasets,
      }
    }
  }, [consolidatedWeather])

  const pieChart = useMemo(() => {
    return chartData.pie.map(({ label, humidity }) =>
      (
        <div
          key={uniqueId()}
          className={styles.App__PieChartItem}
        >
          <PieChart className={styles.App__PieChart} percentage={humidity} />
          {label}
        </div>
      )
    )

  }, [chartData])

  return (
    <div className="App">
      <input list="location-list" type="text" value={value} onChange={handleChange}></input>
      <datalist id="location-list">
        {datalistOptions}
      </datalist>
      <div className={styles.App__PieChartWrapper}>
        {pieChart}
      </div>
      <div>
        <BarChart
          labels={{
            x: chartData.bar.labels,
            y: [-60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60]
          }}
          datasets={chartData.bar.datasets}
        />
      </div>
    </div>
  );
}

export default App;
