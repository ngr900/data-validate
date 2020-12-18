function isUndefinedOrNull(value) {
	return value === undefined || value === null;
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
	isUndefinedOrNull,
	prettyJoin,
};
