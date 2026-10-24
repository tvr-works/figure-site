// Adapted from Figure's HelpDiagramView at f85dd64. Coordinates follow its
// normalized Canvas drawing; these are the same labeled schematics, not to scale.
interface Drawing {
  paths: { d: string; dashed?: boolean }[];
  circles?: { cx: number; cy: number; r: number }[];
  labels: { text: string; x: number; y: number }[];
}
export const guideDiagrams: Record<string, Drawing> = {
  "braceAngle": {
    "paths": [
      {
        "d": "M80 197H420V43Z"
      },
      {
        "d": "M395 197V182H420"
      }
    ],
    "labels": [
      {
        "text": "8 ft",
        "x": 250,
        "y": 223.2
      },
      {
        "text": "10 ft",
        "x": 225,
        "y": 89
      },
      {
        "text": "θ",
        "x": 150,
        "y": 177.6
      }
    ]
  },
  "slantComponents": {
    "paths": [
      {
        "d": "M60 196.8H390V43.2Z"
      },
      {
        "d": "M365 196.8V182.4H390"
      }
    ],
    "labels": [
      {
        "text": "10 ft",
        "x": 190,
        "y": 86.4
      },
      {
        "text": "run",
        "x": 230,
        "y": 223.2
      },
      {
        "text": "rise",
        "x": 440,
        "y": 120
      },
      {
        "text": "30°",
        "x": 145,
        "y": 177.6
      }
    ]
  },
  "tangentRise": {
    "paths": [
      {
        "d": "M60 196.8H390V43.2Z"
      },
      {
        "d": "M365 196.8V182.4H390"
      }
    ],
    "labels": [
      {
        "text": "6 ft",
        "x": 230,
        "y": 223.2
      },
      {
        "text": "rise",
        "x": 440,
        "y": 120
      },
      {
        "text": "45°",
        "x": 145,
        "y": 177.6
      }
    ]
  },
  "riseSlantAngle": {
    "paths": [
      {
        "d": "M60 196.8H390V43.2Z"
      },
      {
        "d": "M365 196.8V182.4H390"
      }
    ],
    "labels": [
      {
        "text": "5 ft",
        "x": 190,
        "y": 86.4
      },
      {
        "text": "3 ft",
        "x": 440,
        "y": 120
      },
      {
        "text": "θ",
        "x": 135,
        "y": 177.6
      }
    ]
  },
  "riseRunAngle": {
    "paths": [
      {
        "d": "M60 196.8H390V43.2Z"
      },
      {
        "d": "M365 196.8V182.4H390"
      }
    ],
    "labels": [
      {
        "text": "12 ft",
        "x": 230,
        "y": 223.2
      },
      {
        "text": "3 ft",
        "x": 440,
        "y": 120
      },
      {
        "text": "θ",
        "x": 135,
        "y": 177.6
      }
    ]
  },
  "squareAndRoot": {
    "paths": [
      {
        "d": "M166 12H334V180H166Z"
      }
    ],
    "labels": [
      {
        "text": "144 ft²",
        "x": 250,
        "y": 96
      },
      {
        "text": "12 ft",
        "x": 250,
        "y": 202
      }
    ]
  },
  "cubeAndRoot": {
    "paths": [
      {
        "d": "M159.52 72.16H284.32V196.96H159.52Z"
      },
      {
        "d": "M159.52 72.16L215.68 16H340.48V140.8L284.32 196.96"
      },
      {
        "d": "M284.32 72.16L340.48 16"
      }
    ],
    "labels": [
      {
        "text": "8 m³",
        "x": 221.92,
        "y": 134.56
      },
      {
        "text": "2 m",
        "x": 221.92,
        "y": 218.96
      }
    ]
  },
  "pipeWrap": {
    "paths": [
      {
        "d": "M160 100H340",
        "dashed": true
      }
    ],
    "circles": [
      {
        "cx": 250,
        "cy": 100,
        "r": 90
      }
    ],
    "labels": [
      {
        "text": "12 in.",
        "x": 250,
        "y": 84
      },
      {
        "text": "Around the outside",
        "x": 250,
        "y": 212
      }
    ]
  },
  "ogeeOffset": {
    "paths": [
      {
        "d": "M125 120C215 120 285 67.2 375 67.2V146.4C285 146.4 215 199.2 125 199.2Z"
      },
      {
        "d": "M125 120V33.6H375V67.2",
        "dashed": true
      },
      {
        "d": "M125 120H85V199.2H125",
        "dashed": true
      },
      {
        "d": "M375 146.4H445V199.2H125",
        "dashed": true
      },
      {
        "d": "M125 165.6L375 112.8",
        "dashed": true
      }
    ],
    "labels": [
      {
        "text": "L",
        "x": 250,
        "y": 14.4
      },
      {
        "text": "H",
        "x": 50,
        "y": 160.8
      },
      {
        "text": "O",
        "x": 480,
        "y": 172.8
      },
      {
        "text": "slant",
        "x": 270,
        "y": 158.4
      }
    ]
  },
  "measuredTriangle": {
    "paths": [
      {
        "d": "M90 192L220 43.2L410 192Z"
      }
    ],
    "labels": [
      {
        "text": "a",
        "x": 120,
        "y": 105.6
      },
      {
        "text": "b",
        "x": 250,
        "y": 216
      },
      {
        "text": "c",
        "x": 345,
        "y": 105.6
      },
      {
        "text": "A",
        "x": 355,
        "y": 170.4
      },
      {
        "text": "B",
        "x": 220,
        "y": 67.2
      },
      {
        "text": "C",
        "x": 135,
        "y": 170.4
      }
    ]
  },
  "offsetTriangle": {
    "paths": [
      {
        "d": "M60 196.8L440 43.2L280 196.8Z"
      },
      {
        "d": "M440 43.2V196.8H280",
        "dashed": true
      },
      {
        "d": "M410 196.8V182.4H440"
      }
    ],
    "labels": [
      {
        "text": "I",
        "x": 225,
        "y": 158.4
      },
      {
        "text": "II",
        "x": 405,
        "y": 172.8
      },
      {
        "text": "A",
        "x": 245,
        "y": 175.2
      },
      {
        "text": "θ",
        "x": 320,
        "y": 175.2
      },
      {
        "text": "a",
        "x": 210,
        "y": 93.6
      },
      {
        "text": "b",
        "x": 155,
        "y": 220.8
      },
      {
        "text": "r = c",
        "x": 395,
        "y": 139.2
      },
      {
        "text": "x",
        "x": 365,
        "y": 220.8
      },
      {
        "text": "y",
        "x": 475,
        "y": 117.6
      }
    ]
  },
  "offsetWithB": {
    "paths": [
      {
        "d": "M60 196.8L440 43.2L280 196.8Z"
      },
      {
        "d": "M440 43.2V196.8H280",
        "dashed": true
      },
      {
        "d": "M410 196.8V182.4H440"
      }
    ],
    "labels": [
      {
        "text": "I",
        "x": 225,
        "y": 158.4
      },
      {
        "text": "II",
        "x": 405,
        "y": 172.8
      },
      {
        "text": "A",
        "x": 245,
        "y": 175.2
      },
      {
        "text": "θ",
        "x": 320,
        "y": 175.2
      },
      {
        "text": "a",
        "x": 210,
        "y": 93.6
      },
      {
        "text": "c",
        "x": 155,
        "y": 220.8
      },
      {
        "text": "r = b",
        "x": 395,
        "y": 139.2
      },
      {
        "text": "x",
        "x": 365,
        "y": 220.8
      },
      {
        "text": "y",
        "x": 475,
        "y": 117.6
      }
    ]
  },
  "trueLength": {
    "paths": [
      {
        "d": "M75 192H410V48Z"
      },
      {
        "d": "M380 192V177.6H410"
      }
    ],
    "labels": [
      {
        "text": "r · slant",
        "x": 220,
        "y": 98.4
      },
      {
        "text": "x · true length",
        "x": 230,
        "y": 223.2
      },
      {
        "text": "y",
        "x": 450,
        "y": 120
      }
    ]
  },
  "angleBetween": {
    "paths": [
      {
        "d": "M75 112.8H425L185 199.2Z"
      },
      {
        "d": "M75 112.8H425L185 24Z",
        "dashed": true
      }
    ],
    "labels": [
      {
        "text": "c · shared",
        "x": 240,
        "y": 93.6
      },
      {
        "text": "I",
        "x": 235,
        "y": 153.6
      },
      {
        "text": "II",
        "x": 235,
        "y": 69.6
      },
      {
        "text": "A",
        "x": 455,
        "y": 134.4
      },
      {
        "text": "C",
        "x": 185,
        "y": 175.2
      },
      {
        "text": "A2",
        "x": 455,
        "y": 88.8
      },
      {
        "text": "a",
        "x": 110,
        "y": 168
      },
      {
        "text": "a2",
        "x": 110,
        "y": 52.8
      },
      {
        "text": "AB = 180° − A − C − A2",
        "x": 250,
        "y": 225.6
      }
    ]
  }
};

export function hasGuideDiagram(id: string) {
  return Object.hasOwn(guideDiagrams, id);
}
