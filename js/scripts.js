class Game {

  constructor() {
    this.gameEl = document.getElementById('game');
    this.fieldHeight = 500;
    this.fieldWidth = 900;
    this.fieldEl = document.createElement('div');
    this.fieldEl.classList.add('field');
    this.fieldEl.style.height = this.fieldHeight + 'px';
    this.fieldEl.style.width = this.fieldWidth + 'px';
    this.gameEl.appendChild(this.fieldEl);    
    this.step = 10;
    this.rockets = [];
    this.thick = 100;

    this.flyLeft = new Fly({
      background: 'red',
      width: 20,
      height: 10,      
      yCoord: 100,
      energy: 100,
      rocketsCnt: 50,
      score: 0,
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
      score: 0,
      downKeyCode: 115,
      upKeyCode: 119,
      fireKeyCode: 120
    });

    this.leftPanel = new Panel({
      selfId: 'leftPanelBox',
      parentEl: this.gameEl,
      left: '20px',
      right: 'auto',
      top: '20px'
    }); 

    this.rightPanel = new Panel({
      selfId: 'rightPanelBox',
      parentEl: this.gameEl,
      left: 'auto',
      right: '20px',
      top: '20px'
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

      this.rockets.forEach(rocket => {
        if (rocket.xCoord < parseInt(this.fieldEl.style.width) && rocket.type === 'left') {
          rocket.move();
        }
        if (rocket.xCoord > 0 && rocket.type === 'right') {
          rocket.move();
        }           
      });
    }, this.tick);
  }

  keysListen() {
    document.addEventListener('keypress', (e) => {
      switch(e.keyCode) {
        case 113: if (this.flyLeft.yCoord >= this.step) { this.flyLeft.move(-this.step) };
          break;
        case 97: if (this.flyLeft.yCoord <= 500 - this.flyLeft.height - this.step) { this.flyLeft.move(this.step) };
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
        case 119: if (this.flyRight.yCoord >= this.step) { this.flyRight.move(-this.step) };
          break;
        case 115: if (this.flyRight.yCoord <= 500 - this.flyRight.height - this.step) { this.flyRight.move(this.step) };
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

}

class Fly {

  constructor(initObj) {
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
    this.selfId = initObj.selfId;
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
    this.panelEl.id += this.selfId;
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