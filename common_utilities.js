
function isWildcardMatch(str, rule) {
  return new RegExp("^" + rule.replace("*", ".*") + "$").test(str);
}

module.exports = {
	isWildcardMatch: isWildcardMatch
};