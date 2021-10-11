import React, {useEffect, useState} from 'react';
import {Text} from 'react-native';
import TagService from '../../services/TagService';
import {COLORS} from '../../constants';

const TagDisplay = ({tags}: any) => {
  const [parsedTags, setParsedTags] = useState([]);
  const tagService = new TagService();
  useEffect(async () => {
    tags.forEach(async (tag: any) => {
      const acc = [] as any;
      const parsedTag = await tagService.getTagByID(tag);
      const tagName = parsedTag.Item.tag;
      acc.push(tagName);
      setParsedTags(acc);
    });
  }, []);
  return (
    <>
      {parsedTags.map(el => (
        <Text style={{fontWeight: 'bold', color: COLORS.BLUE}}>{el}</Text>
      ))}
    </>
  );
};

export default TagDisplay;
