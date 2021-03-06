import {Redirect, Route, Switch, useRouteMatch} from "react-router-dom";
import useCurrentWorld from "../hooks/useCurrentWorld";
import {LoadingView} from "./LoadingView";
import {MapView} from "./map/MapView";
import React from "react";
import useCurrentWiki from "../hooks/useCurrentWiki";
import {Col, Row} from "antd";
import {FolderView} from "./wiki/FolderView";
import {WikiEdit} from "./wiki/WikiEdit";
import {WikiView} from "./wiki/WikiView";
import useSetPermissionModalVisibility from "../hooks/useSetPermissionModalVisibility";
import {Modals} from "./App";
import WorldSettings from "./WorldSettings";
import RolesView from "./permissions/RolesView";
import {TeamOutlined} from "@ant-design/icons";
import useSetPermissionEditorSubject from "../hooks/useSetPermissionEditorSubject";
import useSetPermissionEditorSubjectType from "../hooks/useSetPermissionEditorSubjectType";
import MyPermissionsView from "./permissions/MyPermissionsView";

const WikiContent = () => {
	const {currentWiki, loading: wikiLoading} = useCurrentWiki();
	const {currentWorld, loading: worldLoading} = useCurrentWorld();
	const {setPermissionModalVisibility} = useSetPermissionModalVisibility();
	const match = useRouteMatch();
	const {setPermissionEditorSubject} = useSetPermissionEditorSubject();
	const {setPermissionEditorSubjectType} = useSetPermissionEditorSubjectType();

	return wikiLoading || worldLoading ? <LoadingView/> :
			<Row>
				<Col span={4} className='padding-md'>
					<FolderView/>
				</Col>
				<Col span={16}>
					<Switch>
						<Route path={`${match.path}/edit`}>
							<WikiEdit/>
						</Route>
						<Route path={`${match.path}/view`}>
							<div>
								<WikiView currentWiki={currentWiki}/>
							</div>
						</Route>
					</Switch>
				</Col>
				<Col span={4} className='padding-md'>
					<Route path={`${match.path}/view`}>
						{currentWiki.canWrite &&
							<a title={'View permissions for this page'} onClick={async () => {
								await setPermissionEditorSubject(currentWiki);
								await setPermissionEditorSubjectType(currentWiki.type);
								await setPermissionModalVisibility(true);
							}}>
								<TeamOutlined style={{fontSize: '20px'}}/>
							</a>
						}
					</Route>
				</Col>
			</Row>
};

export const AppContent = () => {

	const match = useRouteMatch();
	const {currentWorld, loading: worldLoading} = useCurrentWorld();

	if(worldLoading){
		return <LoadingView/>;
	}

	if(!currentWorld){
		return (
			<div>
				{`404 - World ${match.params.world_id} not found`}
			</div>
		);
	}

	return (
		<Switch>
			<Route path={`${match.path}/settings`}>
				<Modals/>
				<WorldSettings/>
			</Route>
			<Route path={`${match.path}/myPermissions`}>
				<Modals/>
				<MyPermissionsView/>
			</Route>
			<Route path={`${match.path}/roles`}>
				<Modals/>
				<RolesView/>
			</Route>
			<Route path={`${match.path}/map/:map_id`}>
				<Modals/>
				<MapView/>
			</Route>
			<Route path={`${match.path}/wiki/:wiki_id`}>
				<Modals/>
				<WikiContent/>
			</Route>
			{/*<Route path="/ui/game">*/}
			{/*    <GameContainer/>*/}
			{/*</Route>*/}
			<Route>
				<Redirect to={`/ui/world/${currentWorld._id}/map/${currentWorld.wikiPage._id}`}/>
			</Route>
		</Switch>
	);
};