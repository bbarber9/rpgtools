import QueryResolver from "./query-resolver";
import MutationResolver from "./mutation-resolver";
import {WikiFolder} from "../models/wiki-folder";
import {PermissionAssignment} from "../models/permission-assignement";
import {User} from "../models/user";
import {ROLE_ADD, WIKI_PERMISSIONS, WORLD_PERMISSIONS} from "../../permission-constants";
import {ALL_USERS, EVERYONE} from "../../role-constants";
import {userHasPermission} from "../authorization-helpers";

export const serverResolvers = {
	Query: QueryResolver,
	Mutation: MutationResolver,
	World: {
		roles: async (world, _, {currentUser}) => {
			let roles = [];
			for(let role of world.roles){
				if(await role.userCanRead(currentUser)){
					roles.push(role);
				}
			}
			return roles;
		},
		rootFolder: async (world, _, {currentUser}) => {
			if(await world.rootFolder.userCanRead(currentUser)){
				return world.rootFolder;
			}
			return null;
		},
		wikiPage: async (world, _, {currentUser}) => {
			if(await world.wikiPage.userCanRead(currentUser)){
				return world.wikiPage;
			}
			return null;
		},
		canWrite: async (world, _, {currentUser}) => {
			return await world.userCanWrite(currentUser);
		},
		pins: async (world, _, {currentUser}) => {
			const pins = [];
			for(let pin of world.pins){
				if(await pin.userCanRead(currentUser)){
					pins.push(pin);
				}
			}
			return pins;
		},
		folders: async (world, _, {currentUser}) => {
			const folders = [];
			const foundFolders = await WikiFolder.find({world: world._id}).populate("children pages");
			for(let folder of foundFolders){
				if(await folder.userCanRead(currentUser)){
					folder.pages = folder.pages.filter(async (page) => {
						return await page.userCanRead(currentUser)
					});
					folders.push(folder);
				}
			}
			return folders;
		},
		usersWithPermissions: async (world, _, {currentUser}) => {
			const allUsers = [];
			for(let permission of WORLD_PERMISSIONS){
				let assignment = await PermissionAssignment.findOne({permission: permission, subjectId: world._id});
				if(!assignment){
					assignment = await PermissionAssignment.create({permission: permission, subjectId: world._id});
				}
				if(!await assignment.userCanRead(currentUser)){
					continue;
				}
				const users = await User.find({permissions: assignment._id});
				allUsers.concat(users);
			}
			return allUsers;
		},
		canAddRoles: async (world, _, {currentUser}) => {
			return userHasPermission(currentUser, ROLE_ADD, world._id);
		}
	},
	PermissionControlled: {
		__resolveType: async (subject, {currentUser}, info) => {
			return subject.constructor.modelName;
		},
	},
	User: {
		email: async (user, _, {currentUser}) => {
			if(!user._id.equals(currentUser._id)){
				return '';
			}
			return user.email;
		},
		roles: async (user, _, {currentUser}) => {
			if(user._id.equals(currentUser._id)){
				return user.roles;
			}
			const roles = [];
			for(let role of user.roles){
				if(await role.userCanRead(currentUser)){
					roles.push(role)
				}
			}
			return roles;
		},
		permissions: async (user, _, {currentUser}) => {
			if(user._id.equals(currentUser._id)){
				return user.permissions;
			}
			const permissions = [];
			for(let permission of user.permissions){
				if(await permission.userCanRead(currentUser)){
					permissions.push(permission);
				}
			}
			return permissions;
		},
		currentWorld: async (user, _, {currentUser}) => {
			if(!user._id.equals(currentUser._id)){
				return null;
			}
			return user.currentWorld;
		}
	},
	Role: {
		permissions: async (role, _, {currentUser}) => {
			await role.populate('permissions');
			if(role.name === EVERYONE || role.name === ALL_USERS){
				return role.permissions;
			}
			const permissions = [];
			for(let permission of role.permissions){
				if(await permission.userCanRead(currentUser)){
					permissions.push(permission);
				}
			}
			return permissions;
		},
		canWrite: async (role, _, {currentUser}) => {
			return role.userCanWrite(currentUser);
		},
		members: async (role, _, {currentUser}) => {

			if(! await role.userCanWrite(currentUser)){
				return [];
			}
			return User.find({roles: role._id});

		},
	},
	WikiPage: {
		__resolveType: async (page, {currentUser}, info) => {
			return page.type;
		},
	},
	Article: {
		canWrite: async (page, _, {currentUser}) => {
			return await page.userCanWrite(currentUser);
		},
	},
	Person: {
		canWrite: async (person, _, {currentUser}) => {
			return await person.userCanWrite(currentUser);
		},
	},
	Place: {
		canWrite: async (place, _, {currentUser}) => {
			return await place.userCanWrite(currentUser);
		},
	},
	WikiFolder: {
		children: async (folder, _, {currentUser}) => {
			const children = [];
			await folder.populate('children').execPopulate();
			for(let child of folder.children){
				if(await child.userCanRead(currentUser)){
					children.push(child);
				}
			}
			return children;
		},
		pages: async (folder, _, {currentUser}) => {
			const pages = [];
			for(let page of folder.pages){
				if(await page.userCanRead(currentUser)){
					pages.push(page);
				}
			}
			return pages;
		},
		canWrite: async (folder, _, {currentUser}) => {
			return await folder.userCanWrite(currentUser);
		},
	},
	Image: {
		canWrite: async (image, _, {currentUser}) => {
			return await image.userCanWrite(currentUser);
		},
	},
	Pin: {
		canWrite: async (pin, _, {currentUser}) => {
			return await pin.userCanWrite(currentUser);
		}
	}
};