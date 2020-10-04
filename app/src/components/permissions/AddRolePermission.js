import React, {useState} from 'react';
import {Button, Select} from "antd";
import {
	ALL_WIKI_TYPES, ARTICLE,
	PERMISSION_CONTROLLED_TYPES,
	ROLE,
	WIKI_FOLDER,
	WORLD
} from "../../../../common/src/type-constants";
import {getPermissionsBySubjectType} from "../../../../common/src/permission-constants";
import {SelectRole} from "../select/SelectRole";
import useCurrentWorld from "../../hooks/world/useCurrentWorld";
import {SelectWiki} from "../select/SelectWiki";
import {useGrantRolePermission} from "../../hooks/authorization/useGrantRolePermission";
import Errors from "../Errors";
import {SelectFolder} from "../select/SelectFolder";

export const AddRolePermission = ({role}) => {

	const {currentWorld} = useCurrentWorld();
	const [permissionToAdd, setPermissionToAdd] = useState(null);
	const [permissionToAddSubjectType, setPermissionToAddSubjectType] = useState(null);
	const [permissionToAddSubject, setPermissionToAddSubject] = useState(null);
	const {grantRolePermission, errors} = useGrantRolePermission();

	let selectSubject = null;
	if(permissionToAddSubjectType === WORLD){
		selectSubject = <Select style={{width: '200px'}} onChange={setPermissionToAddSubject}>
			<Select.Option value={currentWorld._id}>{currentWorld.name}</Select.Option>
		</Select>;
	}
	else if(ALL_WIKI_TYPES.includes(permissionToAddSubjectType)){
		selectSubject = <SelectWiki types={[permissionToAddSubjectType]} onChange={async (wiki) => await setPermissionToAddSubject(wiki._id)}/>;
	}
	else if(permissionToAddSubjectType === ROLE){
		selectSubject = <SelectRole onChange={setPermissionToAddSubject}/>;
	}
	else if(permissionToAddSubjectType === WIKI_FOLDER){
		selectSubject = <SelectFolder onChange={setPermissionToAddSubject}/>;
	}

	let availablePermissions = getPermissionsBySubjectType(permissionToAddSubjectType);

	return <div className={'margin-lg-top'}>
		<h2>Add permission</h2>
		<Errors errors={errors}/>
		<div className={'margin-lg-top'}>
			<span className={'margin-lg-right'}>Subject Type:</span>
			<Select
				style={{width: '200px'}}
				onChange={async (value) => {
					await setPermissionToAdd(null);
					await setPermissionToAddSubjectType(value);
				}}
				value={permissionToAddSubjectType}
			>
				{[WORLD, ARTICLE, ROLE, WIKI_FOLDER].map(permission =>
					<Select.Option key={permission}>{permission}</Select.Option>)}
			</Select>
		</div>
		{permissionToAddSubjectType &&
			<div className={'margin-lg-top'}>
				<span className={'margin-lg-right'}>Permission:</span>
				<Select
					style={{width: '200px'}}
					onChange={async (value) => {
						await setPermissionToAddSubject(value);
						await setPermissionToAdd(value);
					}}
					value={permissionToAdd}
				>
					{availablePermissions.map(permission =>
						<Select.Option key={permission}>{permission}</Select.Option>)}
				</Select>
			</div>
		}
		{permissionToAdd &&
			<div className={'margin-lg-top'}>
				<span className={'margin-lg-right'}>Subject:</span> {selectSubject}
			</div>
		}
		{permissionToAddSubject &&
			<div className={'margin-lg-top'}>
				<Button
					type={'primary'}
					onClick={async () => await grantRolePermission(role._id, permissionToAdd, permissionToAddSubject, permissionToAddSubjectType)}
				>
					Add Permission
				</Button>
			</div>
		}
	</div>;
};