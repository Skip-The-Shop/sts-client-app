import React from 'react';
import ScrollContainer from '../../components/molecules/ScrollContainer';
import HeroImage from '../../components/atoms/HeroImage';
import TagDisplay from '../../components/molecules/TagDisplay';
import Title from '../../components/atoms/Title';
import Byline from '../../components/atoms/Byline';
import Divider from '../../components/atoms/Divider';
import RenderHtml from 'react-native-render-html';

const Blog = ({route}: any) => {
  const {item} = route.params;
  const {mainImage, tags, title, author, body} = item;
  console.log(body);
  return (
    <ScrollContainer>
      <TagDisplay tags={tags} />
      <Title title={title} />
      <Byline author={author} />
      <Divider />
      <RenderHtml source={{html: body}} />
    </ScrollContainer>
  );
};

export default Blog;
