/*
This is a Node application that generates paths between two words. Spec:
Write some code that will, given a word, e.g. dog, and another word, e.g. cat, will output a sequence of valid words (in a dictionary), where each pair of adjacent words are only different by 1 character. e.g. dog -> dot -> cot -> cat. If you can, also output the entire list of all such paths between two words.

Usage:
* Install Node
* Place "app.js" and "dictionary.js" files in a directory
* In terminal, navigate to the directory and run "node app"

The method (cat2DogAllPaths) accepts 3 arguments:
* starting word
* target word
* limit (how many successful paths to find before stopping)

As this is using JavaScript, the limit stops it running for a crazy length of time. (The dictionary is quite large).
*/
var start = 'cat';
var target = 'dog';
var limit = 10000;
var dictionary = require('./dictionary.js'); // ~ 1000 words currently
var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

console.log(cat2DogAllPaths(start, target, limit));

function findPossibilities(word, exclude) {
  // Exclude is an array of words to not count as a possibility
  var possibilities = [];
  // Try each letter in the word
  for (var letter = 0; letter < word.length; letter++) {
    // For each new letter, reset the original word
    var wordArray = word.split('');
    for (var i = 0; i < 26; i++) {
      wordArray[letter] = alphabet[i];
      newword = wordArray.join('');
      if (dictionary.indexOf(newword) > -1 && exclude.indexOf(newword) == -1) {
        possibilities.push(newword);
      }
    }
  }
  return possibilities;
}

function cat2DogAllPaths(word, target, limit) {
  // Set up a "in-progress" paths array with the initial word ['cat'], and a "winners" array
  var inProgress = [], startingArray = [];
  var failedPaths = [];
  startingArray.push(word);
  inProgress.push(startingArray);
  var winners = [];
  while(inProgress.length > 0) {
    var currentPath = inProgress[0];
    inProgress.splice(0, 1);
    var wordToCheck = currentPath[currentPath.length - 1];
    var possibilities = findPossibilities(
      wordToCheck,
      currentPath
    );
    if (possibilities.length) {
      for (var i = 0; i < possibilities.length; i++) {
        if (possibilities[i] == target) {
          // Got a win, move this path to the winners array
          currentPath.push(possibilities[i]);
          console.log(JSON.stringify(currentPath));
          winners.push(currentPath);
          if (winners.length == limit) {
            return {winners};
          }
        } else {
          // Add to the path and push to in-progress
          var newPath = currentPath.slice(0);
          newPath.push(possibilities[i]);
          inProgress.push(newPath);
        }
      }
    } else {
      failedPaths.push(currentPath);
    }
  }
  // Wow, it got all the paths
  return winners.length;
}
