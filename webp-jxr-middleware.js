import { parse } from 'url';
import { join } from 'path';
import { stat } from 'fs';
import * as vary from 'vary';


function rewriteImageRequestMiddleware(dirname) {
	const webpExtensions = ['jpg', 'png', 'jpeg'];
	const jpgXRExtensions = ['jpg', 'jpeg'];

	return function rewriteImageRequest(req, res, next) {
		const method = req.method.toUpperCase();

		if (method !== 'GET' && method !== 'HEAD') {
			next();
			return;
		}
		const { pathname } = parse(req.url);
		const extension = (pathname.match(/\.[a-z]{3,4}$/i) || [])[0];
		const acceptWebpHeader = (req.headers.accept || '').indexOf('image/webp');
		const acceptJPGXrHeader = (req.headers.accept || '').indexOf('image/jxr');
		let updatedPath = pathname;

		if (acceptWebpHeader && webpExtensions.includes(extension)) {
			updatedPath = pathname.replace(/\.[a-z]{3,4}$/i, '.webp');
		} else if (acceptJPGXrHeader && jpgXRExtensions.includes(extension)) {
			updatedPath = pathname.replace(/\.[a-z]{3,4}$/i, '.jxr');
		} else {
			next();
			return;
		}

		const filePath = join(dirname, updatedPath);

		stat(filePath, (err, stats) => {
			if (err) {
				next();
			} else if (stats.isFile()) {
				req.url = req.url.replace(pathname, updatedPath);
				vary(res, 'Accept');
				next();
			} else {
				next();
			}
		});
	}
}

module.exports = rewriteImageRequestMiddleware;
