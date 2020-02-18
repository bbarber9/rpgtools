import React, {Component, useEffect, useRef, useState} from 'react';
import {Icon} from "antd";
import {ScaledImage} from "./ScaledImage";
import {Editor} from "./Editor";
import useCurrentWiki from "../../hooks/useCurrentWiki";
import useCurrentWorld from "../../hooks/useCurrentWorld";
import {useHistory, useParams} from "react-router-dom";

export const WikiView = () => {

	const history = useHistory();

	const [height, setHeight] = useState(0);
	const [width, setWidth] = useState(0);

	const {currentWiki} = useCurrentWiki();
	const {currentWorld} = useCurrentWorld();

	const wikiView = useRef(null);

	const {wiki_id} = useParams();

	useEffect(() => {
		if (wikiView.content) {
			setHeight(wikiView.content.offsetHeight);
			setWidth(wikiView.content.offsetHeight)
		}
	});

	const getPinFromPageId = (pageId) => {
		for (let pin of currentWorld.pins) {
			if (pin.page._id && pin.page._id === pageId) {
				return pin;
			}
		}
	};

	if (!currentWiki) {
		return (<div>{`404 - Wiki ${wiki_id} not found`}</div>);
	}

	let coverImage = null;
	if (currentWiki.coverImage) {
		coverImage = <div className='padding-md' style={{width: '100%'}}>
			<img alt={currentWiki.coverImage.name} style={{"objectFit": "contain", width: '100%'}}
			      src={`/images/${currentWiki.coverImage.chunks[0].fileId}`}/>
		</div>;
	}

	let mapIcon = null;
	if (currentWiki.type === 'Place' && currentWiki.mapImage) {
		mapIcon = <div className='padding-md' style={{width: '100%'}}>
			<img alt={currentWiki.mapImage.name} style={{"objectFit": "contain"}}
			     src={`/images/${currentWiki.mapImage.icon.chunks[0].fileId}`}/>
			<span className='margin-md-left'>
					<a href='#' onClick={() => {
						history.push(`/ui/world/${currentWorld._id}/map/${currentWiki._id}`);
					}}>
						Go to Map <Icon type="export"/>
					</a>
				</span>
		</div>;
	}

	let gotoMap = null;
	let pin = getPinFromPageId(currentWiki._id);
	if (pin) {
		gotoMap = <a href='#' onClick={() => {
			history.push(`/ui/world/${currentWorld._id}/map/${pin.map}`);
		}}>
			See on map <Icon type="export"/>
		</a>;
	}

	return (
		<div ref={wikiView} className='margin-md-top'>

			<h1>{currentWiki.name}</h1>
			{gotoMap}
			<h2>{currentWiki.type}</h2>
			{coverImage}
			{mapIcon}
			<div className='padding-md'>
				<Editor
					content={currentWiki.content}
					readOnly={true}
					onInit={(editor) => {
						setHeight(editor.container.offsetWidth);
						setWidth(editor.container.offsetWidth)
					}}
				/>
			</div>
			<div className='padding-md'>
				{currentWiki.canWrite &&
					<a href='#' onClick={() => {
						history.push(`/ui/world/${currentWorld._id}/wiki/${currentWiki._id}/edit`);
					}}>
						<Icon type="edit" theme="outlined"/>Edit
					</a>
				}
			</div>
		</div>
	);

};