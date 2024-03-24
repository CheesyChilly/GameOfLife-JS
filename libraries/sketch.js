function make2DArray(cols, rows) {
  let arr = new Array(cols);

  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}

let grid;
let userGrid;
let cols;
let rows;

let resolution = 10;
let screenX = 1280;
let screenY = 720;

let isRunning = true;

function setup() {
  createCanvas(screenX, screenY);

  let startStopButton = createButton("Start");
  startStopButton.position(10, 10);
  startStopButton.mousePressed(function () {
    isRunning = !isRunning; // Toggle simulation state
    if (isRunning) {
      startStopButton.html("Stop");
    } else {
      startStopButton.html("Start");
    }
  });

  let clearButton = createButton("Clear");
  clearButton.position(startStopButton.width + 15, 10);
  clearButton.mousePressed(function () {
    clearGrid(); // Call function to clear the grid
  });

  cols = screenX / resolution;
  rows = screenY / resolution;
  grid = make2DArray(cols, rows);
  userGrid = make2DArray(cols, rows);

  // for (let i = 0; i < cols; i++) {
  //   for (let j = 0; j < rows; j++) {
  //     grid[i][j] = floor(random(2));
  //   }
  // }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = 0;
    }
  }
}

function draw() {
  background(0);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (userGrid[i][j] !== undefined) {
        // Check if user modified this cell
        grid[i][j] = userGrid[i][j];
      }
    }
  }

  if (isRunning) {
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let x = i * resolution;
        let y = j * resolution;
        if (grid[i][j] == 1) {
          fill(255);
          stroke(155);
          rect(x, y, resolution - 1, resolution - 1);
        }
      }
    }

    // compute next grid
    let next = make2DArray(cols, rows);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let state = grid[i][j];

        //count live neighbours!
        let sum = 0;
        let neighbours = countNeighbours(grid, i, j);

        if (state == 0 && neighbours == 3) {
          next[i][j] = 1;
        } else if (state == 1 && (neighbours < 2 || neighbours > 3)) {
          next[i][j] = 0;
        } else {
          next[i][j] = state;
        }
      }
    }
    grid = next;
  }
}

function countNeighbours(grid, x, y) {
  let sum = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let col = (x + i + cols) % cols;
      let row = (y + j + rows) % rows;
      sum += grid[col][row];
    }
  }
  sum -= grid[x][y];

  return sum;
}

function mousePressed() {
  let cellX = floor(mouseX / resolution);
  let cellY = floor(mouseY / resolution);

  if (cellX >= 0 && cellX < cols && cellY >= 0 && cellY < rows) {
    userGrid[cellX][cellY] = userGrid[cellX][cellY] === 0 ? 1 : 0; // Toggle state
  }
}

function mouseDragged() {
  let cellX = floor(mouseX / resolution);
  let cellY = floor(mouseY / resolution);

  // Update a small area around the current cell

  if (cellX >= 0 && cellX < cols && cellY >= 0 && cellY < rows) {
    userGrid[cellX][cellY] = 1; // Set to alive state during drag
  }
}

function clearGrid() {
  // Reset userGrid to all dead cells (value of 0)
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      userGrid[i][j] = 0;
    }
  }

  // Optionally, reset grid to all dead cells as well
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = 0;
    }
  }
}
