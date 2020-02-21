import gql from "graphql-tag";

export const typeDefs = gql`

    type Query {
        currentUser: User
        
        """Search for a world by id or name."""
        world(worldId: ID, name: String): World
        """Get all worlds"""
        worlds(page: Int): WorldsPaginatedResult
        
        """Search for a wiki page using a phrase"""
        searchWikiPages(phrase: String!, worldId: ID!): [WikiPage!]!
        """Search for a wiki by id"""
        wiki(wikiId: ID!): WikiPage
        
        usersWithPermissions(permissions: [PermissionParam!]!): [User!]!
        rolesWithPermissions(permissions: [PermissionParam!]!): [Role!]!
    }
  
    type Mutation{
        login(username: String!, password:  String!): User!
        logout: String!
        register(email: String!, username: String!, password: String!): User!
        setCurrentWorld(worldId: ID!): User!
        
        createWorld(name: String!, public: Boolean!): World!
        
        createRole(name: String!, worldId: ID!): Role!
        setRolePermissions(roleId: ID!, permissions: [PermissionParam!]!): Role!
        
        """ Directly assign a permission to a user """
        giveUserPermission(userId: ID!, requestedPermission: PermissionParam!): PermissionAssignment!
        """ Revoke a directly assigned permission from a user """        
        revokeUserPermission(userId: ID!, permission: String!, subjectId: ID): PermissionAssignment!
        
        createFolder(name: String!, parentFolderId: ID!): World!
        renameFolder(folderId: ID!, name: String!): WikiFolder!
        deleteFolder(folderId: ID!): World!
        
        """ Creates a generic wiki page """
        createWiki(name: String!, folderId: ID!): World!
        
        """ Deletes any wiki page of any type (Ex: Person, Place, ... ) """
        deleteWiki(wikiId: ID!): World!
        
        """ Updates any wiki page of any type (Ex: Person, Place, ... ) """
        updateWiki(wikiId: ID!, name: String, content: Upload, coverImageId: ID, type: String): WikiPage!
        updatePlace(placeId: ID!, mapImageId: ID): Place!
        
        createImage(file: Upload!, worldId: ID!, chunkify: Boolean): Image!
        
        createPin(mapId: ID!, x: Float!, y: Float!, wikiId: ID): Pin!
        updatePin(pinId: ID!, pageId: ID): Pin!
        deletePin(pinId: ID!): Pin!
        
    }
  
    type User {
        _id: ID!
        username: String!
        email: String!
        currentWorld: World
        roles: [Role!]!
        permissions: [PermissionAssignment!]!
    }
  
	type World {
		_id: ID!
		name: String!
		wikiPage: Place
		rootFolder: WikiFolder
		roles: [Role!]!
		pins: [Pin!]!
		folders: [WikiFolder!]!
		canWrite: Boolean!
	}
	
	type WorldsPaginatedResult {
        docs: [World!]!
        totalDocs: Int!
        limit: Int!
        page: Int!
        totalPages: Int!
        pagingCounter: Int!
        hasPrevPage: Boolean!
        hasNextPage: Boolean!
        prevPage: Int
        nextPage: Int
    }
	
	interface WikiPage {
		_id: ID!
		name: String!
		content: String
		world: World!
		coverImage: Image
		type: String!
		canWrite: Boolean!
	}
	
	type Article implements WikiPage {
		_id: ID!
		name: String!
		content: String
		world: World!
		coverImage: Image
		type: String!
		canWrite: Boolean!
	}
	
	type Place implements WikiPage {
		_id: ID!
		name: String!
		content: String
		world: World!
		coverImage: Image
		mapImage: Image
		type: String!
		canWrite: Boolean!
	}
	
	type Person implements WikiPage {
		_id: ID!
		name: String!
		content: String
		world: World!
		coverImage: Image
		type: String!
		canWrite: Boolean!
	}
	
	type WikiFolder {
		_id: ID!
		name: String!
		world: World!
		pages: [WikiPage!]!
		children: [WikiFolder!]!
		canWrite: Boolean!
	}
	
	type Image {
		_id: ID!
		world: World!
		height: Int!
		width: Int!
		chunkHeight: Int!
		chunkWidth: Int!
		chunks: [Chunk!]!
		icon: Image!
		canWrite: Boolean!
		name: String!
	}
	
	type Chunk {
		_id: ID!
		image: Image!
		x: Int!
		y: Int!
		width: Int!
		height: Int!
		fileId: ID!
	}
	
	type Role {
		_id: ID!
		name: String!
		permissions: [PermissionAssignment!]!
		world: World!
	}
	
	type PermissionAssignment {
		_id: ID!
		permission: String!
		subjectId: ID
	}
	
	type Pin {
		_id: ID!
		map: Place!
		x: Float!
		y: Float!
		page: WikiPage
		canWrite: Boolean!
	}
	
	input PermissionParam {
		permission: String!
		subjectId: ID
	}

`;