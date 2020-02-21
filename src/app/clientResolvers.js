
export const clientResolvers = {
	Mutation: {
		setLoginModalVisibility: (_root, {visibility}, {client, cache}) => {
			cache.writeData({data: {loginModalVisibility: visibility}});
			return visibility;
		},
		setRegisterModalVisibility: (_root, {visibility}, {client, cache}) => {
			cache.writeData({data: {registerModalVisibility: visibility}});
			return visibility;
		},
		setCreateWorldModalVisibility: (_root, {visibility}, {client, cache}) => {
			cache.writeData({data: {createWorldModalVisibility: visibility}});
			return visibility;
		},
		setSelectWorldModalVisibility: (_root, {visibility}, {client, cache}) => {
			cache.writeData({data: {selectWorldModalVisibility: visibility}});
			return visibility;
		},
		setEditPinModalVisibility: (_root, {visibility}, {client, cache}) => {
			cache.writeData({data: {editPinModalVisibility: visibility}});
			return visibility;
		},
		setPinBeingEdited: (_, {pinId}, {client, cache}) => {
			cache.writeData({data: {pinBeingEdited: pinId}});
			return pinId;
		}
	},
};