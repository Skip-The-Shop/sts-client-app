import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import RecipesService from '../../services/RecipesService';
import {COLORS} from '../../constants';
import Divider from '../../components/atoms/Divider';
import DifficultyIndicator from '../../components/atoms/DifficultyIndicator';
import HeroImage from '../../components/atoms/HeroImage';
import ScrollContainer from '../../components/molecules/ScrollContainer';
import Title from '../../components/atoms/Title';
import Byline from '../../components/atoms/Byline';
import DurationIndicator from '../../components/atoms/DurationIndicator';

const Exercise = ({route}: any) => {
  const recipeService = new RecipesService();
  const {item} = route.params;
  const [recipeType, setRecipeType] = useState('');
  const {
    mainImage,
    calories,
    carbs,
    fats,
    fibre,
    protein,
    title,
    difficulty,
    prepTime,
    mealTypes,
    ingredients,
    steps,
    author,
  } = item;

  const nutrients = [
    {
      label: 'Calories',
      value: calories,
    },
    {
      label: 'Protein',
      value: protein,
    },
    {
      label: 'Carbs',
      value: carbs,
    },
    {
      label: 'Fats',
      value: fats,
    },
    {
      label: 'Fibre',
      value: fibre,
    },
  ];

  useEffect(async () => {
    const recipeTypes = await recipeService.getMealTypeByID(mealTypes);
    const {type} = recipeTypes;
    setRecipeType(type);
  }, []);

  return (
    <ScrollContainer>
      <HeroImage mainImage={mainImage} />
      <View style={{padding: 12}}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.title}>{recipeType.toUpperCase()}</Text>
          <DifficultyIndicator difficulty={difficulty} />
          <DurationIndicator duration={prepTime} />
        </View>
        <Title title={title} />
        <Byline author={author} />
        <Divider />
        <View style={styles.nutrientsContainer}>
          {nutrients.map(el => (
            <View>
              <Text style={{textAlign: 'center'}}>{el.label}</Text>
              <Text style={styles.nutrients}>{el.value}</Text>
            </View>
          ))}
        </View>
        <Divider />
        <Text style={styles.listTitle}>Ingredients</Text>
        {ingredients.map((el: any) => (
          <View style={styles.list}>
            <Text style={{color: COLORS.BLUE}}>{'\u2022'}</Text>
            <Text style={styles.element}>{el}</Text>
          </View>
        ))}
        <Text style={styles.listTitle}>Instructions</Text>
        {steps.map((el: any, index: number) => (
          <View style={styles.list}>
            <Text style={styles.title}>{index + 1}</Text>
            <Text style={styles.element}>{el}</Text>
          </View>
        ))}
      </View>
    </ScrollContainer>
  );
};

const styles = StyleSheet.create({
  nutrientsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  nutrients: {
    textAlign: 'center',
    marginTop: 4,
    color: COLORS.BLUE,
    fontWeight: 'bold',
  },
  title: {
    fontWeight: 'bold',
    color: COLORS.BLUE,
  },
  listTitle: {
    marginTop: 16,
    fontWeight: 'bold',
    color: COLORS.BLUE,
  },
  list: {
    flexDirection: 'row',
    marginTop: 8,
  },
  element: {
    flex: 1,
    paddingLeft: 5,
  },
});

export default Exercise;
