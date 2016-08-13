import test from 'blue-tape';
import { join } from 'path';
import express from 'express';
import request from 'supertest-as-promised';
import { rewriteImageRequestMiddleware } from '../src/index';

const app = express();
const path = join(__dirname, '../assets');

app.use(rewriteImageRequestMiddleware(path));
app.use(express.static(path));

function validateSomeText(res, t) {
	t.equal(res.text, 'some text\n');
}

test('should not do anything when .jpg is met within querystring', t =>
	request(app)
		.get('/text.txt?test=.jpg')
		.expect(200)
		.then(res => validateSomeText(res, t))
		.catch(t.fail)
);

test('should not do anything when .jpg is met within requested file name', t =>
	request(app)
		.get('/text.jpg.txt')
		.expect(200)
		.then(res => validateSomeText(res, t))
		.catch(t.fail)
);

test('should not do anything when .jpg is met within querystring with Accept "image/webp"', t =>
	request(app)
		.get('/text.txt?extension=.jpg')
		.expect(200)
		.then(res => validateSomeText(res, t))
		.catch(t.fail)
);

test('should not do anything when .jpg is met within querystring with Accept "image/webp"', t =>
	request(app)
		.get('/text.jpg.txt?extension=.jpg')
		.expect(200)
		.then(res => validateSomeText(res, t))
		.catch(t.fail)
);

test('should replace png to webp if Accept "image/webp"', t =>
	request(app)
		.get('/fruits.png')
		.set('Accept', 'image/webp')
		.expect('Content-Type', 'image/webp')
		.then(t.pass)
		.catch(t.fail)
);

test('should replace jpg to jxr if Accept "image/jxr"', t =>
	request(app)
		.get('/fruits.jpg')
		.set('Accept', 'image/jxr')
		.expect('Content-Type', 'image/jxr')
		.then(t.pass)
		.catch(t.fail)
);

test('should not replace pngs for jxr even if Accept "image/jxr"', t =>
	request(app)
		.get('/fruits.png')
		.set('Accept', 'image/jxr')
		.expect('Content-Type', 'image/png')
		.then(t.pass)
		.catch(t.fail)
);

test('should not replace jpg to webp if Accept does not contain "image/webp"', t =>
	request(app)
		.get('/fruits.jpg')
		.set('Accept', '*/*')
		.expect('Content-Type', 'image/jpeg')
		.then(t.pass)
		.catch(t.fail)
);

test('should set vary:accept if content changed', t =>
	request(app)
		.get('/fruits.jpg')
		.set('Accept', 'image/webp')
		.expect('Vary', 'Accept')
		.then(t.pass)
		.catch(t.fail)
);

test('should not set vary:accept if content did not change', t =>
	request(app)
		.get('/fruits.png')
		.set('Accept', '*/*')
		.then(res => t.equal(typeof res.header.vary, 'undefined'))
		.catch(t.fail)
);

test('should not do anything if Accept is not present', t =>
	request(app)
		.get('/fruits.jpg')
		.expect('Content-Type', 'image/jpeg')
		.then(t.pass)
		.catch(t.fail)
);
