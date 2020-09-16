import useCurrentWiki from "../../hooks/wiki/useCurrentWiki";
import useCurrentWorld from "../../hooks/world/useCurrentWorld";
import {Route, Switch, useRouteMatch} from "react-router-dom";
import React, {useState} from "react";
import {LoadingView} from "../LoadingView";
import {PermissionModal} from "../modals/PermissionModal";
import {Col, Row} from "antd";
import {TeamOutlined} from '@ant-design/icons';
import {FolderView} from "./FolderView";
import {WikiEdit} from "./WikiEdit";
import {WikiContent} from "./WikiContent";

export const WikView = () => {
	const {currentWiki, loading: wikiLoading, refetch} = useCurrentWiki();
	const {currentWorld, loading: worldLoading} = useCurrentWorld();
	const match = useRouteMatch();

	const [permissionModalVisibility, setPermissionModalVisibility] = useState(false);

	return (wikiLoading || worldLoading) ? <LoadingView/> :
		<>
			<PermissionModal
				visibility={permissionModalVisibility}
				setVisibility={setPermissionModalVisibility}
				subject={currentWiki}
				subjectType={currentWiki.type}
				refetch={refetch}
			/>
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
								<WikiContent currentWiki={currentWiki}/>
							</div>
						</Route>
					</Switch>
				</Col>
				<Col span={4} className='padding-md'>
					<Route path={`${match.path}/view`}>
						<a title={'View permissions for this page'} onClick={async () => {
							await setPermissionModalVisibility(true);
						}}>
							<TeamOutlined style={{fontSize: '20px'}}/>
						</a>
					</Route>
				</Col>
			</Row>
		</>
};