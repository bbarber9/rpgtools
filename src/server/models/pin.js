import mongoose from 'mongoose';
import {Place} from './place';
import {WikiPage} from "./wiki-page";

const Schema = mongoose.Schema;

const pinSchema = Schema({
	x: {
		type: Number,
		required: [true, 'x position required']
	},
	y: {
		type: Number,
		required: [true, 'y position required']
	},
	map: {
		type: mongoose.Schema.ObjectId,
		ref: 'Place'
	},
	page: {
		type: mongoose.Schema.ObjectId,
		ref: 'WikiPage'
	}
});

pinSchema.methods.userCanRead = async function(user){
	const map = await Place.findById(this.map);
	const page = await WikiPage.findById(this.page);
	return await map.userCanRead(user) && await page.userCanRead(user);
};

pinSchema.methods.userCanWrite = async function(user){
	const map = await Place.findById(this.map);
	const page = await WikiPage.findById(this.page);
	return await map.userCanWrite(user) && await page.userCanWrite(user);
};

export const Pin = mongoose.model('Pin', pinSchema);
