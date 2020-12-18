function isFunction(value) {
	return typeof value === 'function';
}

function isObject(value) {
	return typeof value === 'object' && value !== null;
}

function isArray(value) {
	return Array.isArray(value);
}

function isString(value) {
	return typeof value === 'string';
}

function isBoolean(value) {
	return value === true || value === false;
}

function isUndefined(value) {
	return value === undefined;
}

function isUndefinedOrNull(value) {
	return value === undefined || value === null;
}

function isEmpty(value) {
	if (isObject(value)) {
		return Object.keys(value).length === 0;
	} else if (isArray(value)) {
		return value.length === 0;
	} else if (isString(value)) {
		return value.trim().length === 0;
	} else {
		return false;
	}
}

function isInteger(value) {
	return Number.isInteger(value);
}

function isPlainObject(value) {
	return Object.prototype.toString.call(value) === '[object Object]';
}

function prettyJoin(arr, glue = ',', lastGlue = 'and') {
	arr = [...arr];
	glue = `${glue} `;
	lastGlue = ` ${lastGlue} `;
	if (arr.length === 0) {
		return '';
	} else if (arr.length === 1) {
		return arr[0];
	} else if (arr.length === 2) {
		return arr.join(lastGlue);
	} else {
		const last = arr.pop();
		return [arr.join(glue), last].join(lastGlue);
	}	
}

module.exports = {
	isFunction,
	isObject,
	isArray,
	isString,
	isBoolean,
	isUndefined,
	isUndefinedOrNull,
	isEmpty,
	isInteger,
	isPlainObject,
	prettyJoin
};
