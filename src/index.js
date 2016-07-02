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
    if (!data) return undefined;
    if (typeof data !== 'object' && typeof data !== 'function') return data;
    if (data.$type) return expandChild(data);
    const node = {};
    const nodeCache = {};

    Object.keys(data).forEach(key => {
      Object.defineProperty(node, key, {
        enumerable: true,
        get: () => {
          if (key in nodeCache) {
            return nodeCache[key];
          }

          nodeCache[key] = expandChild(data[key]);
          return nodeCache[key];
        },
      });
    });

    return node;
  }

  return createNode(cache);
}
