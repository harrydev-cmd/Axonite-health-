import processing.serial.*;

Serial myPort;

// -----------------------------
// RADAR DATA
// -----------------------------

float angle = 90;
float distance = 20;

final float MAX_RANGE = 20;


// -----------------------------
// COLORS
// -----------------------------

color backgroundColor = color(7, 12, 18);
color green = color(0, 255, 150);
color lightGreen = color(80, 255, 190);
color red = color(255, 70, 70);
color white = color(235, 245, 245);
color gray = color(130, 150, 155);


// -----------------------------
// RADAR POSITION
// -----------------------------

float radarX = 400;
float radarY = 540;
float radarRadius = 350;


// -----------------------------
// SETUP
// -----------------------------

void setup() {

  size(1000, 700);

  smooth();

  // Show available ports

  println(Serial.list());

  // Connect to first port

  if (Serial.list().length > 0) {

    myPort = new Serial(
      this,
      Serial.list()[0],
      9600
    );

    myPort.bufferUntil('\n');
  }
}


// -----------------------------
// DRAW
// -----------------------------

void draw() {

  background(backgroundColor);

  drawHeader();

  drawRadar();

  drawTarget();

  drawInfoPanel();

}


// -----------------------------
// HEADER
// -----------------------------

void drawHeader() {

  fill(white);

  textAlign(LEFT);

  textSize(24);

  text(
    "ULTRASONIC RADAR",
    30,
    40
  );


  fill(green);

  textSize(12);

  text(
    "ARDUINO UNO  /  LIVE SCAN",
    32,
    61
  );


  // Status

  fill(green);

  ellipse(
    950,
    32,
    10,
    10
  );

  fill(gray);

  textAlign(RIGHT);

  textSize(12);

  text(
    "ONLINE",
    935,
    37
  );
}


// -----------------------------
// RADAR
// -----------------------------

void drawRadar() {

  pushMatrix();

  translate(
    radarX,
    radarY
  );


  // ---------------------------
  // RANGE CIRCLES
  // ---------------------------

  noFill();

  for (
    int d = 5;
    d <= 20;
    d += 5
    ) {

    float r = map(
      d,
      0,
      MAX_RANGE,
      0,
      radarRadius
    );


    stroke(
      0,
      180,
      110,
      100
    );

    strokeWeight(1);

    arc(
      0,
      0,
      r * 2,
      r * 2,
      PI,
      TWO_PI
    );


    // Distance label

    fill(gray);

    textAlign(CENTER);

    textSize(11);

    text(
      d + " cm",
      0,
      -r + 15
    );
  }


  // ---------------------------
  // ANGLE LINES
  // ---------------------------

  stroke(
    0,
    150,
    100,
    80
  );

  strokeWeight(1);


  for (
    int a = 0;
    a <= 180;
    a += 30
    ) {

    float rad =
      radians(a);

    float x =
      cos(rad) *
      radarRadius;

    float y =
      -sin(rad) *
      radarRadius;

    line(
      0,
      0,
      x,
      y
    );
  }


  // ---------------------------
  // BASE LINE
  // ---------------------------

  stroke(green);

  strokeWeight(2);

  line(
    -radarRadius,
    0,
    radarRadius,
    0
  );


  // ---------------------------
  // SWEEP
  // ---------------------------

  float rad =
    radians(angle);

  float sweepX =
    cos(rad) *
    radarRadius;

  float sweepY =
    -sin(rad) *
    radarRadius;


  // Glow

  stroke(
    0,
    255,
    150,
    30
  );

  strokeWeight(12);

  line(
    0,
    0,
    sweepX,
    sweepY
  );


  // Main beam

  stroke(lightGreen);

  strokeWeight(2);

  line(
    0,
    0,
    sweepX,
    sweepY
  );


  // Center

  noStroke();

  fill(green);

  ellipse(
    0,
    0,
    10,
    10
  );


  popMatrix();
}


// -----------------------------
// TARGET
// -----------------------------

void drawTarget() {

  // Only show target under 20 cm

  if (
    distance >= MAX_RANGE ||
    distance <= 0
    ) {

    return;
  }


  float rad =
    radians(angle);


  float r =
    map(
      distance,
      0,
      MAX_RANGE,
      0,
      radarRadius
    );


  float x =
    radarX +
    cos(rad) * r;


  float y =
    radarY -
    sin(rad) * r;


  // Glow

  noStroke();

  fill(
    255,
    50,
    50,
    30
  );

  ellipse(
    x,
    y,
    45,
    45
  );


  fill(
    255,
    60,
    60,
    70
  );

  ellipse(
    x,
    y,
    25,
    25
  );


  // Target

  fill(red);

  ellipse(
    x,
    y,
    10,
    10
  );


  // Crosshair

  stroke(red);

  strokeWeight(1);

  line(
    x - 15,
    y,
    x + 15,
    y
  );

  line(
    x,
    y - 15,
    x,
    y + 15
  );
}


// -----------------------------
// INFORMATION PANEL
// -----------------------------

void drawInfoPanel() {

  float x = 700;
  float y = 150;


  // Panel

  noStroke();

  fill(
    12,
    21,
    29
  );


  rect(
    x,
    y,
    250,
    360,
    12
  );


  // Border

  noFill();

  stroke(
    0,
    180,
    120,
    100
  );

  strokeWeight(1);


  rect(
    x,
    y,
    250,
    360,
    12
  );


  // Title

  fill(green);

  textAlign(LEFT);

  textSize(15);

  text(
    "LIVE DATA",
    x + 25,
    y + 35
  );


  // ---------------------------
  // ANGLE
  // ---------------------------

  fill(gray);

  textSize(11);

  text(
    "ANGLE",
    x + 25,
    y + 80
  );


  fill(white);

  textSize(30);

  text(
    nf(
      angle,
      0,
      0
    ) + "°",
    x + 25,
    y + 115
  );


  // ---------------------------
  // DISTANCE
  // ---------------------------

  fill(gray);

  textSize(11);

  text(
    "DISTANCE",
    x + 25,
    y + 155
  );


  fill(green);

  textSize(30);

  text(
    nf(
      distance,
      0,
      1
    ) + " cm",
    x + 25,
    y + 190
  );


  // ---------------------------
  // RANGE BAR
  // ---------------------------

  fill(gray);

  textSize(11);

  text(
    "RANGE",
    x + 25,
    y + 230
  );


  // Background

  noStroke();

  fill(
    35,
    45,
    50
  );

  rect(
    x + 25,
    y + 245,
    200,
    10,
    5
  );


  // Safe distance

  float safeDistance =
    constrain(
      distance,
      0,
      MAX_RANGE
    );


  float bar =
    map(
      safeDistance,
      0,
      MAX_RANGE,
      0,
      200
    );


  fill(green);

  rect(
    x + 25,
    y + 245,
    bar,
    10,
    5
  );


  // ---------------------------
  // TARGET STATUS
  // ---------------------------

  fill(gray);

  textSize(11);

  text(
    "STATUS",
    x + 25,
    y + 295
  );


  if (
    distance < MAX_RANGE &&
    distance > 1
    ) {

    fill(red);

    textSize(16);

    text(
      "TARGET DETECTED",
      x + 25,
      y + 325
    );

  } else {

    fill(green);

    textSize(16);

    text(
      "AREA CLEAR",
      x + 25,
      y + 325
    );
  }
}


// -----------------------------
// SERIAL DATA
// -----------------------------

void serialEvent(Serial p) {

  String data =
    p.readStringUntil('\n');


  if (data == null) {

    return;
  }


  data =
    trim(data);


  String[] values =
    split(
      data,
      ','
    );


  // Arduino must send:
  //
  // angle,distance,time

  if (
    values.length < 2
    ) {

    return;
  }


  try {

    float newAngle =
      Float.parseFloat(
        trim(values[0])
      );


    float newDistance =
      Float.parseFloat(
        trim(values[1])
      );


    // Reject bad values

    if (
      Float.isNaN(newAngle) ||
      Float.isNaN(newDistance)
      ) {

      return;
    }


    // Keep inside radar limits

    angle =
      constrain(
        newAngle,
        0,
        180
      );


    distance =
      constrain(
        newDistance,
        0,
        20
      );
  }


  catch (
    Exception e
    ) {

    println(
      "Invalid data: " +
      data
    );
  }
}
