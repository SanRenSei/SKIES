
let levelData = [
  {level: 0},
  {
    level: 1,
    height: 5,
    minSpace: 0.1,
    maxSpace: 0.2,
    platformDistribution: [1]
  },
  {
    level: 2,
    height: 10,
    minSpace: 0.1,
    maxSpace: 0.2,
    platformDistribution: [1, 1]
  },
  {
    level: 3,
    height: 15,
    minSpace: 0.15,
    maxSpace: 0.25,
    platformDistribution: [1, 1, 1, 1]
  },
  {
    level: 4,
    height: 10,
    minSpace: 0.1,
    maxSpace: 0.2,
    platformDistribution: [1, 1, 1, 1, 1]
  }, {
    level: 5,
    height: 1,
    minSpace: 0,
    maxSpace: 0,
    cameraLock: true,
    platformPreset: [
      { type: 0, x: -0.33, y: 0.2 }, 
      { type: 0, x: 0, y: 0.2 }, 
      { type: 0, x: 0.33, y: 0.2 }, 
      { type: 4, x: 0, y: 0.4 }, 
      { type: 0, x: -0.33, y: 0.6 }, 
      { type: 0, x: 0, y: 0.6 }, 
      { type: 0, x: 0.33, y: 0.6 },
      { type: 4, x: 0, y: 0.8 }],
    enemyPreset: [{ type: 'spikedome' }]
  },
  {
    level: 6,
    height: 10,
    minSpace: 0.15,
    maxSpace: 0.2,
    platformDistribution: [5, 1, 1, 1, 1, 5]
  }, {
    level: 7,
    height: 12.5,
    minSpace: 0.2,
    maxSpace: 0.3,
    platformDistribution: [5, 1, 1, 1, 1, 5],
    enemyPreset: [{ type: 'fireball', x: 1, y: 5, speed: 2 }, { type: 'fireball', x: -1, y: 5, speed: 2 }]
  }, {
    level: 8,
    height: 15,
    minSpace: 0.2,
    maxSpace: 0.3,
    platformDistribution: [5, 1, 1, 1, 1, 5],
    enemyPreset: [
      { type: 'fireball', x: 1, y: 3, speed: 2 }, { type: 'fireball', x: -1, y: 6, speed: 2 }, 
      { type: 'fireball', x: 1, y: 9, speed: 2 }, { type: 'fireball', x: -1, y: 12, speed: 2 }
    ]
  }, {
    level: 9,
    height: 15,
    minSpace: 0.2,
    maxSpace: 0.3,
    platformDistribution: [5, 1, 1, 1, 1, 5],
    enemyPreset: [
      { type: 'fireball', x: 0.5, y: 2, speed: 2 }, { type: 'fireball', x: -0.5, y: 3, speed: 2 }, 
      { type: 'fireball', x: 0.5, y: 4, speed: 2 }, { type: 'fireball', x: -0.5, y: 5, speed: 2 },
      { type: 'fireball', x: 0.5, y: 6, speed: 2 }, { type: 'fireball', x: -0.5, y: 7, speed: 2 }, 
      { type: 'fireball', x: 0.5, y: 8, speed: 2 }, { type: 'fireball', x: -0.5, y: 9, speed: 2 },
      { type: 'fireball', x: 0.5, y: 10, speed: 2 }, { type: 'fireball', x: -0.5, y: 11, speed: 2 }
    ]
  }, {
    level: 10,
    height: 1,
    minSpace: 0,
    maxSpace: 0,
    cameraLock: true,
    platformPreset: [
      { type: 0, x: -0.33, y: 0.2 }, 
      { type: 0, x: 0, y: 0.2 }, 
      { type: 0, x: 0.33, y: 0.2 }, 
      { type: 0, x: -0.33, y: 0.6 }, 
      { type: 0, x: 0, y: 0.6 }, 
      { type: 0, x: 0.33, y: 0.6 }
    ],
    enemyPreset: [{ type: 'shortfuse' }]
  }, {level:11}, {level:12}, {level:13}, {level:14}, {
    level: 15,
    height: 1,
    minSpace: 0,
    maxSpace: 0,
    cameraLock: true,
    platformPreset: [
      { type: 0, x: -0.33, y: 0.2 }, 
      { type: 0, x: 0, y: 0.2 }, 
      { type: 0, x: 0.33, y: 0.2 }, 
      { type: 0, x: -0.33, y: 0.6 }, 
      { type: 0, x: 0, y: 0.6 }, 
      { type: 0, x: 0.33, y: 0.6 }
    ],
    enemyPreset: [{ type: 'ligature' }]
  }, {level:16}, {level:17}, {level:18}, {level:19}, {
    level: 20,
    height: 1,
    minSpace: 0,
    maxSpace: 0,
    cameraLock: true,
    platformPreset: [
      { type: 6, x: -0.33, y: 0.2 }, 
      { type: 6, x: 0, y: 0.2 }, 
      { type: 6, x: 0.33, y: 0.2 }, 
      { type: 6, x: -0.16, y: 0.3 }, 
      { type: 6, x: 0.16, y: 0.3 }, 
      { type: 6, x: 0.5, y: 0.3 }, 
      { type: 6, x: -0.5, y: 0.3 }, 
      { type: 0, x: -0.33, y: 0.45 }, 
      { type: 0, x: 0.33, y: 0.45 },
      { type: 0, x: 0.5, y: 0.7 }, 
      { type: 0, x: -0.5, y: 0.7 }, 
    ],
    enemyPreset: [{ type: 'tortsnap' }]
  }, {level:21}, {level:22}, {level:23}, {level:24}, {
    level: 25,
    height: 1,
    minSpace: 0,
    maxSpace: 0,
    cameraLock: true,
    platformPreset: [
      { type: 0, x: -0.33, y: 0.2 }, 
      { type: 0, x: 0, y: 0.2 }, 
      { type: 0, x: 0.33, y: 0.2 }, 
      { type: 0, x: -0.33, y: 0.6 }, 
      { type: 0, x: 0, y: 0.6 }, 
      { type: 0, x: 0.33, y: 0.6 }
    ],
    enemyPreset: [{ type: 'bunny' },{ type: 'bunny' },{ type: 'bunny' }]
  },
]

export default levelData;