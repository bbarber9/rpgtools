import React from 'react';
import useCurrentGame from "../../hooks/game/useCurrentGame";


export const GameControlsHelp = ({cameraMode}) => {
	const {currentGame} = useCurrentGame();

	let helpText = '';
	if(cameraMode === 'camera'){
		helpText = <>
			Left click and drag to rotate camera
			<br/>
			Right click and drag to pan camera
			<br/>
			Scroll to zoom in or out
		</>;
	}
	if(cameraMode === 'painting'){
		helpText = <>
			Left click and drag to paint on map
			<br/>
			See "Brush Options" in side panel for painting config
		</>;
	}
	if(cameraMode === 'move model'){
		helpText = <>
			Left click on a model and drag to move it
		</>;
	}
	return <>
		<div style={{position: 'absolute', left: '0px', top: '0px'}}>
			<p style={{color: 'white'}}>
				Controls Mode: {cameraMode}
				<br/>
				Press 'c' to switch to camera mode
				<br/>
				{currentGame.canWrite && <>
					Press 'p' to switch to painting mode
					<br/>
					Press 'm' to switch to move model mode
					<br/>
				</>}
				{helpText}
			</p>
		</div>
	</>;
};