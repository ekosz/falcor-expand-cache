import expand from '../src';
import expect from 'expect';

describe('falcor-expand-cache', () => {
  it('expands an empty cache into an empty object', () => {
    expect(expand({}).anything).toEqual(undefined);
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

    expect(expand(cache).foobar.name).toEqual('Foobar');
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

    expect(expand(cache).foobar.name).toEqual(undefined);
  });

  it('follows refs', () => {
    const cache = {
      foobar: { $type: 'ref', value: ['baz'] },
      baz: { $type: 'atom', value: 'abc' },
    };

    const expanded = expand(cache);

    expect(expanded.baz).toEqual('abc');
    expect(expanded.foobar).toEqual('abc');
  });

  it('transforms errors correctly', () => {
    const cache = {
      foobar: { $type: 'error', value: 'Something went wrong' },
    };

    expect(expand(cache).foobar).toBeA(Error);
  });

  it('memoizes objects', () => {
    const cache = {
      very: {
        deeply: {
          nested: {
            thing: {
              $type: 'atom',
              value: 'foobar',
            },
          },
        },
      },
    };

    const expanded = expand(cache);

    expect(expanded.very).toBe(expanded.very);
    expect(expanded.very.deeply).toBe(expanded.very.deeply);
    expect(expanded.very.deeply.nested).toBe(expanded.very.deeply.nested);
    expect(expanded.very.deeply.nested.thing).toBe(expanded.very.deeply.nested.thing);
  });

  it('can perform a big integration test', () => {
    const expanded = expand(require('./fixture.json'));

    expect(expanded.my.activeGoals[0].name).toEqual('Add 2 additional payment methods');
    expect(expanded.my.company.name).toEqual('Pied Piper');
  });

  it('can expand a simple object', () => {
    const expanded = expand(require('./simple_object.json'));
    const product = expanded.productsById['id-string-1234'];

    expect(product.id).toEqual('id-string-1234');
    expect(product.name).toEqual('Sample Product Name');
    expect(product.image).toEqual('http://zpalexander.com/wp-content/uploads/2014/12/bomb-omb.jpg');
    expect(product.slug).toEqual('sample-product-name');
    expect(product.upc).toEqual('123409876');
  });
});
