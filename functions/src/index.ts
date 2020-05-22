import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { isUndefined } from 'util';

admin.initializeApp();

/**
 * Function : dump()
 * Arguments: The data - array,hash(associative array),object
 *    The level - OPTIONAL
 * Returns  : The textual representation of the array.
 * This function was inspired by the print_r function of PHP.
 * This will accept some data as the argument and return a
 * text that will be a more readable version of the
 * array/hash/object that is given.
 * Docs: http://www.openjs.com/scripts/others/dump_function_php_print_r.php
 */
function dump(arr: any, level: number = 0) {
  let dumped_text = '';

  // The padding given at the beginning of the line.
  let level_padding = '';
  for (let j = 0; j < level + 1; j++) {
    level_padding += '    ';
  }
  if (typeof arr === 'object') {
    // Array/Hashes/Objects
    for (const item in arr) {
      const value = arr[item];

      if (typeof value === 'object') {
        // If it is an array,
        dumped_text += level_padding + "'" + item + "' ...\n";
        dumped_text += dump(value, level + 1);
      } else {
        dumped_text += level_padding + "'" + item + '\' => "' + value + '"\n';
      }
    }
  } else {
    // Stings/Chars/Numbers etc.
    dumped_text = '===>' + arr + '<===(' + typeof arr + ')';
  }
  return dumped_text;
}

/**
 * When a message is sent, the chat's latest message is updated
 */
exports.updateChatOnNewMessage = functions.firestore
  .document('chats/{chatId}/messages/{messageId}')
  .onWrite((change, context) => {
    console.info(`Chat ${context.params.chatId} : updating chat...`);
    const newValue = change.after.data();
    return new Promise((resolve, reject) => {
      admin
        .firestore()
        .doc(`chats/${context.params.chatId}`)
        .update({
          lastMessage: !!newValue ? newValue.content : '',
          modifiedAt: !!newValue ? newValue.createdAt : admin.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
          console.info(`Chat ${context.params.chatId} : chat updated`);
          resolve();
        })
        .catch(error => {
          console.error(error);
          reject();
        });
    });
  });

/**
 * When a message is sent, a notification is sent over FCM
 */
exports.notifyOnNewMessage = functions.firestore
  .document('chats/{chatId}/messages/{messageId}')
  .onWrite((change, context) => {
    console.info(`Chat ${context.params.chatId} : notifying...`);
    const newValue = change.after.data();
    if (newValue === undefined) {
      return;
    }
    return new Promise((resolve, reject) => {
      // Who is dest ?
      admin
        .firestore()
        .doc(`chats/${context.params.chatId}`)
        .get()
        .then(chat => {
          if (chat === undefined) {
            console.log(`Chat ${context.params.chatId} is undefined`);
            reject();
            return;
          }
          const chatData = chat.data();
          if (chatData === undefined) {
            console.log(`Chat data ${context.params.chatId} is undefined`);
            reject();
            return;
          }
          const destId =
            chatData.participants[0] === newValue.author ? chatData.participants[1] : chatData.participants[0];
          // Retrieve dest tokens
          admin
            .firestore()
            .collection(`users/${destId}/tokens`)
            .get()
            .then(querySnapshot => {
              const tokens: string[] = [];
              querySnapshot.forEach(item => {
                tokens.push(item.data().token);
              });
              // Send notifications
              if (tokens.length === 0) {
                console.log(`Chat ${context.params.chatId} : no token found`);
                resolve();
                return;
              } else {
                // Fetch author details
                admin
                  .firestore()
                  .doc(`users/${newValue.author}`)
                  .get()
                  .then(user => {
                    const userData = user.data();
                    if (userData === undefined) {
                      console.log(`User ${newValue.author} is undefined`);
                      resolve();
                      return;
                    }
                    const payload = {
                      notification: {
                        title: userData.displayName,
                        body: newValue.content,
                        sound: 'default'
                      },
                      data: {
                        topic: 'chat',
                        id: chat.id
                      }
                    };
                    admin
                      .messaging()
                      .sendToDevice(tokens, payload)
                      .then(() => {
                        console.log(`Chat ${context.params.chatId} : ${tokens.length} notification(s) sent`);
                        resolve();
                        return;
                      })
                      .catch(error => {
                        console.log(error);
                      });
                  })
                  .catch(error => {
                    console.log(error);
                  });
              }
            })
            .catch(error => {
              console.log(error);
              reject();
            });
        })
        .catch(error => {
          console.log(error);
          reject();
        });
    });
  });

/**
 * When a box changes location, all contained items change location
 */
exports.moveItemsOnMovedBox = functions.firestore.document('boxes/{boxId}').onUpdate((change, context) => {
  console.info(`Box ${context.params.boxId} : updating box...`);
  const newValue = change.after.data();
  if (newValue === undefined) {
    console.log('newValue is undefined');
    return;
  }
  const previousValue = change.before.data();
  if (previousValue === undefined) {
    console.log('previous is undefined');
    return;
  }
  return new Promise((resolve, reject) => {
    if (newValue.coordinates === previousValue.coordinates) {
      console.info(`Box ${context.params.boxId} : no change required`);
      resolve();
    }
    admin
      .firestore()
      .collection('items')
      .where('box', '==', context.params.boxId)
      .get()
      .then(querySnapshot => {
        console.info(`Box ${context.params.boxId} : ${querySnapshot.size} item(s) to move...`);
        let updatedCounter = 0;
        querySnapshot.forEach(item => {
          admin
            .firestore()
            .doc(`items/${item.id}`)
            .update({
              formatted_address: newValue.formatted_address,
              coordinates: newValue.coordinates,
              geohash: newValue.geohash
            })
            .then(() => {
              updatedCounter++;
              console.info(`Box ${context.params.boxId} : moved ${item.id} - ${updatedCounter}/${querySnapshot.size}`);
            })
            .catch(error => {
              console.error(`Box ${context.params.boxId} : error`, error);
              reject();
            });
        });
        resolve();
      })
      .catch(error => {
        console.error(`Box ${context.params.boxId} : error`, error);
        reject();
      });
  });
});

/**
 * When a box is deleted, all contained items are deleted too
 */
exports.deleteItemsOnDeletedBox = functions.firestore.document('boxes/{boxId}').onDelete((snap, context) => {
  console.info(`Box ${context.params.boxId} : deleted...`);
  return new Promise((resolve, reject) => {
    admin
      .firestore()
      .collection('items')
      .where('box', '==', context.params.boxId)
      .get()
      .then(querySnapshot => {
        console.info(`Box ${context.params.boxId} : ${querySnapshot.size} item(s) to delete...`);
        let deletedCounter = 0;
        querySnapshot.forEach(item => {
          admin
            .firestore()
            .doc(`items/${item.id}`)
            .delete()
            .then(() => {
              deletedCounter++;
              console.info(
                `Box ${context.params.boxId} : deleted item ${item.id} - ${deletedCounter}/${querySnapshot.size}`
              );
            })
            .catch(error => {
              console.error(`Box ${context.params.boxId} : error`, error);
              reject();
            });
        });
        resolve();
      })
      .catch(error => {
        console.error(`Box ${context.params.boxId} : error`, error);
        reject();
      });
  });
});

/**
 * When an item is deleted, item picture and thumbnail are deleted
 */
exports.deletePicturesOnDeletedItem = functions.firestore.document('items/{itemId}').onDelete((snap, context) => {
  console.info(`Item ${context.params.itemId} : deleted...`);
  return new Promise((resolve, reject) => {
    const oldValue = snap.data();
    if (oldValue === undefined) {
      console.log('oldValue is undefined');
      return;
    }
    if (!!!oldValue.hasPicture) {
      console.info(`Item ${context.params.itemId} : no picture to delete`);
      resolve();
    } else {
      const bucket = admin.storage().bucket();
      const profilePath = `users/${oldValue.owner}/items/${context.params.itemId}/item`;
      const profile = bucket.file(profilePath);
      profile
        .delete()
        .then(() => {
          console.log(`Successfully deleted picture for item: ${context.params.itemId}`);
          const thumbnailPath = `users/${oldValue.owner}/items/${context.params.itemId}/thumbnail`;
          const thumbnail = bucket.file(thumbnailPath);
          thumbnail
            .delete()
            .then(() => {
              console.log(`Successfully deleted thumbnail for item: ${context.params.itemId}`);
              resolve();
            })
            .catch(err => {
              console.log(`Failed to remove ${context.params.itemId} thumbnail, error: ${err}`);
              reject();
            });
        })
        .catch(err => {
          console.log(`Failed to remove item ${context.params.itemId} picture, error: ${err}`);
          reject();
        });
    }
  });
});

/**
 * When a report is created, a mail is sent to moderators
 *
 * NOTE : this function assumes mail will be automatically sent by firestore's
 * extention Trigger Mail
 * See https://firebase.google.com/products/extensions/firestore-send-email
 */
exports.notifyOnNewReport = functions.firestore.document('reports/{reportId}').onCreate(async (snap, context) => {
  console.info(`Report ${context.params.reportId} created : notifying...`);
  return new Promise((resolve, reject) => {
    // Read report
    const report = snap.data();
    if (isUndefined(report)) {
      reject('Report not found');
      return;
    }

    // Build mail
    const subject = `Report for ${report.item}`;
    // Build mail content
    const html = `
          <h3>Report</h3>
          <p>${report.content}</p>
          <hr>
          <pre>${dump(report)}</pre>
        `;

    // Send mail to moderator
    console.log('Adding mail to queue...');
    admin
      .firestore()
      .collection('mail')
      .add({
        to: ['alan.crevon@gmail.com'],
        message: {
          subject,
          html
        }
      })
      .then(() => resolve('Mail sent'))
      .catch(error => reject(error));
  });
});
