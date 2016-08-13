import { parse } from 'url';
import { join } from 'path';
import { stat } from 'fs';
import vary from 'vary';

/**
 * Determines whether the specified accept-header accepts the target image extension
 *
 * @method isImageSupported
 * @param {String} [acceptHeader=''] - The HTTP accept header
 * @param {String} extension - The image extension to validate (e.g. webp / jxr)
 * @returns {Boolean} true if it supports the target extension, false otherwise
 * @private
 * @since 1.0.0
 */
function isImageSupported(acceptHeader = '', extension) {
	return acceptHeader.includes(`image/${extension}`);
}

/**
 * Determines whether the current request can be replaced with a .webp extension, both based on the
 * url and the browser supported types
 *
 * @method canRequestWebp
 * @param {String} acceptHeader - The HTTP accept header
 * @param {String} extension - the target url extension
 * @returns {Boolean} true if it can use .webp, false otherwise
 * @private
 * @since 1.0.0
 */
function canRequestWebp(acceptHeader, extension) {
	const webpExtensions = ['jpg', 'png', 'jpeg'];

	return webpExtensions.includes(extension) && isImageSupported(acceptHeader, 'webp');
}

/**
 * Determines whether the current request can be replaced with a .jxr extension, both based on the
 * url and the browser supported types
 *
 * @method canRequestJxr
 * @param {String} acceptHeader - The HTTP accept header
 * @param {String} extension - the target url extension
 * @returns {Boolean} true if it can use .jxr, false otherwise
 * @private
 * @since 1.0.0
 */
function canRequestJxr(acceptHeader, extension) {
	const jxrExtensions = ['jpg', 'jpeg'];

	return jxrExtensions.includes(extension) && isImageSupported(acceptHeader, 'jxr');
}

/**
 * Determines whether the request method is a valid for the image rewrite. Only GET and HEAD
 * are accepted.
 *
 * @method isAcceptedMethod
 * @param {String} method - The target request method
 * @returns {Boolean} true if it's a valid method, false otherwise
 * @private
 * @since 1.0.0
 */
function isAcceptedMethod(method) {
	method = method.toUpperCase();
	return method === 'GET' || method === 'HEAD';
}

/**
 * Determines whether the specified path is to a file or not
 *
 * @method isFile
 * @param {String} path - The absolute path to evaluate
 * @returns {Promise} a promise that resolves if the path exists and is a file and rejects otherwise
 * @private
 * @since 1.0.0
 */
function isFile(path) {
	return new Promise((resolve, reject) => {
		if (!path) {
			reject();
			return;
		}
		stat(path, (err, stats) => {
			if (!err && stats.isFile()) {
				resolve();
			} else {
				reject();
			}
		});
	});
}

/**
 * Updates `request.url` file extension to match `extension`. E.g. `/apples.jpg` to `/apples.webp`
 *
 * THIS METHOD MODIFIES ITS INPUT
 *
 * @method updateRequestUrl
 * @param {String} pathname - the target image path to modify
 * @param {String} dirname - The relative path to which evaluate `pathname` from
 * @param {String} extension - The image extension to set (e.g. webp / jxr)
 * @param {http.ClientRequest} request - The target request
 * @param {http.ServerResponse} response - The response object for the request
 * @param {Function} callback - the method to call on completion
 * @private
 * @since 1.0.0
 */
function updateRequestUrl(pathname, dirname, extension, request, response, callback) {
	const updatedPath = pathname.replace(/\.[a-z]{3,4}$/i, `.${extension}`);
	const filePath = join(dirname, updatedPath);

	isFile(filePath)
		.then(() => {
			request.url = request.url.replace(pathname, updatedPath);
			vary(response, 'Accept');
			response.set('Content-Type', `image/${extension}`);
		})
		.then(callback)
		.catch(callback);
}

/**
 * The middleware method to call to replace image urls to webp or jxr depending on browser support
 * and assuming availablity on the system
 *
 * @method rewriteImageRequestMiddleware
 * @param {String} dirname - The server path
 * @returns {Function} rewriteImageRequest - The method invoked for each individual request
 * @public
 * @since 1.0.0
 */
function rewriteImageRequestMiddleware(dirname) {
	return function rewriteImageRequest(request, response, next) {
		if (!isAcceptedMethod(request.method)) {
			next();
		} else {
			const { pathname } = parse(request.url);
			const extension = (pathname.match(/\.([a-z]{3,4})$/i) || [])[1];

			if (canRequestWebp(request.headers.accept, extension)) {
				updateRequestUrl(pathname, dirname, 'webp', request, response, next);
			} else if (canRequestJxr(request.headers.accept, extension)) {
				updateRequestUrl(pathname, dirname, 'jxr', request, response, next);
			} else {
				next();
			}
		}
	};
}

export default rewriteImageRequestMiddleware;
