export default function expandCache(cache) {
  function followPath(path) {
    return path.reduce((acc, part) => {
      if (acc && acc[part]) {
        return acc[part];
      }

      return undefined;
    }, cache);
  }

  function expandChild(child) {
    if (child.$type === 'atom') return child.value;
    if (child.$type === 'ref') return createNode(followPath(child.value));
    if (child.$type === 'error') return new Error(child.value);
    // Unknown Sentinel
    if (child.$type) return undefined;

    return createNode(child);
  }

  function createNode(data) {
    if (data.$type) return expandChild(data);
    const node = {};

    Object.keys(data).forEach(key => {
      Object.defineProperty(node, key, {
        get: () => expandChild(data[key]),
      });
    });

    return node;
  }

  return createNode(cache);
}
