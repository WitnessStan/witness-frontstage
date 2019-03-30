import axios from 'axios';

export default {
	namespaced: true,
	state: {
		currentUser: {
			getUserName() {
				return localStorage.getItem("currentUserName");
			},
			getUserToken() {
				return localStorage.getItem("currentUserAccessToken")
			},
			getUserRefreshToken() {
				return localStorage.getItem("currentUserRefreshToken")
			}
		}
	},
	mutations: {
		setUser(state,{userName,userAccessToken,userRefreshToken}) {
			localStorage.setItem("currentUserName",userName);
			localStorage.setItem("currentUserAccessToken",userAccessToken);
			localStorage.setItem("currentUserRefreshToken",userRefreshToken);
		},
		clearUser(state) {
			localStorage.clear();
		}
	},
	actions: {
		login(context,{userName,userPasword,router}) {
			axios({
				method: 'post',
				url: '/oauth/token',
				params: {
					"username" : userName,
					"password" : userPasword,
					"grant_type" : "password",
					"scope" : "all"
				},
				auth: {
					username: 'client',
					password: 'secret'
				}
			}).then((response) => {
				context.commit('clearUser');
				context.commit('setUser',{"userName":userName,"userAccessToken":response.data.access_token,"userRefreshToken":response.data.refresh_token});
				axios.defaults.headers.common['Authorization'] = 'bearer ' + localStorage.getItem("currentUserAccessToken");
				router.push({ path: '/backstage/base/home' });
				context.commit('setSignFalse',null,{root: true});
			}).catch((error) => {
				context.commit('setSignTrue',null,{root: true});
			})
		},
		loginToFront(context,{userName,userPasword,router}) {
			axios({
				method: 'post',
				url: '/oauth/token',
				params: {
					"username" : userName,
					"password" : userPasword,
					"grant_type" : "password",
					"scope" : "all"
				},
				auth: {
					username: 'client',
					password: 'secret'
				}
			}).then((response) => {
				context.commit('clearUser');
				context.commit('setUser',{"userName":userName,"userAccessToken":response.data.access_token,"userRefreshToken":response.data.refresh_token});
				axios.defaults.headers.common['Authorization'] = 'bearer ' + localStorage.getItem("currentUserAccessToken");
				router.push({ path: '/' });
				context.commit('setSignFalse',null,{root: true});
			}).catch((error) => {
				context.commit('setSignTrue',null,{root: true});
			})
		},
		logout(context,{router}) {
			router.push({ path: '/backstage' });
			context.commit('clearUser');
		}
	}
}