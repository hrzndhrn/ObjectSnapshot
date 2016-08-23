const DEFAULT_INC_DEC = 1;
const DEFAULT_START_VALUE = 0;

class Counter {
  constructor(startValue =  DEFAULT_START_VALUE) {
    this.count = startValue;
  }


  inc(value = DEFAULT_INC_DEC) {
    this.count = this.count + value;
  }

  dec(value = DEFAULT_INC_DEC) {
    this.count = this.count - value;
  }
}

export {Counter}
