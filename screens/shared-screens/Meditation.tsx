import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, ImageBackground} from 'react-native';
import Byline from '../../components/atoms/Byline';
import Title from '../../components/atoms/Title';
import {Icon} from 'react-native-elements';
import TrackPlayer from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import med1 from '../../images/med1.jpg';
import med2 from '../../images/med2.jpg';
import med3 from '../../images/med3.jpg';
import med4 from '../../images/med4.jpg';
import med5 from '../../images/med5.jpg';
import med6 from '../../images/med6.jpg';
import med7 from '../../images/med7.jpg';
import opaqueBlack from '../../images/opaqueBlack.png';
import {COLORS} from '../../constants';

const Meditation = ({route}: any) => {
  const {item} = route.params;
  const [isPlaying, setIsPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [position, setPosition] = useState('0:00');
  const [background, setBackground] = useState('');
  const {author, duration, soundFile, title} = item;
  const url = `https://gfit-content.s3-accelerate.amazonaws.com/${soundFile}`;

  const getBackground = () => {
    const num = Math.floor(Math.random() * (7 - 1 + 1) + 1);
    var source;
    switch (num) {
      case 1:
        source = med1;
        break;
      case 2:
        source = med2;
        break;
      case 3:
        source = med3;
        break;
      case 4:
        source = med4;
        break;
      case 5:
        source = med5;
        break;
      case 6:
        source = med6;
        break;
      default:
        source = med7;
        break;
    }
    return source;
  };

  const handleControl = async () => {
    if (!started) {
      await TrackPlayer.setupPlayer({});
      var track = {
        url,
        duration:
          parseInt(duration.split(':')[0], 10) * 60 +
          parseInt(duration.split(':')[1], 10),
        id: '1',
        title,
        artist: author,
      };
      await TrackPlayer.add(track);
      TrackPlayer.play();
      setStarted(true);
      setIsPlaying(true);
    } else if (isPlaying) {
      TrackPlayer.pause();
      setIsPlaying(false);
    } else {
      TrackPlayer.play();
      setIsPlaying(true);
    }
  };

  const seek = (e) => {
    TrackPlayer.seekTo(e);
  };

  const getMax = () => {
    return (
      parseInt(duration.split(':')[0] * 60, 10) +
      parseInt(duration.split(':')[1], 10)
    );
  };

  useEffect(() => {
    if (started && isPlaying) {
      setInterval(() => {
        TrackPlayer.getPosition().then(r => {
          const time = r;
          var minutes = Math.floor(time / 60);
          var seconds = Math.floor(time - minutes * 60);
          if (seconds < 10) {
            seconds = `0${seconds}`;
          }
          setPosition(`${minutes}:${seconds}`);
        });
      }, 1);
    }
  }, [started, isPlaying]);

  useEffect(() => {
    setBackground(getBackground());
  }, []);

  return (
    <View>
      <ImageBackground
        source={background}
        resizeMode="cover"
        style={styles.background}>
        <ImageBackground
          source={opaqueBlack}
          resizeMode="cover"
          style={styles.background}>
          <View style={styles.titleContainer}>
            <Title style={styles.title} title={title} />
            <Byline
              fontSize={16}
              textAlign="center"
              author={author}
              color="white"
            />
          </View>
          <View style={styles.iconContainer}>
            <Icon
              onPress={handleControl}
              size={50}
              name={isPlaying ? 'pause' : 'play-arrow'}
            />
          </View>
          <View style={styles.progressContainer}>
            <Slider
              style={styles.progress}
              minimumValue={0}
              maximumValue={getMax()}
              maximumTrackTintColor="white"
              minimumTrackTintColor={COLORS.BLUE}
              thumbTintColor={COLORS.BLUE}
              onValueChange={seek}
            />
            <View style={styles.times}>
              <Text style={styles.position}>{position}</Text>
              <Text style={styles.duration}>{duration}</Text>
            </View>
          </View>
        </ImageBackground>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    marginTop: 100,
    textAlign: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    color: 'white',
    width: '100%',
  },
  iconContainer: {
    backgroundColor: '#F0F2F5',
    borderRadius: 500,
    width: 50,
    height: 50,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  progressContainer: {
    marginTop: 100,
  },
  progress: {
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  times: {
    flexDirection: 'row',
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  position: {
    color: 'white',
  },
  duration: {
    position: 'absolute',
    right: 0,
    color: 'white',
  },
});

export default Meditation;
