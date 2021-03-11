import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {appIdentifier, baseUrl} from '../utils/Variables';

// general function for fetching (options default value is empty object)
const doFetch = async (url, options = {}) => {
  const response = await fetch(url, options);
  const json = await response.json();
  if (json.error) {
    throw new Error('doFetch1' + json.message + ': ' + json.error);
  } else if (!response.ok) {
    throw new Error('doFetch failed');
  } else {
    return json;
  }
};

const useLoadMedia = (
  myFilesOnly, userId, searchOnly, inputs, myFavouritesOnly) => {
  const [mediaArray, setMediaArray] = useState([]);
  const {update} = useContext(MainContext);
  const {getFavourites} = useFavourite();

  const loadMedia = async () => {
    try {
      const listJson = await doFetch(baseUrl + 'tags/' + appIdentifier);
      let media = await Promise.all(
        listJson.map(async (item) => {
          const fileJson = await doFetch(baseUrl + 'media/' + item.file_id);
          return fileJson;
        }),
      );
      if (myFilesOnly) {
        media = media.filter((item) => item.user_id === userId);
      }
      if (searchOnly) {
        media = media.filter(
          (item) => item.title.includes(inputs.title.toString()));
      }
      if (myFavouritesOnly) {
        const userToken = await AsyncStorage.getItem('userToken');
        let userFavouritesArray = await getFavourites(userToken, userId);
        media = media.filter(
          (item) => userFavouritesArray.includes(item.file_id));
      }
      console.log("something");
      setMediaArray(media.reverse());

    } catch (error) {
      console.error('loadMedia error', error.message);
    }
  };

  useEffect(() => {
    loadMedia();
  }, [update]);
  return {mediaArray, loadMedia};
};

const useLoadComments = (fileId) => {
  const [mediaArray, setMediaArray] = useState([]);
  const {update} = useContext(MainContext);
  const {getCommentsByFileId} = useComment();

  const loadFileComments = async () => {
    try {
      const commentsListByFileId = await getCommentsByFileId(fileId);
      setMediaArray(commentsListByFileId);

    } catch (error) {
      console.error('ApiHooks.js UseLoadComments loadFileComments error:',
        error.message);
    }

  };
  useEffect(() => {
    loadFileComments();
  }, [update]);
  return {mediaArray, loadFileComments};
};

const useLogin = () => {
  const postLogin = async (userCredentials) => {
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(userCredentials),
    };
    try {
      console.log('useLogin postLogin options:', options);
      // console.log('user credentials', userCredentials);
      const userData = await doFetch(baseUrl + 'login', options);
      return userData;
    } catch (error) {
      throw new Error('postLogin error: ' + error.message);
    }
  };

  return {postLogin};
};

const useUser = () => {
  const postRegister = async (inputs) => {
    console.log('trying to create user', inputs);
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    };
    try {
      const json = await doFetch(baseUrl + 'users', fetchOptions);
      console.log('register resp', json);
      return json;
    } catch (e) {
      throw new Error(e.message);
    }
  };

  const checkToken = async (token) => {
    try {
      const options = {
        method: 'GET',
        headers: {'x-access-token': token},
      };
      const userData = await doFetch(baseUrl + 'users/user', options);
      return userData;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const getUser = async (id, token) => {
    try {
      const options = {
        method: 'GET',
        headers: {'x-access-token': token},
      };
      const userData = await doFetch(baseUrl + 'users/' + id, options);
      return userData;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const checkIsUserAvailable = async (username) => {
    try {
      const result = await doFetch(baseUrl + 'users/username/' + username);
      return result.available;
    } catch (error) {
      throw new Error('apihooks checkIsUserAvailable', error.message);
    }
  };

  return {postRegister, checkToken, checkIsUserAvailable, getUser};
};

const useTag = () => {
  const getFilesByTag = async (tag) => {
    try {
      const tagList = await doFetch(baseUrl + 'tags/' + tag);
      return tagList;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  const postTag = async (tag, token) => {
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
      body: JSON.stringify(tag),
    };
    try {
      const result = await doFetch(baseUrl + 'tags', options);
      return result;
    } catch (error) {
      throw new Error('postTag error: ' + error.message);
    }
  };

  return {getFilesByTag, postTag};
};

const useMedia = () => {
  const {postRating, deleteRating} = useRating();
  const upload = async (fd, rating, token) => {
    const options = {
      method: 'POST',
      headers: {'x-access-token': token},
      data: fd,
      url: baseUrl + 'media',
    };
    console.log('apihooks upload', options);
    try {

      const response = await axios(options);
      console.log('axios good');
      console.log('ApiHooks.js useMedia upload values: ' + 'fd.file_id: ' +
        response.file_id + ' rating: ' + rating + ' response: ' + response +
        ' response.data.file_id: ' + response.data.file_id);
      const addRating = await postRating(response.data.file_id, rating, token);
      return response.data;
    } catch (e) {
      throw new Error(e.message);
    }
  };

  const updateFile = async (fileId, fileInfoTitle, fileInfoDescription,fileInfoRating, token) => {
    const options = {
      method: 'PUT',
      headers: {
        'x-access-token': token,
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        title: fileInfoTitle,
        description: fileInfoDescription,
      }),
    };
    try {
      const resultDeleteRating = await deleteRating(fileId, token);
      const addNewRating = await postRating(fileId, fileInfoRating, token)
      const result = await doFetch(baseUrl + 'media/' + fileId, options);
      return result;
    } catch (error) {
      throw new Error('updateFile error: ' + error.message);
    }
  };

  const deleteFile = async (fileId, token) => {
    const options = {
      method: 'DELETE',
      headers: {'x-access-token': token},
    };
    try {
      const result = await doFetch(baseUrl + 'media/' + fileId, options);
      return result;
    } catch (error) {
      throw new Error('deleteFile error: ' + error.message);
    }
  };

  return {upload, updateFile, deleteFile};
};

const useFavourite = () => {

  const checkFavourite = async (fileId, userId) => {
    try {
      const result = await doFetch(baseUrl + 'favourites/file/' + fileId);
      const checkIsFavouriteArray = [];
      result.map((item) => {
        const singleFavouriteUserId = item.user_id;
        checkIsFavouriteArray.push(singleFavouriteUserId);
      });
      return checkIsFavouriteArray.includes(userId);

    } catch (error) {
      throw new Error(
        'Apihooks.js useFavourite checkFavourite error: ' + error.message);
    }
  };

  const getFavourites = async (token, userId) => {
    const options = {
      method: 'GET',
      headers: {
        'x-access-token': token,
        'Content-type': 'application/json',
      },
    };
    try {
      const result = await doFetch(baseUrl + 'favourites', options);
      const userFavouritesArray = [];
      result.map((item) => {
        if (item.user_id === userId) {
          userFavouritesArray.push(item.file_id);
        }
      });
      return userFavouritesArray;
    } catch (error) {
      throw new Error(
        'Apihooks.js useFavourite getFavourites error: ' + error.message);
    }
  };

  const postFavourite = async (fileId, token) => {
    const options = {
      method: 'POST',
      headers: {
        'x-access-token': token,
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        file_id: fileId,
      }),
    };
    try {
      const result = await doFetch(baseUrl + 'favourites', options);
      return result;
    } catch (error) {
      throw new Error(
        'Apihooks.js useFavourite postFavourite error: ' + error.message);
    }
  };

  const deleteFavourite = async (fileId, token) => {
    const options = {
      method: 'DELETE',
      headers: {
        'x-access-token': token,
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        file_id: fileId,
      }),
    };
    try {
      const result = await doFetch(baseUrl + 'favourites/file/' + fileId,
        options);
      return result;
    } catch (error) {
      throw new Error(
        'Apihooks.js useFavourite postFavourite error: ' + error.message);
    }
  };
  return {postFavourite, deleteFavourite, checkFavourite, getFavourites};
};

const useComment = () => {

  const postComment = async (fileId, inputs, token) => {
    const options = {
      method: 'POST',
      headers: {
        'x-access-token': token,
        'Content-type': 'application/json',
      },
      body: JSON.stringify({file_id: fileId, comment: inputs.comment}),
    };
    try {
      console.log('Apihooks.js useComment postComment data:',
        JSON.stringify({file_id: fileId, comment: inputs.comment}));
      const result = await doFetch(baseUrl + 'comments', options);
      return result;
    } catch (error) {
      throw new Error(
        'Apihooks.js useComment postComment error: ' + error.message);
    }
  };

  const deleteComment = async (commentId, token) => {
    const options = {
      method: 'DELETE',
      headers: {
        'x-access-token': token,
        'Content-type': 'application/json',
      },
    };
    try {
      const result = await doFetch(baseUrl + 'comments/' + commentId, options);
      return result;
    } catch (error) {
      throw new Error(
        'Apihooks.js useComment deleteComment error: ' + error.message);
    }
  };

  const getCommentsByFileId = async (fileId) => {
    try {
      const result = await doFetch(baseUrl + 'comments/file/' + fileId);
      return result;
    } catch (error) {
      throw new Error(
        'Apihooks.js useComment getCommentsByFileId error: ' + error.message);
    }
  };

  return {postComment, deleteComment, getCommentsByFileId};
};

const useRating = () => {
  const postRating = async (fileId, rating, token) => {
    const options = {
      method: 'POST',
      headers: {
        'x-access-token': token,
        'Content-type': 'application/json',
      },
      body: JSON.stringify({file_id: fileId, rating: rating}),
    };
    try {
      console.log(
        'Apihooks.js useRating postRating values: ' + 'fileId: ' + fileId +
        ' rating: ' + rating + ' token: ' + token);
      console.log('Apihooks.js useRating postRating data:',
        JSON.stringify({file_id: fileId, rating: rating}));
      const result = await doFetch(baseUrl + 'ratings', options);
      return result;
    } catch (error) {
      throw new Error(
        'Apihooks.js useRating postRating error: ' + error.message);
    }
  };

  const deleteRating = async (fileId, token) => {
    const options = {
      method: 'DELETE',
      headers: {
        'x-access-token': token,
        'Content-type': 'application/json',
      },
    };
    try {
      console.log(
        'Apihooks.js useRating deleteRating values: ' + 'fileId: ' + fileId + ' token: ' + token);
      const result = await doFetch(baseUrl + 'ratings/file/' + fileId, options);
      return result;
    } catch (error) {
      throw new Error(
        'Apihooks.js useRating deleteRating error: ' + error.message);
    }
  };

  const requestRatingByFileId = async (fileId) => {
    try {
      const result = await doFetch(baseUrl + 'ratings/file/' + fileId);
      console.log('Apihooks.js useRating getRatingByFileId result[0]:',
        result[0]);
      if (result[0] !== undefined) {
        return result[0];
      } else {
        return result;
      }
      // return result;

    } catch (error) {
      throw new Error(
        'Apihooks.js useRating getRatingByFileId error: ' + error.message);
    }
  };

  return {postRating, deleteRating, requestRatingByFileId};
};

const useAvatar = () => {
  const updateAvatar = async (fd, token) => {
    const options = {
      method: 'POST',
      headers: {'x-access-token': token},
      'Content-type': 'application/json',
      data: fd,
      url: baseUrl + 'media',
    };
    console.log('apihooks upload', options);
    try {

      const response = await axios(options);
      console.log('axios good');
      return response.data;
    } catch (e) {
      throw new Error(e.message);
    }
  };


  const deleteAvatar = async (fileId, token) => {
    const options = {
      method: 'DELETE',
      headers: {
        'x-access-token': token,
        'Content-type': 'application/json',
      },
    };
    try {
      const result = await doFetch(baseUrl + 'media/' + fileId, options);
      return result;
    } catch (error) {
      throw new Error(
        'Apihooks.js useAvatar deleteAvatar error: ' + error.message);
    }
  };

  return {updateAvatar, deleteAvatar};
};

export {
  useLoadMedia,
  useLogin,
  useUser,
  useTag,
  useMedia,
  useFavourite,
  useComment,
  useLoadComments,
  useRating,
  useAvatar,
};
