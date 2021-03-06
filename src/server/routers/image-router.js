import express from 'express';
import {Chunk} from '../models/chunk.js'
import {GridFSBucket} from "mongodb";
import mongodb from "mongodb";
import mongoose from 'mongoose';

let ImageRouter = express.Router();

ImageRouter.get('/:id', (req, res, next) => {

	const gfs = new GridFSBucket(mongoose.connection.db);
	const id = new mongodb.ObjectID(req.params.id);
	let results = gfs.find({_id: id}).next( (err, file) => {
		if(err){
			return res.status(500).send();
		}
		if(file === null ){
			return res.status(404).send();
		}
		const readStream = gfs.openDownloadStream(file._id);
		res.set('Content-Type', file.contentType);
		return readStream.pipe(res);
	});
});

export {ImageRouter};