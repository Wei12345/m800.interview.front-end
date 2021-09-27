import { useCallback, useState, useRef, useMemo, useEffect } from "react";

import { getLocations, getLocation } from './apis/metaweather'

import PieChart from './components/PieChart/PieChart';

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

  return (
    <div className="App">
      <input list="location-list" type="text" value={value} onChange={handleChange}></input>
      <datalist id="location-list">
        {datalistOptions}
      </datalist>
      <div className={styles.App__PieChartWrapper}>
        <PieChart className={styles.App__PieChart} percentage={20} />
      </div>
    </div>
  );
}

export default App;
