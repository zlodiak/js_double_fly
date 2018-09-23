class Game {

  constructor(initObj) {
    this.gameEl = initObj.gameEl;
    this.fieldHeight = initObj.fieldHeight;
    this.fieldWidth = initObj.fieldWidth;
    this.stepFly = initObj.stepFly;
    this.tick = initObj.tick;

    this.rockets = [];

    this.createField();
    this.createFlys();
    this.createPanels();

    this.startGameCycle();
    this.startKeysListen();
  }

  createField() {
    this.fieldEl = document.createElement('div');
    this.fieldEl.classList.add('field');
    this.fieldEl.style.height = this.fieldHeight + 'px';
    this.fieldEl.style.width = this.fieldWidth + 'px';
    this.gameEl.appendChild(this.fieldEl);      
  }

  createPanels() {
    this.leftPanel = new Panel({
      id: 'leftPanelBox',
      parentEl: this.gameEl,
      left: '20px',
      right: 'auto',
      top: '20px'
    }); 

    this.rightPanel = new Panel({
      id: 'rightPanelBox',
      parentEl: this.gameEl,
      left: 'auto',
      right: '20px',
      top: '20px'
    }); 
  }

  createFlys() {
    this.flyLeft = new Fly({
      parentEl: this.fieldEl,
      class: 'flyLeft',
      background: 'red',
      width: 20,
      height: 10,      
      yCoord: this.fieldHeight / 2,
      energy: 100,
      rocketsCnt: 50,
      score: 0,
      downKeyCode: 97,
      upKeyCode: 113,
      fireKeyCode: 122
    });

    this.flyRight = new Fly({
      parentEl: this.fieldEl,
      class: 'flyRight',      
      background: 'yellow',
      width: 20,
      height: 10,
      yCoord: this.fieldHeight / 2,
      energy: 100,
      rocketsCnt: 50,
      score: 0,
      downKeyCode: 115,
      upKeyCode: 119,
      fireKeyCode: 120
    });    
  }

  startGameCycle() {
    setInterval(() => {
      if (this.gameEl) {
        this.fieldEl.innerHTML = '';

        this.flyLeft.render();
        this.flyRight.render();

        this.rockets.forEach((rocket, index) => {
          if (this._isCollideFlyLeft(rocket)) {
            this.flyLeft.energy -= 10;
            this.flyRight.score += 100;
            this.rockets.splice(index, 1);
          }

          if (this._isCollideFlyRight(rocket)) {
            this.flyRight.energy -= 10;
            this.flyLeft.score += 100;
            this.rockets.splice(index, 1);
          }    

          if (rocket.type === "left") {
            if (rocket.xCoord < this.fieldWidth) {
              rocket.move();
            } else if (rocket.xCoord >= this.fieldWidth) {
              this.rockets.splice(index, 1);
            }
          }

          if (rocket.type === "right") {
            if (rocket.xCoord > 0) {
              rocket.move();
            } else if (rocket.xCoord <= 0) {
              this.rockets.splice(index, 1);
            }
          }                         
        });        
      }

      if (this.leftPanel) {
        this.leftPanel.setValues({
          energyValue: this.flyLeft.energy,
          rocketsValue: this.flyLeft.rocketsCnt,
          scoreValue: this.flyLeft.score
        });
      }

      if (this.rightPanel) {
        this.rightPanel.setValues({
          energyValue: this.flyRight.energy,
          rocketsValue: this.flyRight.rocketsCnt,
          scoreValue: this.flyRight.score
        });
      }

      if (this.flyRight.energy <= 0) {
        this._restartGame('left');
      }

      if (this.flyLeft.energy <= 0) {
        this._restartGame('right');
      }      
    }, this.tick);
  }

  startKeysListen() {
    document.addEventListener('keypress', (e) => {
      switch(e.keyCode) {
        case 113: if (this.flyLeft.yCoord >= this.stepFly) { this.flyLeft.move(-this.stepFly) };
          break;
        case 97: if (this.flyLeft.yCoord <= this.fieldHeight - this.flyLeft.height - this.stepFly) { this.flyLeft.move(this.stepFly) };
          break;  
        case 122: 
          if (this.flyLeft.rocketsCnt <= 0) { break; }
          this.rockets.push(new Rocket({
            parentEl: this.fieldEl,
            yCoord: this.flyLeft.yCoord,
            xCoord: this.flyLeft.width,
            type: 'left'
          }));
          this.flyLeft.rocketsCnt--;
          break;               
        case 119: if (this.flyRight.yCoord >= this.stepFly) { this.flyRight.move(-this.stepFly) };
          break;
        case 115: if (this.flyRight.yCoord <= this.fieldHeight - this.flyRight.height - this.stepFly) { this.flyRight.move(this.stepFly) };
          break;
        case 120: 
          if (this.flyRight.rocketsCnt <= 0 ) { break; }
          this.rockets.push(new Rocket({
            parentEl: this.fieldEl,
            yCoord: this.flyRight.yCoord,
            xCoord: this.fieldWidth - this.flyRight.width,
            type: 'right',
            step: -5
          }));
          this.flyRight.rocketsCnt--;
      }
    });
  }

  _isCollideFlyLeft(rocket) {
    if (rocket.xCoord < this.flyLeft.width && 
        rocket.yCoord >= this.flyLeft.yCoord && 
        rocket.yCoord <= this.flyLeft.yCoord + this.flyLeft.height) 
    {
      return true;
    };
  }

  _isCollideFlyRight(rocket) {
    if (rocket.xCoord > (this.fieldWidth - this.flyRight.width) && 
        rocket.yCoord >= this.flyRight.yCoord && 
        rocket.yCoord <= this.flyRight.yCoord + this.flyRight.height) 
    {
      return true;
    };
  }

  _restartGame(winnerLabel) {
    this.rockets = [];
    document.body.innerHTML = '';
    window.location.reload();
    alert(winnerLabel + ' fly winner');
  }

}

class Fly {

  constructor(initObj) {
    this.parentEl = initObj.parentEl;
    this.class = initObj.class;
    this.background = initObj.background;
    this.width = initObj.width;
    this.height = initObj.height;
    this.yCoord = initObj.yCoord;
    this.energy = initObj.energy;
    this.rocketsCnt = initObj.rocketsCnt;
    this.score = initObj.score;
    this.downKeyCode = initObj.downKeyCode;
    this.upKeyCode = initObj.upKeyCode;    
    this.fireKeyCode = initObj.fireKeyCode;
    this.render();
  }

  render() {
    const flyEl = document.createElement('div');
    flyEl.className += ' ' + this.class;
    flyEl.className += ' fly';
    flyEl.style.top = this.yCoord + 'px';
    flyEl.style.width = this.width + 'px';
    flyEl.style.height = this.height + 'px';
    flyEl.style.background = this.background;
    this.parentEl.appendChild(flyEl);     
  }

  move(yCoordDelta) {
    this.yCoord += yCoordDelta;
  }

}

class Panel {

  constructor(initObj) {
    this.enetgyEl = null;
    this.rocketsEl = null;
    this.scoreEl = null;
    this.panelEl = null;
    this.id = initObj.id;
    this.top = initObj.top;
    this.left = initObj.left;
    this.right = initObj.right;
    this.parentEl = initObj.parentEl;
    this.render();
  }

  setValues(valuesObj) {
    if (!this.panelEl) { return; }
    this.panelEl.querySelector('.energyBox .value').innerHTML = valuesObj.energyValue;
    this.panelEl.querySelector('.rocketsBox .value').innerHTML = valuesObj.rocketsValue;
    this.panelEl.querySelector('.scoreBox .value').innerHTML = valuesObj.scoreValue;
    
  }

  render() {
    this.panelEl = document.createElement('div');
    this.panelEl.id += this.id;
    this.panelEl.className += ' panel';
    this.panelEl.style.top = this.top;
    this.panelEl.style.left = this.left;
    this.panelEl.style.right = this.right;
    this.parentEl.appendChild(this.panelEl);   

    const energyEl = document.createElement('div');
    energyEl.className += ' energyBox';
    energyEl.innerHTML += '<span class="title">Energy: </span><span class="value"></span>';
    this.panelEl.appendChild(energyEl);
     
    const rocketsEl = document.createElement('div');
    rocketsEl.className += ' rocketsBox';
    rocketsEl.innerHTML += '<span class="title">Rockets: </span><span class="value"></span>';
    this.panelEl.appendChild(rocketsEl);

    const scoreEl = document.createElement('div');
    scoreEl.className += ' scoreBox';
    scoreEl.innerHTML += '<span class="title">Score: </span><span class="value"></span>';
    this.panelEl.appendChild(scoreEl);           
  }

}

class Rocket {

  constructor(initObj) {
    this.parentEl = initObj.parentEl;
    this.type = initObj.type;
    this.xCoord = initObj.xCoord;
    this.yCoord = initObj.yCoord;
    this.background = initObj.background || 'lime';
    this.width = initObj.width || 10;
    this.height = initObj.height || 5;
    this.step = initObj.step || 5;
    this.id = initObj.id || 'id_' + new Date().getTime();
    this.render();
  }

  render() {
    const rocketEl = document.createElement('div');
    rocketEl.id = this.id;
    rocketEl.className += ' rocket';
    rocketEl.style.top = this.yCoord + 'px';
    rocketEl.style.left = this.xCoord + 'px';
    rocketEl.style.width = this.width + 'px';
    rocketEl.style.height = this.height + 'px';
    rocketEl.style.background = this.background;
    this.parentEl.appendChild(rocketEl);  
  }

  move() {
    this.xCoord += this.step;
    this.render();
  }

}