const DEFAULT_IMAGE = require('../assets/tecnologia.png');

export function _parseItem(data = {}) {
  const {
    id = 1,
    images = {},
    offer,
    search,
    description = '',
    type = 'searching',
    urgency,
    follow = false,
    numberFollowers = 0,
    numberComments = 0,
    showSwapp,
    user,
    isNew,
    status
  } = data;

  console.log("images value::::", images)
  const imageKeys = Object.keys(images);
  const parsedImages = imageKeys.length > 0
    ? { uri: images[imageKeys[0]] }
    : DEFAULT_IMAGE;

    console.log("parsedImages DEFAULT_IMAGE:::::", DEFAULT_IMAGE)
  // const parsedImages = isNew
  //   ? images
  //   : imageKeys.length > 0
  //     ? { uri: images[imageKeys[0]] }
  //     : DEFAULT_IMAGE;

  return {
    id,
    images: parsedImages,
    type,
    offer: offer?.title ?? '',
    search: search?.title ?? '',
    description,
    urgency: urgency ?? 0,
    follow,
    numberFollowers,
    numberComments,
    showSwapp,
    user,
    placeToChange: "Manchester",//_parsePlaceToChange(data)
    status
  };
}

export function _parseItems(data = []) {
  return data.map(_parseItem);
}