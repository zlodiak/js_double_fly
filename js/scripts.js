class Game {

  constructor() {
    this.gameEl = document.getElementById('game');
    this.fieldHeight = 500;
    this.fieldEl = document.createElement('div');
    this.fieldEl.classList.add('field');
    this.fieldEl.style.height = this.fieldHeight + 'px';
    this.gameEl.appendChild(this.fieldEl);    
    this.step = 10;

    this.flyLeft = new Fly({
      background: 'red',
      width: 20,
      height: 10,      
      yCoord: 100,
      energy: 100,
      rocketsCnt: 50,
      downKeyCode: 97,
      upKeyCode: 113,
      fireKeyCode: 122
    });

    this.flyRight = new Fly({
      background: 'yellow',
      width: 20,
      height: 10,
      yCoord: 100,
      energy: 100,
      rocketsCnt: 50,
      downKeyCode: 115,
      upKeyCode: 119,
      fireKeyCode: 120
    });

    this.render();
    this.keysListen();
  }

  render() {    
    setInterval(() => {
      if (this.gameEl) {
        this.fieldEl.innerHTML = '';

        const flyLeftEl = document.createElement('div');
        flyLeftEl.className += ' flyLeft';
        flyLeftEl.className += ' fly';
        flyLeftEl.style.top = this.flyLeft.yCoord + 'px';
        flyLeftEl.style.width = this.flyLeft.width + 'px';
        flyLeftEl.style.height = this.flyLeft.height + 'px';
        flyLeftEl.style.background = this.flyLeft.background;
        this.fieldEl.appendChild(flyLeftEl); 

        const flyRightEl = document.createElement('div');
        flyRightEl.className += ' flyRight';
        flyRightEl.className += ' fly';
        flyRightEl.style.top = this.flyRight.yCoord + 'px';
        flyRightEl.style.width = this.flyRight.width + 'px';
        flyRightEl.style.height = this.flyRight.height + 'px';        
        flyRightEl.style.background = this.flyRight.background;        
        this.fieldEl.appendChild(flyRightEl);         
      }
    }, 100);
  }

  keysListen() {
    document.addEventListener('keypress', (e) => {
      switch(e.keyCode) {
        case 113: if (this.flyLeft.yCoord >= this.step) { this.flyLeft.move(-this.step) };
          break;
        case 97: if (this.flyLeft.yCoord <= 500 - this.flyLeft.height - this.step) { this.flyLeft.move(this.step) };
          break;      
        case 119: if (this.flyRight.yCoord >= this.step) { this.flyRight.move(-this.step) };
          break;
        case 115: if (this.flyRight.yCoord <= 500 - this.flyRight.height - this.step) { this.flyRight.move(this.step) };
          break;      
      }
    });
  }

}

class Fly {

  constructor(initObj) {
    this.background = initObj.background;
    this.width = initObj.width;
    this.height = initObj.height;
    this.yCoord = initObj.yCoord;
    this.energy = initObj.energy;
    this.rocketsCnt = initObj.rocketsCnt;
    this.downKeyCode = initObj.downKeyCode;
    this.upKeyCode = initObj.upKeyCode;    
    this.fireKeyCode = initObj.fireKeyCode;    
  }

  move(yCoordDelta) {
    this.yCoord += yCoordDelta;
  }

}