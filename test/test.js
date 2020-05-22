const firebase = require('@firebase/testing');
const fs = require('fs');

/*
 * ============
 *    Setup
 * ============
 */
const projectId = 'lecoinduprof-v2-dev';
const firebasePort = require('../firebase.json').emulators.firestore.port;
const port = firebasePort /** Exists? */ ? firebasePort : 8080;
const coverageUrl = `http://localhost:${port}/emulator/v1/projects/${projectId}:ruleCoverage.html`;

const rules = fs.readFileSync('firestore.rules', 'utf8');

/**
 * Creates a new app with authentication data matching the input.
 *
 * @param {object} auth the object to use for authentication (typically {uid: some-uid})
 * @return {object} the app.
 */
function authedApp(auth) {
  return firebase.initializeTestApp({ projectId, auth }).firestore();
}

/*
 * ============
 *    Fixtures
 * ============
 */
const user1 = {
  displayName: 'Test',
  bio: 'This is a test bio',
  formatted_address: 'Testour, Tunisie',
  coordinates: new firebase.firestore.GeoPoint(36.54990000000001, 9.442266399999994),
  geohash: 'aaaaaa',
  hasPicture: false,
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  modifiedAt: firebase.firestore.FieldValue.serverTimestamp()
};

const box1 = {
  name: 'Test',
  owner: 'xyz',
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  modifiedAt: firebase.firestore.FieldValue.serverTimestamp(),
  formatted_address: 'Testour, Tunisie',
  coordinates: new firebase.firestore.GeoPoint(36.54990000000001, 9.442266399999994),
  geohash: 'aaaaaa'
};

const item1 = {
  name: 'Test',
  owner: 'xyz',
  box: 'abc',
  description: 'Test description',
  category: 1,
  isShared: true,
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  modifiedAt: firebase.firestore.FieldValue.serverTimestamp(),
  formatted_address: 'Testour, Tunisie',
  coordinates: new firebase.firestore.GeoPoint(36.54990000000001, 9.442266399999994),
  geohash: 'aaaaaa',
  canGive: true,
  canLend: true,
  canExchange: true,
  canSend: true,
  hasPicture: false
};

const chat1 = {
  participants: ['xyz', 'abc'],
  item: 'pqr',
  lastMessage: 'last message',
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  modifiedAt: firebase.firestore.FieldValue.serverTimestamp()
};

/*
 * ============
 *  Test Cases
 * ============
 */
beforeEach(async () => {
  // Clear the database between tests
  await firebase.clearFirestoreData({ projectId });
});

before(async () => {
  await firebase.loadFirestoreRules({ projectId, rules });
});

after(async () => {
  await Promise.all(firebase.apps().map(app => app.delete()));
  console.log(`View rule coverage information at ${coverageUrl}\n`);
});

describe('LeCoinDuProf', () => {
  /**
   * ALL /*
   */
  it('/* should use a white list', async () => {
    const db = authedApp(null);
    const collection = db.collection('i_dont_exist');
    await firebase.assertFails(collection.get());
  });

  /**
   * READ /users/{userId}
   */
  it('/users/{userId} accepts unauthentified reading', async () => {
    const db = authedApp(null);
    const profile = db.collection('users').doc('abcd');
    await firebase.assertSucceeds(profile.get());
  });

  /**
   * CREATE /users/{userId}
   */
  it('/users/{userId} accepts creating fully validated data', async () => {
    const db = authedApp({ uid: 'xyz' });
    const profile = db.collection('users').doc('xyz');
    await firebase.assertSucceeds(profile.set(user1));
  });

  it("/users/{userId} rejects creating someone else's profile", async () => {
    const db = authedApp({ uid: 'i_am_a_hacker' });
    const profile = db.collection('users').doc('xyz');
    await firebase.assertFails(profile.set(user1));
  });

  it("/users/{userId} rejects creating unauthentified user's profile", async () => {
    const db = authedApp(null);
    const profile = db.collection('users').doc('xyz');
    await firebase.assertFails(profile.set(user1));
  });

  it('/users/{userId} rejects creating incomplete user profile', async () => {
    const db = authedApp({ uid: 'xyz' });
    const profile = db.collection('users').doc('xyz');
    // displayName
    const user1a = Object.assign({}, user1);
    delete user1a.displayName;
    await firebase.assertFails(profile.set(user1a));
    // formatted_address
    const user1b = Object.assign({}, user1);
    delete user1b.formatted_address;
    await firebase.assertFails(profile.set(user1b));
    // coordinates
    const user1c = Object.assign({}, user1);
    delete user1c.coordinates;
    await firebase.assertFails(profile.set(user1c));
    // hasPicture
    const user1d = Object.assign({}, user1);
    delete user1d.hasPicture;
    await firebase.assertFails(profile.set(user1d));
    // createdAt
    const user1e = Object.assign({}, user1);
    delete user1e.createdAt;
    await firebase.assertFails(profile.set(user1e));
    // modifiedAt
    const user1f = Object.assign({}, user1);
    delete user1f.modifiedAt;
    await firebase.assertFails(profile.set(user1f));
    // modifiedAt
    const user1g = Object.assign({}, user1);
    delete user1g.bio;
    await firebase.assertFails(profile.set(user1g));
    // geohash
    const user1h = Object.assign({}, user1);
    delete user1h.geohash;
    await firebase.assertFails(profile.set(user1h));
  });

  it('/users/{userId} rejects creating spoofed profile', async () => {
    const db = authedApp({ uid: 'xyz' });
    const profile = db.collection('users').doc('xyz');
    // More data than expected
    const spoofedUser = Object.assign({}, user1);
    spoofedUser['foo'] = 'bar';
    await firebase.assertFails(profile.set(spoofedUser));
    // Different data from expected
    const spoofedUser2 = Object.assign({}, user1);
    delete spoofedUser2.displayName;
    spoofedUser2['foo'] = 'bar';
    await firebase.assertFails(profile.set(spoofedUser2));
  });

  /**
   * UPDATE /users/{userId}
   */
  it('/users/{userId} accepts updating fully validated data', async () => {
    const db = authedApp({ uid: 'xyz' });
    const profile = db.collection('users').doc('xyz');
    await profile.set(user1);

    const updateUser = Object.assign({}, user1);
    delete updateUser.createdAt;
    await firebase.assertSucceeds(profile.update(updateUser));
  });

  it("/users/{userId} rejects updating someone else's profile", async () => {
    const db = authedApp({ uid: 'xyz' });
    const profile = db.collection('users').doc('xyz');
    await profile.set(user1);

    const db2 = authedApp({ uid: 'i_am_a_hacker' });
    const profile2 = db2.collection('users').doc('xyz');
    const updateUser = Object.assign({}, user1);
    delete updateUser.createdAt;
    await firebase.assertFails(profile2.update(updateUser));
  });

  it("/users/{userId} rejects updating unauthentified user's profile", async () => {
    const db = authedApp({ uid: 'xyz' });
    const profile = db.collection('users').doc('xyz');
    await profile.set(user1);

    const db2 = authedApp(null);
    const profile2 = db2.collection('users').doc('xyz');
    await firebase.assertFails(profile2.update(user1));
  });

  it('/users/{userId} rejects updating spoofed profile', async () => {
    const db = authedApp({ uid: 'xyz' });
    const profile = db.collection('users').doc('xyz');
    await profile.set(user1);

    const db2 = authedApp({ uid: 'xyz' });
    const profile2 = db2.collection('users').doc('xyz');
    // More data than expected
    const spoofedUser = Object.assign({}, user1);
    spoofedUser['foo'] = 'bar';
    await firebase.assertFails(profile2.update(spoofedUser));
    // Different data from expected
    const spoofedUser2 = Object.assign({}, user1);
    delete spoofedUser2.displayName;
    spoofedUser2['foo'] = 'bar';
    await firebase.assertFails(profile2.update(spoofedUser2));
  });

  /**
   * LIST /boxes
   */
  // Can't be tested yet

  /**
   * CREATE /boxes/{boxId}
   */
  it('/boxes/{boxId} accepts creating fully validated data', async () => {
    const db = authedApp({ uid: 'xyz' });
    const item = db.collection('/boxes').doc('xyz');
    await firebase.assertSucceeds(item.set(box1));
  });

  it("/boxes/{boxId} rejects creating someone else's box", async () => {
    const db = authedApp({ uid: 'i_am_a_hacker' });
    const profile = db.collection('boxes').doc('xyz');
    await firebase.assertFails(profile.set(box1));
  });

  it("/boxes/{boxId} rejects creating unauthentified user's box", async () => {
    const db = authedApp(null);
    const profile = db.collection('box').doc('xyz');
    await firebase.assertFails(profile.set(user1));
  });

  it('/boxes/{boxId} rejects creating incomplete box', async () => {
    const db = authedApp({ uid: 'xyz' });
    const profile = db.collection('boxes').doc('xyz');
    // name
    const box1a = Object.assign({}, box1);
    delete box1a.name;
    await firebase.assertFails(profile.set(box1a));
    // formatted_address
    const box1b = Object.assign({}, box1);
    delete box1b.formatted_address;
    await firebase.assertFails(profile.set(box1b));
    // coordinates
    const box1c = Object.assign({}, box1);
    delete box1c.coordinates;
    await firebase.assertFails(profile.set(box1c));
    // owner
    const box1d = Object.assign({}, box1);
    delete box1d.owner;
    await firebase.assertFails(profile.set(box1d));
    // createdAt
    const box1e = Object.assign({}, box1);
    delete box1e.createdAt;
    await firebase.assertFails(profile.set(box1e));
    // modifiedAt
    const box1f = Object.assign({}, box1);
    delete box1f.modifiedAt;
    await firebase.assertFails(profile.set(box1f));
    // geohash
    const box1g = Object.assign({}, box1);
    delete box1g.geohash;
    await firebase.assertFails(profile.set(box1g));
  });

  it('/boxes/{boxId} rejects creating spoofed box', async () => {
    const db = authedApp({ uid: 'xyz' });
    const profile = db.collection('boxes').doc('xyz');
    // More data than expected
    const spoofedBox = Object.assign({}, box1);
    spoofedBox['foo'] = 'bar';
    await firebase.assertFails(profile.set(spoofedBox));
    // Different data from expected
    const spoofedBox2 = Object.assign({}, box1);
    delete spoofedBox2.name;
    spoofedBox2['foo'] = 'bar';
    await firebase.assertFails(profile.set(spoofedBox2));
  });

  /**
   * UPDATE /boxes/{boxId}
   */
  it('/boxes/{boxId} accepts updating fully validated data', async () => {
    const db = authedApp({ uid: 'xyz' });
    const profile = db.collection('boxes').doc('xyz');
    await profile.set(box1);

    const updateBox = Object.assign({}, box1);
    delete updateBox.createdAt;
    await firebase.assertSucceeds(profile.update(updateBox));
  });

  it("/boxes/{boxId} rejects updating someone else's box", async () => {
    const db = authedApp({ uid: 'xyz' });
    const box = db.collection('boxes').doc('xyz');
    await box.set(box1);

    const db2 = authedApp({ uid: 'i_am_a_hacker' });
    const box2 = db2.collection('boxes').doc('xyz');
    const updateBox = Object.assign({}, box1);
    delete updateBox.createdAt;
    await firebase.assertFails(box2.update(updateBox));
  });

  it("/boxes/{boxId} rejects updating unauthentified user's box", async () => {
    const db = authedApp({ uid: 'xyz' });
    const box = db.collection('boxes').doc('xyz');
    await box.set(box1);

    const db2 = authedApp(null);
    const box2 = db2.collection('boxes').doc('xyz');
    await firebase.assertFails(box2.update(box1));
  });

  it('/boxes/{boxId} rejects updating spoofed box', async () => {
    const db = authedApp({ uid: 'xyz' });
    const box = db.collection('boxes').doc('xyz');
    await box.set(box1);

    const db2 = authedApp({ uid: 'xyz' });
    const box2 = db2.collection('boxes').doc('xyz');
    // More data than expected
    const spoofedBox = Object.assign({}, box1);
    spoofedBox['foo'] = 'bar';
    await firebase.assertFails(box2.update(spoofedBox));
    // Different data from expected
    const spoofedBox2 = Object.assign({}, box1);
    delete spoofedBox2.name;
    spoofedBox2['foo'] = 'bar';
    await firebase.assertFails(box2.update(spoofedBox2));
  });

  /**
   * CREATE /items/{itemId}
   */
  it('/items/{itemId} accepts creating fully validated data', async () => {
    const db = authedApp({ uid: 'xyz' });
    const item = db.collection('/items').doc('xyz');
    await firebase.assertSucceeds(item.set(item1));
  });

  it("/items/{itemId} rejects creating someone else's item", async () => {
    const db = authedApp({ uid: 'i_am_a_hacker' });
    const profile = db.collection('items').doc('xyz');
    await firebase.assertFails(profile.set(item1));
  });

  it("/items/{itemId} rejects creating unauthentified user's item", async () => {
    const db = authedApp(null);
    const profile = db.collection('items').doc('xyz');
    await firebase.assertFails(profile.set(item1));
  });

  it('/items/{itemId} rejects creating incomplete item', async () => {
    const db = authedApp({ uid: 'xyz' });
    const profile = db.collection('items').doc('xyz');
    // name
    const item1a = Object.assign({}, item1);
    delete item1a.name;
    await firebase.assertFails(profile.set(item1a));
    // formatted_address
    const item1b = Object.assign({}, item1);
    delete item1b.formatted_address;
    await firebase.assertFails(profile.set(item1b));
    // coordinates
    const item1c = Object.assign({}, item1);
    delete item1c.coordinates;
    await firebase.assertFails(profile.set(item1c));
    // owner
    const item1d = Object.assign({}, item1);
    delete item1d.owner;
    await firebase.assertFails(profile.set(item1d));
    // createdAt
    const item1e = Object.assign({}, item1);
    delete item1e.createdAt;
    await firebase.assertFails(profile.set(item1e));
    // modifiedAt
    const item1f = Object.assign({}, item1);
    delete item1f.modifiedAt;
    await firebase.assertFails(profile.set(item1f));
    // box
    const item1g = Object.assign({}, item1);
    delete item1g.box;
    await firebase.assertFails(profile.set(item1g));
    // description
    const item1h = Object.assign({}, item1);
    delete item1h.description;
    await firebase.assertFails(profile.set(item1h));
    // category
    const item1i = Object.assign({}, item1);
    delete item1i.category;
    await firebase.assertFails(profile.set(item1i));
    // isShared
    const item1j = Object.assign({}, item1);
    delete item1j.isShared;
    await firebase.assertFails(profile.set(item1j));
    // canGive
    const item1k = Object.assign({}, item1);
    delete item1k.canGive;
    await firebase.assertFails(profile.set(item1k));
    // canLEnd
    const item1l = Object.assign({}, item1);
    delete item1l.canLend;
    await firebase.assertFails(profile.set(item1l));
    // canExchange
    const item1m = Object.assign({}, item1);
    delete item1m.canExchange;
    await firebase.assertFails(profile.set(item1m));
    // canSend
    const item1n = Object.assign({}, item1);
    delete item1n.canSend;
    await firebase.assertFails(profile.set(item1n));
    // geohash
    const item1o = Object.assign({}, item1);
    delete item1o.geohash;
    await firebase.assertFails(profile.set(item1o));
  });

  it('/items/{itemId} rejects creating spoofed item', async () => {
    const db = authedApp({ uid: 'xyz' });
    const profile = db.collection('items').doc('xyz');
    // More data than expected
    const spoofedItem = Object.assign({}, item1);
    spoofedItem['foo'] = 'bar';
    await firebase.assertFails(profile.set(spoofedItem));
    // Different data from expected
    const spoofedItem2 = Object.assign({}, item1);
    delete spoofedItem2.name;
    spoofedItem2['foo'] = 'bar';
    await firebase.assertFails(profile.set(spoofedItem2));
  });

  /**
   * UPDATE /items/{itemId}
   */
  it('/items/{itemId} accepts updating fully validated data', async () => {
    const db = authedApp({ uid: 'xyz' });
    const item = db.collection('items').doc('xyz');
    await item.set(item1);

    const updateItem = Object.assign({}, item1);
    delete updateItem.createdAt;
    await firebase.assertSucceeds(item.update(updateItem));
  });

  it("/items/{itemId} rejects updating someone else's item", async () => {
    const db = authedApp({ uid: 'xyz' });
    const item = db.collection('items').doc('xyz');
    await item.set(item1);

    const db2 = authedApp({ uid: 'i_am_a_hacker' });
    const item2 = db2.collection('items').doc('xyz');
    const updateItem = Object.assign({}, item1);
    delete updateItem.createdAt;
    await firebase.assertFails(item2.update(updateItem));
  });

  /**
   * CREATE /chats/{chatId}
   */
  it('/chats/{chatId} accepts creating fully validated data', async () => {
    const db = authedApp({ uid: 'xyz' });
    const chats = db.collection('/chats').doc('xyz');
    await firebase.assertSucceeds(chats.set(chat1));
  });

  it('/chats/{chatId} rejects creating a chat when user is not a participant', async () => {
    const db = authedApp({ uid: 'i_am_a_hacker' });
    const chats = db.collection('/chats').doc('xyz');
    await firebase.assertFails(chats.set(chat1));
  });

  it('/chats/{chatId} rejects creating a chat by unauthenticated user', async () => {
    const db = authedApp(null);
    const chats = db.collection('/chats').doc('xyz');
    await firebase.assertFails(chats.set(chat1));
  });

  it('/chats/{chatId} rejects creating incomplete chat', async () => {
    const db = authedApp({ uid: 'xyz' });
    const chats = db.collection('/chats').doc('xyz');
    // participant
    const chat1a = Object.assign({}, chat1);
    delete chat1a.participants;
    await firebase.assertFails(chats.set(chat1a));
    // item
    const chat1b = Object.assign({}, chat1);
    delete chat1b.item;
    await firebase.assertFails(chats.set(chat1b));
    // lastMessage
    const chat1c = Object.assign({}, chat1);
    delete chat1c.lastMessage;
    await firebase.assertFails(chats.set(chat1c));
    // createdAt
    const chat1d = Object.assign({}, chat1);
    delete chat1d.createdAt;
    await firebase.assertFails(chats.set(chat1d));
    // modifiedAt
    const chat1e = Object.assign({}, chat1);
    delete chat1e.modifiedAt;
    await firebase.assertFails(chats.set(chat1e));
  });

  it('/chats/{chatId} rejects creating spoofed chat', async () => {
    const db = authedApp({ uid: 'xyz' });
    const profile = db.collection('/chats').doc('xyz');
    // More data than expected
    const spoofedChat = Object.assign({}, chat1);
    spoofedChat['foo'] = 'bar';
    await firebase.assertFails(profile.set(spoofedChat));
    // Different data from expected
    const spoofedChat2 = Object.assign({}, chat1);
    delete spoofedChat2.item;
    spoofedChat2['foo'] = 'bar';
    await firebase.assertFails(profile.set(spoofedChat2));
  });

  /**
   * GET /chats/{chatId}
   */
  it('/chats/{chatId} accepts reading by authorized user', async () => {
    const db = authedApp({ uid: 'xyz' });
    const chats = db.collection('/chats').doc('xyz');
    await chats.set(chat1);
    await firebase.assertSucceeds(chats.get());
  });

  it('/chats/{chatId} rejects reading a chat when user is not a participant', async () => {
    const db = authedApp({ uid: 'xyz' });
    const chats = db.collection('/chats').doc('xyz');
    await chats.set(chat1);

    const db2 = authedApp({ uid: 'i_am_a_hacker' });
    const chats2 = db2.collection('/chats').doc('xyz');
    await firebase.assertFails(chats2.get());
  });

  it('/chats/{chatId} rejects reading a chat by unauthenticated user', async () => {
    const db = authedApp({ uid: 'xyz' });
    const chats = db.collection('/chats').doc('xyz');
    await chats.set(chat1);

    const db2 = authedApp(null);
    const chats2 = db2.collection('/chats').doc('xyz');
    await firebase.assertFails(chats2.get());
  });

  /**
   * UPDATE /chats/{chatId}
   */
  it("/chats/{chatId} rejects updating by chat's participant", async () => {
    const db = authedApp({ uid: 'xyz' });
    const chats = db.collection('/chats').doc('xyz');
    await chats.set(chat1);
    await firebase.assertFails(chats.update(chat1));
  });

  it('/chats/{chatId} rejects updating a chat when user is not a participant', async () => {
    const db = authedApp({ uid: 'xyz' });
    const chats = db.collection('/chats').doc('xyz');
    await chats.set(chat1);

    const db2 = authedApp({ uid: 'i_am_a_hacker' });
    const chats2 = db2.collection('/chats').doc('xyz');
    await firebase.assertFails(chats2.update(chat1));
  });

  it('/chats/{chatId} rejects updating a chat by unauthenticated user', async () => {
    const db = authedApp({ uid: 'xyz' });
    const chats = db.collection('/chats').doc('xyz');
    await chats.set(chat1);

    const db2 = authedApp(null);
    const chats2 = db2.collection('/chats').doc('xyz');
    await firebase.assertFails(chats2.update(chat1));
  });

  /**
   * DELETE /chats/{chatId}
   */
  it("/chats/{chatId} rejects deleting by chat's participant", async () => {
    const db = authedApp({ uid: 'xyz' });
    const chats = db.collection('/chats').doc('xyz');
    await chats.set(chat1);
    await firebase.assertFails(chats.delete());
  });

  it('/chats/{chatId} rejects deleting a chat when user is not a participant', async () => {
    const db = authedApp({ uid: 'xyz' });
    const chats = db.collection('/chats').doc('xyz');
    await chats.set(chat1);

    const db2 = authedApp({ uid: 'i_am_a_hacker' });
    const chats2 = db2.collection('/chats').doc('xyz');
    await firebase.assertFails(chats2.delete());
  });

  it('/chats/{chatId} rejects deleting a chat by unauthenticated user', async () => {
    const db = authedApp({ uid: 'xyz' });
    const chats = db.collection('/chats').doc('xyz');
    await chats.set(chat1);

    const db2 = authedApp(null);
    const chats2 = db2.collection('/chats').doc('xyz');
    await firebase.assertFails(chats2.delete());
  });
});
