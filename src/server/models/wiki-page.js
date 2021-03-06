import mongoose from 'mongoose';
import mongooseAutopopulate from "mongoose-autopopulate";
import mongoosePaginate from 'mongoose-paginate-v2'
import {WIKI_READ, WIKI_READ_ALL, WIKI_RW, WIKI_RW_ALL} from "../../permission-constants";
import {userHasPermission} from "../authorization-helpers";
import {GridFSBucket} from "mongodb";
import {IMAGE, WIKI_PAGE, WORLD} from "../../type-constants";

const Schema = mongoose.Schema;

const wikiPageSchema = new Schema({
	name: {
		type: String,
		required: [true, 'name field required']
	},
	world: {
		type: mongoose.Schema.ObjectId,
		required: [true, 'world field required'],
		ref: WORLD
	},
	coverImage: {
		type: mongoose.Schema.ObjectId,
		ref: IMAGE,
		autopopulate: true
	},
	contentId: {
		type: mongoose.Schema.ObjectId,
	},
	content: {
		type: String,
		get: async function () {
			const gfs = new GridFSBucket(mongoose.connection.db);
			const file = await gfs.find({_id: this.contentId}).next();
			if(file){
				const stream = gfs.openDownloadStream(file._id);
				const chunks = [];
				await new Promise((resolve, reject) => {
					stream.on('data', (data) => {
						chunks.push(data);
					});
					stream.on('err', (err) => {
						reject(err);
					});
					stream.on('end', () => {
						resolve();
					});
				});
				return Buffer.concat(chunks).toString('utf8');
			}
			return null;
		}
	},
	type: {type: String, default: null},
});

wikiPageSchema.methods.userCanWrite = async function(user){
	return await userHasPermission(user, WIKI_RW, this._id) ||
		await userHasPermission(user, WIKI_RW_ALL, this.world);
};

wikiPageSchema.methods.userCanRead = async function(user){
	return await userHasPermission(user, WIKI_READ, this._id) ||
	await userHasPermission(user, WIKI_READ_ALL, this.world) || await this.userCanWrite(user);
};

// @TODO add post remove hook to delete cover image

wikiPageSchema.plugin(mongooseAutopopulate);
wikiPageSchema.plugin(mongoosePaginate);

export const WikiPage = mongoose.model(WIKI_PAGE, wikiPageSchema);
