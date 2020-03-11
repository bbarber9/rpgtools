import {useMutation} from "@apollo/react-hooks";
import gql from "graphql-tag";
import {CURRENT_WORLD_PERMISSIONS} from "./useCurrentWorld";

const REVOKE_ROLE_PERMISSION = gql`
	mutation revokeRolePermission($roleId: ID!, $permissionId: ID!){
		revokeRolePermission(roleId: $roleId, permissionId: $permissionId){
			_id
			${CURRENT_WORLD_PERMISSIONS}
		}
	}
`;

export const useRevokeRolePermission = () => {
	const [revokeRolePermission, {data, loading, error}] = useMutation(REVOKE_ROLE_PERMISSION);
	return {
		revokeRolePermission: async (roleId, permissionId) => {
			return await revokeRolePermission({variables: {roleId, permissionId}});
		},
		loading,
		subject: data ? data.revokeRolePermission : null,
		errors: error ? error.graphQLErrors.map(error => error.message) : []
	}
};