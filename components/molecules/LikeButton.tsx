import React, {useState} from 'react';
import {TouchableOpacity, Image} from 'react-native';
import UserService from '../../services/UserService';
import favorite from '../../images/favorite.png';
import favoriteselected from '../../images/favoriteselected.png';

const LikeButton = () => {
  const userService = new UserService();
  const [liked, setLiked] = useState(false);

  const likeOrUnlikePost = () => {
    setLiked(!liked);
    if (liked) {
      userService.favouritePost();
    } else {
      userService.unFavouritePost();
    }
  };

  return (
    <TouchableOpacity
      onPress={likeOrUnlikePost}
      style={{
        height: 40,
        width: 40,
        borderRadius: 20,
        backgroundColor: '#DDD',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image
        style={{width: 23, height: 21}}
        source={liked ? favoriteselected : favorite}
      />
    </TouchableOpacity>
  );
};

export default LikeButton;
