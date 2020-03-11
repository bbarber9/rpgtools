import React, {useEffect, useState} from 'react';
import {Button, Col, Icon, Input, List, Modal, Radio, Row, Tabs} from "antd";
import {WIKI_PERMISSIONS, WORLD_PERMISSIONS} from "../../permission-constants";
import useCurrentWorld from "../hooks/useCurrentWorld";
import useCurrentWiki from "../hooks/useCurrentWiki";
import useCurrentUser from "../hooks/useCurrentUser";
import {useSearchUsers} from "../hooks/useSearchUsers";
import {useSearchRoles} from "../hooks/useSearchRoles";
import {useGrantUserPermission} from "../hooks/useGrantUserPermisison";
import {useGrantRolePermission} from "../hooks/useGrantRolePermission";
import {useRevokeUserPermission} from "../hooks/useRevokeUserPermission";
import {useRevokeRolePermission} from "../hooks/useRevokeRolePermission";
import {WIKI_PAGE, WORLD} from "../../type-constants";

export default () => {

	const {currentWorld, loading: currentWorldLoading} = useCurrentWorld();
	const {currentWiki, loading: currentWikiLoading} = useCurrentWiki();
	const {refetch} = useCurrentUser();
	const [searchText, setSearchText] = useState('');
	const [showResults, setShowResults] = useState(false);
	const [permissionGroup, setPermissionGroup] = useState('users');
	const {grantUserPermission} = useGrantUserPermission();
	const {grantRolePermission} = useGrantRolePermission();
	const {revokeUserPermission} = useRevokeUserPermission();
	const {revokeRolePermission} = useRevokeRolePermission();
	const {searchUsers, users} = useSearchUsers();
	const {searchRoles, roles} = useSearchRoles();
	const [permissionAssigneeId, setPermissionAssigneeId] = useState(null);
	const [selectedPermission, setSelectedPermission] = useState(null);

	const hideDropdown = (event) => {
		if (!event.target.matches('.searchResult') && !event.target.matches('.ant-input') && !event.target.matches('.ant-list-item-content')) {
			setShowResults(false);
		}
	};

	useEffect(() => {
		window.addEventListener('mousedown', hideDropdown);
		return () => {
			window.removeEventListener('mousedown', hideDropdown);
		}
	});

	const updateAssigneeId = async () => {
		if(permissionGroup === 'users'){
			for(let user of users){
				if(user.username === searchText){
					await setPermissionAssigneeId(user._id);
					return;
				}
			}
		}
		else {
			for(let role of roles){
				if(role.name === searchText){
					await setPermissionAssigneeId(role._id);
					return;
				}
			}
		}
		await setPermissionAssigneeId(null);
	};

	useEffect(() => {
		(async () => {
			await updateAssigneeId();
		})();

	}, [users, roles, permissionGroup]);

	useEffect(() => {
		(async () => {
			if(permissionGroup === 'users'){
				await searchUsers(searchText);
			}
			else {
				await searchRoles(searchText);
			}
		})();
	}, [searchText]);

	useEffect(() => {
		(async () => {
			await setSearchText('');
		})();
	}, [permissionGroup]);

	let permissions = [];
	let subject = null;
	let subjectType = null;
	if(currentWiki){
		permissions = WIKI_PERMISSIONS;
		subject = currentWiki;
		subjectType = WIKI_PAGE;
	} else if(currentWorld){
		permissions = WORLD_PERMISSIONS;
		subject = currentWorld;
		subjectType = WORLD;
	} else {
		return <>Unknown Subject Type</>;
	}

	if(currentWorldLoading || currentWikiLoading){
		return <></>;
	}

	let userPermissions = [];
	for(let user of currentWorld.usersWithPermissions){
		for(let permission of user.permissions){
			if(permission.subject._id === subject._id){
				userPermissions.push({user: user, permission: permission});
			}
		}
	}

	let rolePermissions = [];
	for(let role of currentWorld.roles){
		for(let permission of role.permissions){
			if(permission.subject._id === subject._id){
				rolePermissions.push({role: role, permission: permission});
			}
		}
	}

	return <>
		<Row>
			<Col span={4}></Col>
			<Col span={16} style={{textAlign: 'center'}}>
				<Radio.Group onChange={async (e) => { await setPermissionGroup(e.target.value)}} defaultValue="users">
					<Radio.Button value="users">Users</Radio.Button>
					<Radio.Button value="roles">Roles</Radio.Button>
				</Radio.Group>
			</Col>
			<Col span={4}></Col>
		</Row>
		<Row className='margin-md-top'>
			<Col span={24}>
				<Tabs defaultActiveKey="1" tabPosition='left' style={{ height: '100%'}} onChange={async (tab) => { await setSelectedPermission(tab)}}>
					{permissions.map(permission =>
						<Tabs.TabPane
							tab={permission}
							key={permission}
						>
							<List
								bordered
								dataSource={permissionGroup === 'users' ?
									userPermissions.filter(
										rolePermission => rolePermission.permission.permission === permission
									).map(
										userPermission => userPermission.user
									).filter(
										(user, currentIndex, self) => self.findIndex(otherUser => otherUser._id === user._id) === currentIndex)
									:
									rolePermissions.filter(
										rolePermission => rolePermission.permission.permission === permission
									).map(
										rolePermission => rolePermission.role
									).filter(
										(role, currentIndex, self) => self.findIndex(otherRole => otherRole._id === role._id) === currentIndex)
								}
								locale={{emptyText: <div>No Users</div>}}
								renderItem={(item) => {
									if(permissionGroup === 'users'){
										return (
											<List.Item key={permission._id + '.' + item._id}>
												{item.username}
												<Button className='margin-md-left' type='primary' danger='true' onClick={async () => {
													await revokeUserPermission(item._id, permission._id);
													await refetch();
												}}>
													<Icon type='delete' theme='outlined'/>
												</Button>
											</List.Item>
										);
									}
									else{
										return (
											<List.Item key={permission._id + '.' + item._id}>
												{item.name}
												<Button className='margin-md-left' type='primary' danger='true' onClick={async () => {
													await revokeRolePermission(item._id, permission._id);
													await refetch();
												}}>
													<Icon type='delete' theme='outlined'/>
												</Button>
											</List.Item>
										);

									}
								}}
							/>
						</Tabs.TabPane>
					)}
				</Tabs>
			</Col>
		</Row>

		<Row className='margin-md-top'>
			<Col span={20}>
				<Input.Search
					placeholder="input search text"
					onChange={async (event) => {
						await setSearchText(event.target.value);
						await setShowResults(true);
					}}
					onSearch={() => {}}
					onClick={async () => {await setShowResults(true);}}
					value={searchText}
					style={{width: '80%', position: 'absolute', right: '0px'}}
					type='text'
				/>
			</Col>
			<Col span={4}>
				<Button disabled={permissionAssigneeId === null} className='margin-md-left' onClick={async () => {
					let permission = selectedPermission;
					if(!permission){
						permission = permissions[0];
					}
					if(permissionGroup === 'users'){
						await grantUserPermission(permissionAssigneeId, permission, subject._id, subjectType);
						await refetch();
					}
					else{
						await grantRolePermission(permissionAssigneeId, permission, subject._id, subjectType);
						await refetch();
					}
				}}>Add {permissionGroup === 'users' ? 'user' : 'role'}</Button>
			</Col>
		</Row>
		<Row className='margin-md-top'>
			<Col span={4}></Col>
			<Col span={16} style={{display: showResults ? null : 'none'}}>
				<div
					style={{position: 'relative', width: '100%', zIndex: 2}}
					className='searchResult'
				>
					<List
						bordered
						className='search-results shadow-sm'
						style={{position: 'absolute', width: 'inherit'}}
						dataSource={permissionGroup === 'users' ? users : roles}
						locale={{emptyText: <div>No results :(</div>}}
						renderItem={item => (
							<a href='#' onClick={() => {
							}}>
								<List.Item
									className='searchResult'
									onClick={async () => {
										await setSearchText(item.name || item.username);
										await setShowResults(false);
									}}
								>
									<div className='searchResult'>
										{item.name || item.username}
									</div>
								</List.Item>
							</a>
						)}
					>
					</List>
				</div>
			</Col>
			<Col span={4}></Col>
		</Row>
	</>;
};