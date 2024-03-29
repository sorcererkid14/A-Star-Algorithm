function removeFromArray(arr, elt) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == elt) {
      arr.splice(i, 1);
    }
  }
}


function heuristic(a, b) {
  // let d = dist(a.i, a.j, b.i, b.j);
  let d = abs(a.i - b.i) + abs(a.j - b.j);
  return d;
}

let cols = 50;
let rows = 50;
let grid = new Array(cols);

let openSet = [];
let closedSet = [];
let start;
let end;
let w, h;
let path = [];
let current;

class Spot {
  constructor(i, j) {

    this.i = i;
    this.j = j;
    this.f = 0;
    this.h = 0;
    this.g = 0;
    this.neighbors = [];
    this.previous = undefined;
    this.wall = false;

    if (random(1) < 0.3) {
      this.wall = true;
    }
  }

  show(col) {
    fill(col);
    if (this.wall) {
      fill(0);
      ellipse(this.i * w + w/2, this.j * h + h/2, w/2, h/2);
    // rect(this.i * w, this.j * h, w, h);
    }
  }

  addNeighbors(grid) {
    let i = this.i;
    let j = this.j;

    if (i < cols - 1) {
      this.neighbors.push(grid[i + 1][j]);
    }
    if (i > 0) {
      this.neighbors.push(grid[i - 1][j]);
    }
    if (j < rows - 1) {
      this.neighbors.push(grid[i][j + 1]);
    }
    if (j > 0) {
      this.neighbors.push(grid[i][j - 1]);
    }

    if (i > 0 && j > 0) {
      this.neighbors.push(grid[i - 1][j - 1]);
    }
    if (i < cols - 1 && j > 0) {
      this.neighbors.push(grid[i + 1][j - 1]);
    }
    if (i > 0 && j < rows - 1) {
      this.neighbors.push(grid[i - 1][j + 1]);
    }
    if (i < cols - 1 && j < rows - 1) {
      this.neighbors.push(grid[i + 1][j + 1]);
    }
  }
}

function setup() {
  createCanvas(400, 400);

  w = width / cols;
  h = height / rows;

  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = new Spot(i, j);
    }
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].addNeighbors(grid);
    }
  }

  start = grid[0][0];
  end = grid[cols - 1][rows - 1];

  start.wall = false;
  end.wall = false;
  openSet.push(start);
}

function draw() {

  if (openSet.length > 0) {
    // we can keep going

    let winner = 0;
    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[winner].f) {
        winner = i;
      }
    }

    current = openSet[winner]

    if (current === end) {

      // find the path
      // path = [];
      // let temp = current;
      // path.push(temp);
      // while (temp.previous) {
      //   path.push(temp.previous);
      //   temp = temp.previous;
      // }
      noLoop();
      console.log('DONE!');
    }

    removeFromArray(openSet, current);
    closedSet.push(current);


    let neighbors = current.neighbors;
    for (let i = 0; i < neighbors.length; i++) {
      let neighbor = neighbors[i];

      if (!closedSet.includes(neighbor) && !neighbor.wall) {
        let tempG = current.g + 1;

        let newPath = false;
        if (openSet.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
            newPath = true;
          }
        } else {
          neighbor.g = tempG;
          newPath = true;
          openSet.push(neighbor);
        }

        if (newPath) {
          neighbor.h = heuristic(neighbor, end);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.previous = current;
        }

      }
    }

  } else {
    console.log('no solution');
    noLoop();
    return;
  }

  background(255);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].show(color(255));
    }
  }

  for (let i = 0; i < closedSet.length; i++) {
    closedSet[i].show(color(255, 0, 0));
  }

  for (let i = 0; i < openSet.length; i++) {
    openSet[i].show(color(0, 255, 0));
  }

  path = [];
  let temp = current;
  path.push(temp);
  while (temp.previous) {
    path.push(temp.previous);
    temp = temp.previous;
  }

  for (let i = 0; i < path.length; i++) {
    // path[i].show(color(0, 0, 255));
  }


  push();
  noFill();
  stroke(255, 0, 255);
  strokeWeight(w/2);
  beginShape();
  for (let i = 0; i < path.length; i++) {
    vertex(path[i].i * w + w/2, path[i].j * h + h/2);
  }
  endShape();
  pop();
}