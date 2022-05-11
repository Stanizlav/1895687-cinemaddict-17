import { generateInteger, generateArrayFrom, limit, generateDate } from '../utils.js';

const COMMENTS_TOTAL = 50;
const MAX_SENTENCES_COUNT = 5;
const MAX_COMMENTS_COUNT = 4;

const TITLES = [
  'The Man with the Golden Arm',
  'Made for Each Other',
  'Popeye the Sailor Meets Sindbad the Sailor',
  'Sagebrush Trail',
  'Santa Claus Conquers the Martians',
  'The Dance of Life',
  'The Great Flamarion'
];

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.'
];

const POSTERS = [
  'images/posters/the-man-with-the-golden-arm.jpg',
  'images/posters/made-for-each-other.png',
  'images/posters/popeye-meets-sinbad.png',
  'images/posters/sagebrush-trail.jpg',
  'images/posters/santa-claus-conquers-the-martians.jpg',
  'images/posters/the-dance-of-life.jpg',
  'images/posters/the-great-flamarion.jpg'
];

const COMMENTS_IDS_POOL = (()=>{
  const createId = (element, id) => ++id;
  const _pool = Array.from({length:COMMENTS_TOTAL}, createId);
  return{
    getIds(count){
      const array = [];
      for(let i = 0; i<count && _pool.length; i++){
        const pulledElementIndex = generateInteger(0, _pool.length-1);
        array[i]=_pool[pulledElementIndex];
        _pool.splice(pulledElementIndex,1);
      }
      return array;
    }
  };
})();

export const generateMovie = (element, id) => {
  const index = limit(++id, 1, TITLES.length)-1;
  const alreadyWatched = generateInteger(0,1);
  const commentsCount = generateInteger(0, MAX_COMMENTS_COUNT);
  const comments = COMMENTS_IDS_POOL.getIds(commentsCount);
  return {
    id: id,
    comments,
    filmInfo: {
      title: TITLES[index],
      alternativeTitle: 'Laziness Who Sold Themselves',
      totalRating: generateInteger(10, 100)/10,
      poster: POSTERS[index],
      ageRating: 0,
      director: 'Otto Preminger',
      writers: [
        'Takeshi Kitano', 'Anne Wigton'
      ],
      actors: [
        'Frank Sinatra', 'Eleanor Parker', 'Kim Novak'
      ],
      release: {
        date: generateDate(),
        releaseCountry: 'Finland'
      },
      runtime: generateInteger(60, 180),
      genre: [
        'Drama', 'Film-Noir'
      ],
      description: generateArrayFrom(
        generateInteger(1, MAX_SENTENCES_COUNT),
        DESCRIPTIONS).join(' ')
    },
    userDetails: {
      watchlist: generateInteger(0,1),
      alreadyWatched,
      watchingDate: '2019-04-12T16:12:32.554Z',
      favorite: alreadyWatched && generateInteger(0,1)
    }
  };
};
