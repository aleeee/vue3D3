import { geoEqualEarth, geoPath, geoGraticule} from 'd3';

const projection = geoEqualEarth();
const path = geoPath(projection);
const graticule = geoGraticule();

export const Marks = ({ countries, interiors, cities , sizeScale, sizeValue} ) => (
	<g className="marks">
	
	<path className="sphere" d={path({ type: 'Sphere' })}/>	
	<path className="graticules" d={path(graticule())}/>
	
		{ countries.features.map(feature => (
			
			 <path className = "country" d={path(feature)} />
			
			
		))}
	<path className ="interiors" d={path(interiors)}/>
	
	{cities.map(d =>{
		const [x,y] = projection([d.lng, d.lat]);
		return <circle cx={x}
			cy={y}
			r={sizeScale(sizeValue(d))} />
	})}
	</g>
);