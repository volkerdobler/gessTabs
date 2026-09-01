import { expect } from 'chai';
import { LRUCache } from '../src/util/lru';

describe('LRUCache', () => {
  it('evicts the least recently used entry once maxSize is exceeded', () => {
    const evicted: Array<{ key: string; reason: string }> = [];
    const cache = new LRUCache<string, number>(2, {
      onEvict: (key, _value, reason) => evicted.push({ key, reason }),
    });

    cache.set('a', 1);
    cache.set('b', 2);
    cache.get('a'); // touch 'a' so 'b' becomes least recently used
    cache.set('c', 3); // should evict 'b', not 'a'

    expect(cache.has('a')).to.equal(true);
    expect(cache.has('b')).to.equal(false);
    expect(cache.has('c')).to.equal(true);
    expect(evicted).to.deep.equal([{ key: 'b', reason: 'size' }]);
  });

  it('expires entries older than ttlMs and reports the eviction reason', async () => {
    const evicted: Array<{ key: string; reason: string }> = [];
    const cache = new LRUCache<string, number>(10, {
      ttlMs: 10,
      onEvict: (key, _value, reason) => evicted.push({ key, reason }),
    });

    cache.set('a', 1);
    expect(cache.get('a')).to.equal(1);

    await new Promise((resolve) => {
      setTimeout(resolve, 20);
    });

    expect(cache.get('a')).to.equal(undefined);
    expect(evicted).to.deep.equal([{ key: 'a', reason: 'expired' }]);
  });

  it('delete() removes an entry and reports the eviction reason', () => {
    const evicted: Array<{ key: string; reason: string }> = [];
    const cache = new LRUCache<string, number>(10, {
      onEvict: (key, _value, reason) => evicted.push({ key, reason }),
    });

    cache.set('a', 1);
    expect(cache.delete('a')).to.equal(true);
    expect(cache.has('a')).to.equal(false);
    expect(evicted).to.deep.equal([{ key: 'a', reason: 'deleted' }]);

    expect(cache.delete('missing')).to.equal(false);
  });

  it('clear() empties the cache without calling onEvict', () => {
    const evicted: unknown[] = [];
    const cache = new LRUCache<string, number>(10, {
      onEvict: (key, value, reason) => evicted.push({ key, value, reason }),
    });

    cache.set('a', 1);
    cache.set('b', 2);
    cache.clear();

    expect(cache.size).to.equal(0);
    expect(evicted).to.deep.equal([]);
  });
});
