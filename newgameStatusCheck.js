// boolean gameOver will be updated to "false" if the circle intersects the
// walls or the Circle object
gameOver = false;

class Point {
  /*
    Purpose: Creates a Point class. For each Point, you can obtain their x and y
             coordinates seperately.
  */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Line {
  /*
    Purpose: Creates a Line class. For each Line, you can obtain each of its two
             endpoints (and their individual x, y coordinates since they are a
             part of the Point class).
  */
  constructor(x1, y1, x2, y2) {
    this.p1 = new Point(x1, y1);
    this.p2 = new Point(x2, y2);
  }
}

class Circle {
  /*
    Purpose: Creates a Circle class. For each Circle, you can obtain its center
    Point (and its x, y coordinates) as well as its radius.
  */
  constructor(x0, y0, radius) {
    this.center = new Point(x0, y0);
    this.radius = radius;
  }
}

// The first two coordinates are one end, the second two are the other end.
line = new Line(0, 0, 0, 0);
var lineVel = [1, 2, 3, 4];

// First two coordinates are x,y of center, last is radius
circle = new Circle(0, 0, 25);
var circleVel = [0, 0, 0];

function applyVelocityLine(line, velocity) {
  /*
    Parameters: Position and Velocity of a Line object
    Returns: None
    Purpose: Applies velocity to the Line's position, moving the object.
  */

  line.p1.x += velocity[0];
  line.p1.y += velocity[1];
  line.p2.x += velocity[2];
  line.p2.y += velocity[3];
}

function applyVelocityCircle(circle, velocity) {
  /*
    Parameters: Position and Velocity of a Circle object
    Assumption: Velocity list has same length as position list.
    Returns: None
    Purpose: Applies velocity to the Circle's position, moving the object.
  */
  circle.center.x += velocity[0];
  circle.center.y += velocity[1];
  circle.radius += velocity[2];
}

function myKeyDown(event) {
  /*
    Parameters: event object, which contains information about the event
                that triggered the event listener.
    Returns: None, but modifies global variables which track response to event.
    Purpose: Make the animation respond to keys being pressed.
  */

  // One of the attributes of the event object is 'which,' contains the key
  //   that was pressed to trigger the event listener.
  keyCode = event.which;
  keyStr = event.key;

  if (keyStr == 'w') {
    // Move circle up
    if (Math.abs(circleVel[1]) <= 3) {
      circleVel[1] = -2;
    }
  }
  if (keyStr == 'a') {
    if (Math.abs(circleVel[0]) <= 3) {
      // Move circle left
      circleVel[0] = -2;
    }
  }
  if (keyStr == 's') {
    if (Math.abs(circleVel[1]) <= 3) {
      // Move circle down
      circleVel[1] = 2;
    }
  }
  if (keyStr == 'd') {
    if (Math.abs(circleVel[0]) <= 3) {
      // Move circle right
      circleVel[0] = 2;
    }
  }
}

function distance(p1, p2) {
  /*
    Parameters: two different Point objects
    Returns: the distance between the two Point objects in the parameter
    Purpose: to find the distance between the two Point objects (looking at
             their coordinates and using the distance formula / Pythagorean
             theorum.)
  */
  // d=√((x2-x1)²+(y2-y1)²)
  var d = Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
  return d;
}

function checkIntersection(line, circle) {
  /*
    Parameters: a Line object and Circle object
    Returns: boolean variable intersection- true if the line and circle do
             intersect, false if the line and circle do not intersect.
    Purpose: determine if a Line object and Circle object intersect.
  */

  intersection = false;
  for (t = 0; t < 100; t++) {
    // finds 100 points along the Line object. Each point is tested to see if
    // the circle intersects.
    point1 = new Point((1 - t / 100) * line.p1.x + t / 100 * line.p2.x,
      (1 - t / 100) * line.p1.y + t / 100 * line.p2.y);

    var dis = distance(point1, circle.center);
    if (dis <= circle.radius) {
      // if the distance between the circle's center and the point is less than
      // the radius, the circle intersects the line.
      intersection = true;
      break;
    }
  }
  return intersection;
}

function drawAll()
/*
  Purpose: This is the main drawing loop.
  Inputs: None, but it is affected by what the other functions are doing
  Returns: None, but it calls itself to cycle to the next frame
*/
{

  applyVelocityLine(line, lineVel);
  applyVelocityCircle(circle, circleVel);

  // If the line hits the end of the canvas, bounce
  // Add/subtract a little speed
  if ((line.p1.x > canvas.width) || (line.p1.x < 0)) {
    lineVel[0] *= -1;
    lineVel[0] += Math.random() - 0.5;
  }
  if ((line.p1.y > canvas.height) || (line.p1.y < 0)) {
    lineVel[1] *= -1;
    lineVel[1] += Math.random() - 0.5;
  }
  if ((line.p2.x > canvas.width) || (line.p2.x < 0)) {
    lineVel[2] *= -1;
    lineVel[2] += Math.random() - 0.5;
  }
  if ((line.p2.y > canvas.height) || (line.p2.y < 0)) {
    lineVel[3] *= -1;
    lineVel[3] += Math.random() - 0.5;
  }

  // Draw the line
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.lineWidth = 3;
  context.lineCap = 'round';
  context.beginPath();
  context.moveTo(line.p1.x, line.p1.y);
  context.lineTo(line.p2.x, line.p2.y);
  context.stroke();
  context.beginPath();
  context.arc(circle.center.x, circle.center.y, circle.radius, 0, 2 * Math.PI);
  context.stroke();



  // checks each of the canvas's walls / edges. if any of them are intersected
  // by the circle, game over.
  if ((circle.center.x - circle.radius <= 0) ||
    (circle.center.x + circle.radius >= canvas.width) ||
    (circle.center.y - circle.radius <= 0) ||
    (circle.center.y + circle.radius >= canvas.height)) {
    gameOver = true;
  } else {
    // did not hit any of the walls
    // checks if circle hits line or not
    gameOver = checkIntersection(line, circle);
  }

  // if the game is not over (etc has not hit anything)
  if (!gameOver) {
    // Loop the animation to the next frame.
    animFrame = window.requestAnimationFrame(drawAll);
  } else {
    // game over, stop drawing next frame, send GAME OVER message
    window.cancelAnimationFrame(animFrame);
    alert("GAME OVER");
  }
}

// Get width/height of the browser window
windowWidth = window.innerWidth;
windowHeight = window.innerHeight;
console.log("Window is %d by %d", windowWidth, windowHeight);

// Get the canvas, set the width and height from the window
canvas = document.getElementById("mainCanvas");
canvas.width = windowWidth - 20;
canvas.height = windowHeight - 35;
canvas.style.border = "1px solid black";

// Set up the context for the animation
context = canvas.getContext("2d");

// Set up event listener for when user presses a key down.
// It then calls the function myKeyDown, passing it an event object.
document.addEventListener("keydown", myKeyDown);

// Start the circle in the center of the canvas.
circle = new Circle(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2), 25);

// Fire up the animation engine
animFrame = window.requestAnimationFrame(drawAll);
