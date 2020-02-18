import bcrypt from "bcrypt";
import {ACCESS_TOKEN_MAX_AGE, authenticated, createTokens, REFRESH_TOKEN_MAX_AGE} from "../../authentication-helpers";
import uuidv4 from "uuid/v4";
import {User} from '../../models/user';
export const SALT_ROUNDS = 10;

export const authenticationMutations = {
	login: async (parent, {username, password}, {res}) => {
		let user = await User.findOne({username}).populate('roles');
		if (user && bcrypt.compareSync(password, user.password)) {
			let tokens = await createTokens(user);
			// expires after 15 min
			res.cookie('accessToken', tokens.accessToken, {expires: new Date(Date.now() + ACCESS_TOKEN_MAX_AGE.ms)});
			// expires after 24 hours
			res.cookie('refreshToken', tokens.refreshToken, {expires: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE.ms)});
			return user;
		}
		throw Error('Login failure: username or password are incorrect');
	},
	logout: authenticated(async (parent, args, {res, currentUser}) => {
		res.clearCookie('accessToken');
		res.clearCookie('refreshToken');
		currentUser.version = uuidv4();
		await currentUser.save();
		return "success";

	}),
	register: async (parent, {email, username, password}, context) => {
		password = bcrypt.hashSync(password, SALT_ROUNDS);
		let existingUsers = await User.find({email});
		if (existingUsers.length > 1) {
			throw Error('Registration Error: Email already used')
		}
		existingUsers = await User.find({username});
		if (existingUsers.length > 1) {
			throw Error('Registration Error: Username already used')
		}

		return await User.create({email, username, password, roles: [], permissions: []});
	},

};