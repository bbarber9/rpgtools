export const ARTICLE = 'Article';
export const PERSON = 'Person';
export const PLACE = 'Place';
export const IMAGE = 'Image';
export const CHUNK = 'Chunk';
export const GAME = 'Game';
export const PERMISSION_ASSIGNMENT = 'PermissionAssignment';
export const PIN = 'Pin';
export const ROLE = 'Role';
export const SERVER_CONFIG = 'ServerConfig';
export const USER = 'User';
export const WIKI_FOLDER = 'WikiFolder';
export const WIKI_PAGE = 'WikiPage';
export const WORLD = 'World';

export const ALL_WIKI_TYPES = [ARTICLE, PERSON, PLACE];
export const PERMISSION_CONTROLLED_TYPES = [...ALL_WIKI_TYPES, WORLD, ROLE, WIKI_FOLDER, GAME, PIN, SERVER_CONFIG];
