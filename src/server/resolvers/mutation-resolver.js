
import {authorizationMutations} from "./mutations/authorization-mutations";
import {authenticationMutations} from "./mutations/authentication-mutations";
import {folderMutations} from "./mutations/folder-mutations";
import {worldMutations} from "./mutations/world-mutations";
import {wikiMutations} from "./mutations/wiki-mutations";
import {userResolvers} from "./mutations/user-mutations";
import {imageMutations} from './mutations/image-mutations';
import {wikiPageMutations} from "./mutations/wiki-page-mutations";
import {serverMutations} from "./mutations/server-mutations";

export default {

	...authenticationMutations,
	...worldMutations,
	...authorizationMutations,
	...folderMutations,
	...wikiMutations,
	...userResolvers,
	...imageMutations,
	...wikiPageMutations,
	...serverMutations
}