
let polyfill = () => {
  Array.randomFrom = (arr) => {
    return arr[Math.floor(Math.random()*arr.length)];
  }
  Array.shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}

polyfill();

export default polyfill;