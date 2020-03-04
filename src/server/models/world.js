import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-aggregate-paginate-v2'
import mongooseAutopopulate from "mongoose-autopopulate";
import {userHasPermission} from "../authorization-helpers";
import {ROLE_ADMIN, WORLD_READ} from "../../permission-constants";
import {Pin} from './pin.js';
import {WORLD_OWNER} from "../../role-constants";
const Schema = mongoose.Schema;

const worldSchema = new Schema({
	name: {
		type: String,
		required: [true, 'name field required']
	},
	wikiPage: {
		type: mongoose.Schema.ObjectId,
		ref: 'WikiPage',
		autopopulate: true
	},
	rootFolder: {
		type: mongoose.Schema.ObjectId,
		ref: 'WikiFolder',
		autopopulate: true
	},
	roles: [{
		type: mongoose.Schema.ObjectId,
		ref: 'Role',
		autopopulate: true
	}],
	pins: [{
		type: mongoose.Schema.ObjectId,
		ref: 'Pin',
		autopopulate: true
	}]
});

worldSchema.methods.userCanRead = async function(user){
	return await userHasPermission(user, WORLD_READ, this._id);
};

// basically if the user can give out permissions defined in WORLD_PERMISSIONS and change the world name
worldSchema.methods.userCanWrite = async function(user){
	for(let role of user.roles){
		if(role.name === WORLD_OWNER){
			return true;
		}
	}
	return false;
};

worldSchema.plugin(mongooseAutopopulate);

worldSchema.plugin(mongoosePaginate);

export const World = mongoose.model('World', worldSchema);
