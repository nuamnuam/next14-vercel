const isHTML = RegExp.prototype.test.bind(/(<([^>]+)>)/i);

export default isHTML;
