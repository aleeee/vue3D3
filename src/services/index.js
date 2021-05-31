import React from 'react';
import ReactDOM from 'react-dom';
import { useWorldAtlas } from './useWorldAtlas';
import { useCities } from './useCities';
import {Marks} from './marks';
import {max, scaleSqrt} from 'd3';

const width =  window.innerWidth;
const height = window.innerHeight;


const App = () => {
	const worldAtlas = useWorldAtlas();
	const cities = useCities();
	
	  if (!worldAtlas || !cities) {
    return <pre>Loading...</pre>;
  }
	const sizeValue = d => d.population;
	const maxRadius = 16;
	
	const sizeScale = d3.scaleSqrt()
	.domain( [0, max(cities, sizeValue)])
	.range([0, maxRadius])
	
  return (
  	<svg width = {width} height={height}>
  	<Marks worldAtlas={worldAtlas} cities={cities} sizeScale={sizeScale} sizeValue={sizeValue}/>
  	</svg>
  );	
};
 
const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);

