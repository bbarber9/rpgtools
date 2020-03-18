import { createTestClient } from 'apollo-server-testing';
import {ApolloServer} from "apollo-server-express";
import {serverResolvers} from "../../../../src/resolvers/server-resolvers";
import {typeDefs} from '../../../../src/gql-server-schema';
import {ANON_USERNAME} from "../../../../src/authentication-helpers";
import {User} from "../../../../src/models/user";
import gql from 'graphql-tag';

process.env.TEST_SUITE = 'authentication-mutations-test';

describe('authentication-mutations', () => {

	const server = new ApolloServer({
		typeDefs,
		resolvers: serverResolvers,
		context: () => {
			return {currentUser: new User({username: ANON_USERNAME}), res: {cookie: () => {}}};
		}
	});

	const { mutate } = createTestClient(server);

	const LOGIN_QUERY = gql`
			mutation login($username: String!, $password: String!){
		        login(username: $username, password: $password){
		            _id
		        }
		    }
		`;

	test('login', async () => {
		const result = await mutate({mutation: LOGIN_QUERY, variables: {username: 'tester', password: 'tester'}});
		expect(result).toMatchSnapshot({
			data: {
				login: {
					_id: expect.any(String)
				}
			}
		});
	});

	test('login bad password', async () => {
		const result = await mutate({mutation: LOGIN_QUERY, variables: {username: 'tester', password: 'asdf'}});
		expect(result).toMatchSnapshot();
	});

	test('login bad username', async () => {
		const result = await mutate({mutation: LOGIN_QUERY, variables: {username: 'tester', password: 'asdf'}});
		expect(result).toMatchSnapshot();
	});

	const REGISTER_MUTATION = gql`
	    mutation register($registerCode: String!, $email: String!, $username: String!, $password: String!){
	        register(registerCode: $registerCode, email: $email, username: $username, password: $password){
	            _id
	        }
	    }
	`;

	test('register good', async () => {
		const result = await mutate({mutation: REGISTER_MUTATION, variables: {registerCode: 'asdf', email: 'asdf@gmail.com', username: 'tester2', password: 'tester'}});
		expect(result).toMatchSnapshot({
			data: {
				register: {
					_id: expect.any(String)
				}
			}
		});
	});

	test('register bad code', async () => {
		const result = await mutate({mutation: REGISTER_MUTATION, variables: {registerCode: '1234', email: 'asdf@gmail.com', username: 'tester2', password: 'tester'}});
		expect(result).toMatchSnapshot();
	});

	test('register use code twice', async () => {
		await mutate({mutation: REGISTER_MUTATION, variables: {registerCode: 'asdf', email: 'asdf@gmail.com', username: 'tester2', password: 'tester'}});
		const result = await mutate({mutation: REGISTER_MUTATION, variables: {registerCode: 'asdf', email: 'asdf@gmail.com', username: 'tester2', password: 'tester'}});
		expect(result).toMatchSnapshot();
	});

	test('register use email twice', async () => {
		await mutate({mutation: REGISTER_MUTATION, variables: {registerCode: 'asdf', email: 'asdf@gmail.com', username: 'tester2', password: 'tester'}});
		const result = await mutate({mutation: REGISTER_MUTATION, variables: {registerCode: 'qwerty', email: 'asdf@gmail.com', username: 'tester3', password: 'tester'}});
		expect(result).toMatchSnapshot();
	});

	test('register use username twice', async () => {
		await mutate({mutation: REGISTER_MUTATION, variables: {registerCode: 'asdf', email: 'tester2@gmail.com', username: 'tester2', password: 'tester'}});
		const result = await mutate({mutation: REGISTER_MUTATION, variables: {registerCode: 'qwerty', email: 'tester3@gmail.com', username: 'tester2', password: 'tester'}});
		expect(result).toMatchSnapshot();
	});
});