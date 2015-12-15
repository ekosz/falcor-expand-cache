export default function expandCache(cache) {
  function followPath(path) {
    return path.reduce((acc, part) => {
      if (acc && acc[part]) return acc[part];

      return undefined;
    }, cache);
  }

  function expandChild(child) {
    if (child.$type === 'atom') {
      return child.value;
    }

    if (child.$type === 'ref') {
      return expandNode(followPath(child.value)); // eslint-disable-line no-use-before-define
    }

    return undefined;
  }

  function expandNode(node) {
    if (!node) return node;
    if (node.$type) return expandChild(node);

    return Object.keys(node).reduce((acc, key) => {
      acc[key] = expandNode(node[key]);
      return acc;
    }, {});
  }

  return Promise.resolve(expandNode(cache));
}
