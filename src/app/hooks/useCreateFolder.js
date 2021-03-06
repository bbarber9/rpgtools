import gql from "graphql-tag";
import {useMutation} from "@apollo/react-hooks";
import {CURRENT_WORLD_FOLDERS} from "./useCurrentWorld";

const CREATE_FOLDER = gql`
	mutation createFolder($parentFolderId: ID!, $name: String!){
		createFolder(parentFolderId: $parentFolderId, name: $name){
			_id
			folders{
				${CURRENT_WORLD_FOLDERS}
			}
		}
	}
`;

export default () => {
	const [createFolder, {loading, error, data}] = useMutation(CREATE_FOLDER);
	return {
		createFolder: async (parentFolderId, name) => {
			await createFolder({variables: {parentFolderId, name}});
		},
		loading,
		errors: error ? error.graphQLErrors.map(error => error.message) : [],
		world: data ? data.createFolder : null
	}
}