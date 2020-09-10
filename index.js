const vader = require('vader-sentiment');

const input = 'The movie was awesome.';

const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(input);
console.log(intensity);