import type { Dish } from "@/types/domain";

export const demoDishes: Dish[] = [
  {
    id: "rice-white",
    name: "Cơm trắng",
    description: "Nấu bằng nồi cơm điện, có thể giữ ấm nếu xong sớm.",
    category: "rice",
    tags: ["nồi cơm điện", "giữ ấm được"],
    preferredFinishWindow: "early_ok",
    tasks: [
      {
        id: "rice-wash",
        dishId: "rice-white",
        name: "Vo gạo",
        description: "Vo gạo, đổ nước đúng mức và đặt vào nồi.",
        durationMinutes: 5,
        type: "active",
        resources: [{ type: "human", amount: 1 }],
        dependsOn: [],
        canStartEarly: true
      },
      {
        id: "rice-cook",
        dishId: "rice-white",
        name: "Cắm cơm",
        description: "Bật nồi cơm điện và để cơm tự chín.",
        durationMinutes: 30,
        type: "passive",
        resources: [{ type: "rice_cooker", amount: 1 }],
        dependsOn: ["rice-wash"],
        canStartEarly: true
      }
    ]
  },
  {
    id: "pork-braised-eggs",
    name: "Thịt kho trứng",
    description: "Món chính cần thời gian kho lâu và ăn nóng ngon hơn.",
    category: "main",
    tags: ["món chính", "bếp", "nồi", "ăn nóng"],
    preferredFinishWindow: "hot_at_end",
    tasks: [
      {
        id: "pork-prep",
        dishId: "pork-braised-eggs",
        name: "Sơ chế thịt và trứng",
        description: "Cắt thịt, bóc trứng và chuẩn bị gia vị kho.",
        durationMinutes: 10,
        type: "active",
        resources: [
          { type: "human", amount: 1 },
          { type: "knife_board", amount: 1 }
        ],
        dependsOn: []
      },
      {
        id: "pork-marinate",
        dishId: "pork-braised-eggs",
        name: "Ướp thịt",
        description: "Ướp thịt với nước mắm, đường, tiêu và hành.",
        durationMinutes: 20,
        type: "passive",
        resources: [],
        dependsOn: ["pork-prep"]
      },
      {
        id: "pork-cook",
        dishId: "pork-braised-eggs",
        name: "Kho thịt",
        description: "Kho nhỏ lửa đến khi thịt mềm và nước kho sánh.",
        durationMinutes: 40,
        type: "passive",
        resources: [
          { type: "stove", amount: 1 },
          { type: "pot", amount: 1 }
        ],
        dependsOn: ["pork-marinate"],
        heatSensitivity: "best_hot"
      }
    ]
  },
  {
    id: "sour-soup",
    name: "Canh chua",
    description: "Canh nên nấu gần cuối để giữ vị tươi.",
    category: "soup",
    tags: ["bếp", "nồi", "gần cuối"],
    preferredFinishWindow: "hot_at_end",
    tasks: [
      {
        id: "soup-prep",
        dishId: "sour-soup",
        name: "Sơ chế nguyên liệu canh",
        description: "Rửa rau, cắt cà chua, dứa và chuẩn bị me.",
        durationMinutes: 10,
        type: "active",
        resources: [
          { type: "human", amount: 1 },
          { type: "knife_board", amount: 1 }
        ],
        dependsOn: []
      },
      {
        id: "soup-cook",
        dishId: "sour-soup",
        name: "Nấu canh chua",
        description: "Nấu nước canh, nêm chua ngọt và cho rau vào cuối.",
        durationMinutes: 20,
        type: "active",
        resources: [
          { type: "human", amount: 1 },
          { type: "stove", amount: 1 },
          { type: "pot", amount: 1 }
        ],
        dependsOn: ["soup-prep"],
        heatSensitivity: "best_hot"
      }
    ]
  },
  {
    id: "boiled-vegetables",
    name: "Rau luộc",
    description: "Rau nên làm sát giờ ăn.",
    category: "vegetable",
    tags: ["nhanh", "ăn nóng", "bếp"],
    preferredFinishWindow: "serve_immediately",
    tasks: [
      {
        id: "veg-wash",
        dishId: "boiled-vegetables",
        name: "Rửa rau",
        description: "Nhặt và rửa rau sạch.",
        durationMinutes: 5,
        type: "active",
        resources: [{ type: "human", amount: 1 }],
        dependsOn: []
      },
      {
        id: "veg-boil",
        dishId: "boiled-vegetables",
        name: "Luộc rau",
        description: "Luộc nhanh, vớt ra và dùng ngay.",
        durationMinutes: 7,
        type: "active",
        resources: [
          { type: "human", amount: 1 },
          { type: "stove", amount: 1 },
          { type: "pot", amount: 1 }
        ],
        dependsOn: ["veg-wash"],
        heatSensitivity: "must_be_hot"
      }
    ]
  },
  {
    id: "fried-eggs",
    name: "Trứng chiên",
    description: "Món phụ rất nhanh, nên làm cuối.",
    category: "side",
    tags: ["chảo", "rất nhanh", "ăn nóng"],
    preferredFinishWindow: "serve_immediately",
    tasks: [
      {
        id: "egg-beat",
        dishId: "fried-eggs",
        name: "Đánh trứng",
        description: "Đánh trứng với hành lá và gia vị.",
        durationMinutes: 3,
        type: "active",
        resources: [{ type: "human", amount: 1 }],
        dependsOn: []
      },
      {
        id: "egg-fry",
        dishId: "fried-eggs",
        name: "Chiên trứng",
        description: "Chiên trứng vàng hai mặt và dọn nóng.",
        durationMinutes: 5,
        type: "active",
        resources: [
          { type: "human", amount: 1 },
          { type: "stove", amount: 1 },
          { type: "pan", amount: 1 }
        ],
        dependsOn: ["egg-beat"],
        heatSensitivity: "must_be_hot"
      }
    ]
  },
  {
    id: "fried-fish",
    name: "Cá chiên",
    description: "Cá cần ướp ngắn và chiên gần giờ ăn.",
    category: "main",
    tags: ["chảo", "bếp", "ăn nóng"],
    preferredFinishWindow: "serve_immediately",
    tasks: [
      {
        id: "fish-prep",
        dishId: "fried-fish",
        name: "Sơ chế cá",
        description: "Rửa cá, thấm khô và khứa nhẹ.",
        durationMinutes: 8,
        type: "active",
        resources: [
          { type: "human", amount: 1 },
          { type: "knife_board", amount: 1 }
        ],
        dependsOn: []
      },
      {
        id: "fish-marinate",
        dishId: "fried-fish",
        name: "Ướp cá",
        description: "Ướp cá với muối, tiêu và ít nghệ.",
        durationMinutes: 12,
        type: "passive",
        resources: [],
        dependsOn: ["fish-prep"]
      },
      {
        id: "fish-fry",
        dishId: "fried-fish",
        name: "Chiên cá",
        description: "Chiên cá vàng giòn và để ráo dầu.",
        durationMinutes: 18,
        type: "active",
        resources: [
          { type: "human", amount: 1 },
          { type: "stove", amount: 1 },
          { type: "pan", amount: 1 }
        ],
        dependsOn: ["fish-marinate"],
        heatSensitivity: "must_be_hot"
      }
    ]
  },
  {
    id: "tofu-tomato",
    name: "Đậu hũ sốt cà",
    description: "Món chính nhẹ, cần chảo và bếp.",
    category: "main",
    tags: ["chảo", "bếp", "nhẹ"],
    preferredFinishWindow: "hot_at_end",
    tasks: [
      {
        id: "tofu-prep",
        dishId: "tofu-tomato",
        name: "Cắt đậu và cà chua",
        description: "Cắt đậu hũ, cà chua và hành.",
        durationMinutes: 8,
        type: "active",
        resources: [
          { type: "human", amount: 1 },
          { type: "knife_board", amount: 1 }
        ],
        dependsOn: []
      },
      {
        id: "tofu-sauce",
        dishId: "tofu-tomato",
        name: "Sốt đậu hũ",
        description: "Áp chảo đậu, nấu sốt cà và rim cho thấm.",
        durationMinutes: 15,
        type: "active",
        resources: [
          { type: "human", amount: 1 },
          { type: "stove", amount: 1 },
          { type: "pan", amount: 1 }
        ],
        dependsOn: ["tofu-prep"],
        heatSensitivity: "best_hot"
      }
    ]
  },
  {
    id: "water-spinach-garlic",
    name: "Rau muống xào tỏi",
    description: "Xào nhanh, ngon nhất khi còn nóng.",
    category: "vegetable",
    tags: ["chảo", "nhanh", "ăn nóng"],
    preferredFinishWindow: "serve_immediately",
    tasks: [
      {
        id: "spinach-prep",
        dishId: "water-spinach-garlic",
        name: "Nhặt rau và đập tỏi",
        description: "Nhặt rau muống, rửa sạch và đập tỏi.",
        durationMinutes: 8,
        type: "active",
        resources: [
          { type: "human", amount: 1 },
          { type: "knife_board", amount: 1 }
        ],
        dependsOn: []
      },
      {
        id: "spinach-stir-fry",
        dishId: "water-spinach-garlic",
        name: "Xào rau muống",
        description: "Xào lửa lớn với tỏi và nêm nhanh.",
        durationMinutes: 6,
        type: "active",
        resources: [
          { type: "human", amount: 1 },
          { type: "stove", amount: 1 },
          { type: "pan", amount: 1 }
        ],
        dependsOn: ["spinach-prep"],
        heatSensitivity: "must_be_hot"
      }
    ]
  },
  {
    id: "ginger-chicken",
    name: "Gà kho gừng",
    description: "Món chính kho nhanh hơn thịt kho.",
    category: "main",
    tags: ["bếp", "nồi", "món chính"],
    preferredFinishWindow: "hot_at_end",
    tasks: [
      {
        id: "chicken-prep",
        dishId: "ginger-chicken",
        name: "Sơ chế gà và gừng",
        description: "Cắt gà, thái gừng và chuẩn bị gia vị.",
        durationMinutes: 10,
        type: "active",
        resources: [
          { type: "human", amount: 1 },
          { type: "knife_board", amount: 1 }
        ],
        dependsOn: []
      },
      {
        id: "chicken-marinate",
        dishId: "ginger-chicken",
        name: "Ướp gà",
        description: "Ướp gà với nước mắm, gừng và tiêu.",
        durationMinutes: 15,
        type: "passive",
        resources: [],
        dependsOn: ["chicken-prep"]
      },
      {
        id: "chicken-cook",
        dishId: "ginger-chicken",
        name: "Kho gà",
        description: "Kho đến khi gà chín và nước kho vừa sánh.",
        durationMinutes: 25,
        type: "passive",
        resources: [
          { type: "stove", amount: 1 },
          { type: "pot", amount: 1 }
        ],
        dependsOn: ["chicken-marinate"],
        heatSensitivity: "best_hot"
      }
    ]
  },
  {
    id: "pumpkin-soup",
    name: "Canh bí đỏ",
    description: "Canh đơn giản, có thể nấu song song với món chính.",
    category: "soup",
    tags: ["bếp", "nồi", "dịu nhẹ"],
    preferredFinishWindow: "hot_at_end",
    tasks: [
      {
        id: "pumpkin-prep",
        dishId: "pumpkin-soup",
        name: "Cắt bí đỏ",
        description: "Gọt vỏ, cắt bí đỏ và chuẩn bị hành ngò.",
        durationMinutes: 8,
        type: "active",
        resources: [
          { type: "human", amount: 1 },
          { type: "knife_board", amount: 1 }
        ],
        dependsOn: []
      },
      {
        id: "pumpkin-cook",
        dishId: "pumpkin-soup",
        name: "Nấu canh bí đỏ",
        description: "Nấu bí mềm, nêm vừa ăn và tắt bếp.",
        durationMinutes: 18,
        type: "active",
        resources: [
          { type: "human", amount: 1 },
          { type: "stove", amount: 1 },
          { type: "pot", amount: 1 }
        ],
        dependsOn: ["pumpkin-prep"],
        heatSensitivity: "best_hot"
      }
    ]
  }
];

export const getDishById = (dishId: string) =>
  demoDishes.find((dish) => dish.id === dishId);

export const estimateDishMinutes = (dish: Dish) =>
  dish.tasks.reduce((sum, task) => sum + task.durationMinutes, 0);
