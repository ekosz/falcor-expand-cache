import expand from '../src';
import expect from 'expect';

describe('falcor-expand-cache', () => {
  it('expands an empty cache into an empty object', () => {
    return expand({}).then(obj => expect(obj).toEqual({}));
  });

  it('transforms atoms into their value', () => {
    const cache = {
      foobar: {
        name: {
          $modelCreated: true,
          $size: 81,
          $type: 'atom',
          value: 'Foobar',
        },
      },
    };

    return expand(cache).then(obj => expect(obj).toEqual({
      foobar: { name: 'Foobar' },
    }));
  });

  it('sets atoms with no value to undefined', () => {
    const cache = {
      foobar: {
        name: {
          $size: 51,
          $type: 'atom',
        },
      },
    };

    return expand(cache).then(obj => expect(obj).toEqual({
      foobar: { name: undefined },
    }));
  });

  it('follows refs', () => {
    const cache = {
      foobar: { $type: 'ref', value: ['baz'] },
      baz: { $type: 'atom', value: 'abc' },
    };

    return expand(cache).then(obj => expect(obj).toEqual({
      foobar: 'abc',
      baz: 'abc',
    }));
  });

  it('can perform a big integration test', () => {
    return expand(require('./fixture.json')).then(obj => {
      console.log(JSON.stringifiy(obj, null, 2));
    });
  });
});
