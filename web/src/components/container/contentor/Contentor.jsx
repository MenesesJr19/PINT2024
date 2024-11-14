import './contentor.css';

export function Contentor({props, children}) {
	return (
		<div className='main-contentor'>
				{children}
		</div>
	);
};