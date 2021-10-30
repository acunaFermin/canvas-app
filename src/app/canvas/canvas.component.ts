import { ThrowStmt } from '@angular/compiler';
import {
  AfterViewInit,
  Component,
  HostListener,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
})
export class CanvasComponent implements AfterViewInit {
  [x: string]: any;
  @ViewChild('miCanvas', { static: false }) miCanvas: any;
  public width = 800;
  public height = 500;

  private cx!: CanvasRenderingContext2D;

  private points: any = [];

  frec1: number = 27;
  frec2: number = 15;
  color: string = '';
  grosor: number = 3;
  mouseDown: boolean = false;
  interval: any;
  innerWidth: any;
  innerHeight: any;
  colorIndex: number = 0;
  j: number = 0;
  colorStatus = false;
  hold: boolean = false;
  holdStatus: number = 0;
  draw: boolean = false;
  grosorStatus: boolean = false;
  grosorMin: number = 1;
  grosorMax: number = 30;
  grosorVel: number = 1;
  grosorStep: number = 1;
  altura: string = '500px';
  finalDraw: boolean = false;

  /*
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = event.target.innerWidth;
    this.innerHeight = event.target.innerHeight;
    this.render();
  }
*/
  @HostListener('mousedown', ['$event'])
  onMouseDown = (e: any) => {
    if (e.srcElement.offsetParent.id == 'idBoton' && !this.draw) {
      this.mouseDown = true;
      this.Draw();
    }
  };

  Hold() {
    this.holdStatus = 1;
    if (!this.hold) {
      this.holdStatus = 0;
      this.stopDraw();
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp = (e: any) => {
    if (
      e.srcElement.offsetParent.id == 'idBoton' &&
      this.draw &&
      this.holdStatus == 0
    ) {
      this.draw = false;
      clearInterval(this.interval);
      this.hold = false;
    }
    this.holdStatus--;
    if (this.holdStatus < 0) {
      this.holdStatus = 0;
    }
  };

  @HostListener('touchstart', ['$event'])
  onTouchStart = (e: any) => {
    if (e.srcElement.offsetParent.id == 'idBoton' && !this.draw) {
      this.mouseDown = true;
      this.Draw();
    }
  };

  @HostListener('touchend', ['$event'])
  onTouchEnd = (e: any) => {
    if (
      e.srcElement.offsetParent.id == 'idBoton' &&
      this.draw &&
      this.holdStatus == 0
    ) {
      this.draw = false;
      clearInterval(this.interval);
      this.hold = false;
    }
    this.holdStatus--;
    if (this.holdStatus < 0) {
      this.holdStatus = 0;
    }
  };

  Draw() {
    this.draw = true;
    if (!this.finalDraw) {
      this.interval = setInterval(() => {
        this.write();
      }, 1);
      console.log(this.points.length);
    }
    if (this.finalDraw) {
      let a = (this.frec1 + this.frec2) * 0.5 * 100;
      let i = 0;
      while (i < a) {
        this.write();
        i++;
      }
    }
  }

  stopDraw() {
    if (!this.hold) {
      this.draw = false;
      clearInterval(this.interval);
    }
  }

  private render(): any {
    const canvasEl = this.miCanvas.nativeElement;
    this.cx = canvasEl.getContext('2d');

    //medidas del lienzo de trabajo
    canvasEl.widht = this.innerHeight;
    canvasEl.height = this.innerHeight;
  }

  reLoad() {
    this.points = [];
  }

  private write(): any {
    const canvasEl = this.miCanvas.nativeElement;
    let amplitude: any;
    let screenCenter: any;

    amplitude = this.innerHeight * 0.5 - this.grosor * 0.5 - 5;
    screenCenter = amplitude + 5 + this.grosor * 0.5;
    const prevPos = {
      x: Math.sin(this.points.length / this.frec1) * amplitude + screenCenter,
      y: Math.cos(this.points.length / this.frec2) * amplitude + screenCenter,
    };

    if (this.grosorStatus) {
      this.grosorStep = this.frec1 / this.frec2;
      console.log(this.grosorVel);
      let amplitude = (this.grosorMax - this.grosorMin) * 0.5;
      let frec = this.frec1 / this.grosorVel;
      let grosor =
        amplitude * Math.sin(this.points.length / frec) +
        this.grosorMin +
        amplitude;
      this.grosor = grosor;
    }

    this.writeSingle(prevPos);
  }

  private writeSingle = (prevPos: any) => {
    let prevPost: any = {};
    let currentPos: any = {};
    this.points.push(prevPos);
    if (this.points.length > 3) {
      prevPost = this.points[this.points.length - 1];
      currentPos = this.points[this.points.length - 2];
    }
    this.drawOnCanvas(prevPost, currentPos);
  };

  private drawOnCanvas(prevPos: any, currentPos: any) {
    if (!this.cx) {
      return;
    }
    this.cx.lineWidth = this.grosor;
    this.cx.lineCap = 'round';
    if (this.colorStatus) {
      this.color = this.DynamicColor();
    }
    this.cx.strokeStyle = this.color;

    this.cx.beginPath();
    if (prevPos) {
      this.cx.moveTo(prevPos.x, prevPos.y);
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.stroke();
    }
  }

  DynamicColor() {
    let k: number;
    let j: number;
    k = this.points.length;

    if (k >= 16) {
      if (k % 16 == 0) {
        k = 0;
        this.colorIndex++;
      }
      k = k % 16;
    }

    if (this.colorIndex >= 16) {
      if (this.colorIndex % 16 == 0) {
        this.colorIndex = 0;
        this.j++;
      }
      this.colorIndex = this.colorIndex % 16;
    }

    let r: string;
    let g: string;
    let b: string;

    let r1: any;
    let r1Index: number;
    let g1: any;
    let g1Index: number;
    let b1: any;
    let b1Index: number;

    let r2: any;
    let r2Index: number;
    let g2: any;
    let g2Index: number;
    let b2: any;
    let b2Index: number;

    if (this.colorIndex == 0) {
      r1 = 'f';
      r2 = 'f';
      g1 = '0';
      g2 = '0';
      b1 = '0';
      b2 = this.colorCase(k);
    }

    if (this.colorIndex > 0 && this.colorIndex <= 15) {
      r1 = 'f';
      r2 = 'f';
      g1 = '0';
      g2 = '0';
      b1 = this.colorCase(this.colorIndex);
      b2 = this.colorCase(k);
    }

    if (this.j == 1) {
      g1 = '0';
      g2 = '0';
      b1 = 'f';
      b2 = 'f';
      r1Index = 15 - this.colorIndex;
      r2Index = 15 - k;
      r1 = this.colorCase(r1Index);
      r2 = this.colorCase(r2Index);
    }

    if (this.j == 2) {
      r1 = '0';
      r2 = '0';
      g1 = this.colorCase(this.colorIndex);
      g2 = this.colorCase(k);
      b1 = 'f';
      b2 = 'f';
    }

    if (this.j == 3) {
      r1 = '0';
      r2 = '0';
      g1 = 'f';
      g2 = 'f';
      b1Index = 15 - this.colorIndex;
      b2Index = 15 - k;
      b1 = this.colorCase(b1Index);
      b2 = this.colorCase(b2Index);
    }

    if (this.j == 4) {
      r1 = this.colorCase(this.colorIndex);
      r2 = this.colorCase(k);
      g1 = 'f';
      g2 = 'f';
      b1 = '0';
      b2 = '0';
    }

    if (this.j == 5) {
      r1 = 'f';
      r2 = 'f';
      g1Index = 15 - this.colorIndex;
      g2Index = 15 - k;
      g1 = this.colorCase(g1Index);
      g2 = this.colorCase(g2Index);
      b1 = '0';
      b2 = '0';
      if (g1 == '0' && g2 == '0') {
        this.j = -1;
      }
    }

    r = r1 + r2;
    g = g1 + g2;
    b = b1 + b2;

    this.color = `#${r}${g}${b}`;
    return this.color;
  }

  colorCase(param: any): any {
    let rgb: any;
    switch (param) {
      case 0:
        rgb = '0';
        break;
      case 1:
        rgb = '1';
        break;
      case 2:
        rgb = '2';
        break;
      case 3:
        rgb = '3';
        break;
      case 4:
        rgb = '4';
        break;
      case 5:
        rgb = '5';
        break;
      case 6:
        rgb = '6';
        break;
      case 7:
        rgb = '7';
        break;
      case 8:
        rgb = '8';
        break;
      case 9:
        rgb = '9';
        break;
      case 10:
        rgb = 'a';
        break;
      case 11:
        rgb = 'b';
        break;
      case 12:
        rgb = 'c';
        break;
      case 13:
        rgb = 'd';
        break;
      case 14:
        rgb = 'e';
        break;
      case 15:
        rgb = 'f';
        break;

      default:
        alert('Default case');
        break;
    }
    return rgb;
  }

  ColorOn() {
    if (!this.colorStatus) {
      this.colorStatus = true;
    } else {
      this.colorStatus = false;
    }
  }

  Reset() {
    this.render();
  }

  constructor() {}
  ngAfterViewInit(): void {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;

    if (this.innerWidth < 1050 && this.innerWidth > this.innerHeight) {
      this.innerWidth = this.innerWidth * 0.55;
      this.innerHeight = this.innerWidth;
    } else if (this.innerWidth > this.innerHeight) {
      this.innerHeight = this.innerHeight * 0.95;
      this.innerWidth = this.innerHeight;
    }
    if (this.innerWidth < this.innerHeight) {
      this.innerWidth = this.innerWidth * 0.98;
      this.innerHeight = this.innerWidth;
    }
    this.altura = `${this.innerHeight}px`;

    this.render();
  }
}
