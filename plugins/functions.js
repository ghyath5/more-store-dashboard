import Cookies from 'js-cookie';
export default ({ app, req, res }, inject) => {
	inject('GET_COOKIE', cname => {
		if (process.browser) {
			return Cookies.get(cname);
		}
		if (req && req.headers && req.headers.cookie) {
			let name = cname + '=';
			let decodedCookie = decodeURIComponent(req.headers.cookie);
			let ca = decodedCookie.split(';');
			for (let i = 0; i < ca.length; i++) {
				let c = ca[i];
				while (c.charAt(0) == ' ') {
					c = c.substring(1);
				}
				if (c.indexOf(name) == 0) {
					return c.substring(name.length, c.length);
				}
			}
			return false;
		}
	});
	inject('SET_COOKIE', (cname, cvalue, exdays) => {
		Cookies.set(cname, cvalue, {
			expires: exdays * 24 * 60 * 60 * 1000,
		});
	});
	inject('REMOVE_COOKIE', cname => {
		Cookies.remove(cname);
	});
};
