function between(pos, min, max) {
  return Math.min(Math.max(pos, min), max);
}

export function bounds(world, screen, pos) {
  let idxs = [0, 1];

  let halfScreen = idxs.map(i =>
                            Math.floor(screen[i] / 2));

  let leftEdge = halfScreen,
      rightEdge = idxs.map(i =>
                           world[i] - screen[i]);

  let offset = idxs.map(i =>
                        between(pos[i] - halfScreen[i],
                                0, rightEdge[i]));

  return offset;
}

function testBounds() {

  let world = [58, 22],
      screen = [20, 12];

  function test(pos) {
    console.log(pos,
                bounds(world, screen, pos),
                screen,
                world);
  }

  // 58, 22
  // 20, 12
  test([0,0]); // 0,0
  test([9,0]); // 0, 0
  test([10,0]); // 0, 0
  test([11,0]); // 1, 0
  test([47,0]); // 37, 0
  test([48,0]); // 38, 0
  test([49,0]); // 38, 0

  test([57,0]); // 38, 0
  test([58,0]); // 38, 0

  // all pos: 0 20
  // world pos: 0 58
  // offset: 0 38
  
};

// testBounds();
