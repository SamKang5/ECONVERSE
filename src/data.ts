import { Course, PetAccessory, SocialPost } from "./types";

export const INITIAL_COURSES: Course[] = [
  {
    id: "econ-101",
    title: "Economics 101: Giải Mã Nền Kinh Tế",
    slug: "giai-ma-nen-kinh-te",
    description: "Khám phá quy luật vận hành của dòng tiền, xã hội và thị trường thông qua ví dụ trà sữa và lạm phát siêu thực tế, dí dỏm.",
    category: "economics",
    duration: "45 phút",
    icon: "TrendingUp",
    accentColor: "emerald",
    lessons: [
      {
        id: "econ-l1",
        title: "Bài 1: Cung & Cầu - Trận Chiến Trà Sữa",
        shortDescription: "Tại sao trà sữa lại tăng giá vùn vụt hay giảm giá sập sàn? Tìm hiểu quy luật chi phối mọi vật giá.",
        duration: "15 phút",
        youtubeId: "dQw4w9WgXcQ", // Placeholder
        pointsReward: 50,
        videoScript: [
          {
            role: "Youtuber",
            text: "Chào các bạn trẻ Gen Z, welcome back to kênh Lóng Kinh Tế! Hôm nay tụi mình sẽ nói về một chủ đề 'đau ví' nhất: TRÀ SỮA!",
            action: "Cầm cốc trà sữa trân châu lắc lự"
          },
          {
            role: "Học sinh",
            text: "Anh ơi, tự dưng hôm nay quán ruột tăng giá từ 35k lên tận 60k một ly, trong khi em chỉ có đúng 40k! Sốc bay màu thực sự ạ!",
            action: "Khuôn mặt mếu máo dở khóc dở cười"
          },
          {
            role: "Youtuber",
            text: "Đó chính là CUNG và CẦU đó em ơi! Quy luật Cung Cầu chính là 'bàn tay vô hình' điều khiển mọi thứ trên thế giới này, từ cái đùi gà chiên tới cái card đồ hoạ để chơi game.",
            action: "Hiện hiệu ứng bàn tay mờ ảo bay lơ lửng"
          },
          {
            role: "Youtuber",
            text: "Hiểu đơn giản: CẦU là lượng người MUỐN và CÓ TIỀN mua ly trà sữa đó. CUNG là số lượng ly mà quán CÓ KHẢ NĂNG pha chế ra.",
            action: "Sơ đồ Cung Cầu dạng vẽ tay hiện lên vui nhộn"
          },
          {
            role: "Meme",
            text: "Ví dụ: Ngày mưa tầm tã, ai cũng muốn rúc trong nhà làm ly trà sữa ấm nóng (CẦU tăng cực mạnh!). Nhưng shipper ngại đi, quán thiếu nhân viên xếp hàng (CUNG tụt thảm hại). Úm ba la... giá ly trà sữa sẽ bị đẩy bay lên trời!",
            action: "Hiển thị ảnh meme chó Shiba khóc ròng rã"
          },
          {
            role: "Youtuber",
            text: "Ngược lại, nếu một ngày 100 quán trà sữa mọc lên quanh trường bạn (CUNG siêu khổng lồ) nhưng học sinh lại đang chuyển sang trend uống matcha (CẦU giảm). Để cứu vãn, các quán phải đua nhau giảm giá hạ nhiệt. Điểm cân bằng chính là mức giá hợp lý nhất mà cả người bán và người mua đều vui vẻ chốt đơn!"
          }
        ],
        summary: {
          title: "Tóm Tắt: Quy Luật Cung - Cầu",
          points: [
            "Cầu (Demand): Lòng ham muốn kèm khả năng thanh toán của người mua đối với một mức giá trong thời gian nhất định.",
            "Cung (Supply): Số hàng hoá/dịch vụ mà người bán sẵn sàng và có khả năng bán ra thị trường ở các mức giá khác nhau.",
            "Giá cân bằng (Equilibrium Price): Điểm giao nhau giữa đường Cung và đường Cầu. Tại đây, số lượng người muốn mua vừa vặn bằng số lượng người muốn bán.",
            "Khi Cầu > Cung: Hàng hóa khan hiếm, giá thường tăng mạnh.",
            "Khi Cung > Cầu: Hàng hóa dư thừa, giá có xu hướng giảm sâu để kích cầu."
          ]
        },
        quiz: [
          {
            id: "econ-q1-1",
            question: "Hiện tượng nào xảy ra khi trào lưu săn lùng mô hình Labubu bùng nổ, nhưng lượng sản xuất của hãng cực kỳ hạn chế?",
            options: [
              "Cung vượt quá Cầu, giá máy giảm mạnh.",
              "Cầu vượt quá Cung, giá mô hình trên chợ đen bị đẩy lên gấp 3-4 lần.",
              "Thị trường đạt mức giá cân bằng tức thì.",
              "Không ảnh hưởng gì đến giá cả mặt hàng."
            ],
            correctAnswer: 1,
            explanation: "Do số lượng muốn mua (Cầu) tăng vọt vượt xa khả năng cung ứng hạn chế (Cung), người mua sẵn sàng trả giá cao để sở hữu phẩm vật khan hiếm, đẩy giá bán lên rất cao."
          },
          {
            id: "econ-q1-2",
            question: "Điểm Cân Bằng (Market Equilibrium) đạt được khi nào?",
            options: [
              "Khi người bán ép giá tối đa có thể.",
              "Khi người mua không còn đồng nào trong túi.",
              "Khi lượng Cung bằng lượng Cầu tại một mức giá thống nhất.",
              "Khi chính phủ phát miễn phí hàng hoá cho toàn quốc."
            ],
            correctAnswer: 2,
            explanation: "Điểm cân bằng ổn định thị trường chỉ xuất hiện tại giao điểm của cung và cầu, tức lượng người bán muốn bán trùng khớp lượng người mua muốn mua."
          }
        ]
      },
      {
        id: "econ-l2",
        title: "Bài 2: Lạm Phát - Tại Sao Tờ 500k Cứ Bé Dần?",
        shortDescription: "Năm xưa 10k mua được bát phở no nê, giờ 10k chỉ gửi xe được nửa buổi. Hãy vạch mặt hung thủ thầm lặng mang tên Lạm Phát.",
        duration: "15 phút",
        youtubeId: "dQw4w9WgXcQ",
        pointsReward: 60,
        videoScript: [
          {
            role: "Youtuber",
            text: "Ủy ban bóc phốt hôm nay xin được triệu hồi một thế lực siêu nhiên... lẳng lặng rút ruột heo đất của bạn mà bạn không hề hay biết. Tên của hắn là: LẠM PHÁT!",
            action: "Nhạc kinh dị nổi lên, hình ảnh tờ tiền bay mất góc"
          },
          {
            role: "Thầy giáo",
            text: "E hèm, định nghĩa học thuật: Lạm phát là sự tăng mức giá chung liên tục của hàng hóa và dịch vụ theo thời gian, dẫn tới mất giá trị của một loại tiền tệ.",
            action: "Kính cận phản quang sáng loà nghiêm nghị"
          },
          {
            role: "Youtuber",
            text: "Dịch sang tiếng người: Ngày xưa năm 2012, mẹ cho bạn 15k là bạn ăn được tô hủ tiếu gõ ngập tràn topping. Bây giờ năm 2026, 15k đó chỉ đủ mua cái quẩy chiên ăn kèm!",
            action: "Meme ông chú bất ngờ ngã lộn nhào"
          },
          {
            role: "Youtuber",
            text: "Vì sao lạm phát xảy ra? Có 2 lý do chính: 1. Chi phí đẩy (xăng tăng, nguyên liệu tăng khiến chủ quán phải tăng giá để giữ lãi). 2. Cầu kéo (kinh tế phát triển, ai cũng dư dả, tranh nhau mua đồ khiến người bán tự tin nâng giá)."
          },
          {
            role: "Meme",
            text: "Ủa thế ngân hàng nhà nước cứ in thật nhiều tiền phát cho dân nghèo là xong đúng không anh? Ez game giàu sang!",
            action: "Mắt lấp lánh như nhân vật anime"
          },
          {
            role: "Youtuber",
            text: "Oh no! Đừng bao giờ làm thế! Nếu ai cũng có bao tải tiền, nhưng số lượng gà, vịt, trà sữa trên đời vẫn thế, thì người ta sẽ đấu giá những con gà đó với giá cắt cổ. Kết quả là đồng tiền biến thành giấy lộn như ở Zimbabwe hay Venezuela ngay!"
          }
        ],
        summary: {
          title: "Tóm Tắt: Bản Chất Của Lạm Phát",
          points: [
            "Lạm phát (Inflation): Hiện tượng đồng tiền bị giảm sức mua (purchasing power). Cùng một số tiền nhưng mua được ít đồ hơn.",
            "Lạm phát do cầu kéo: Sức mua của xã hội tăng quá nhanh, kéo giá cả tăng lên theo.",
            "Lạm phát do chi phí đẩy: Giá nguyên liệu đầu vào (điện, xăng, thuế, lương) tăng khiến chi phí sản xuất tăng, buộc giá bán lẻ sản phẩm tăng.",
            "Tác hại của in tiền quá mức: Tiền mặt chỉ là vật ngang giá. Nếu lượng tiền in ra nhiều hơn tốc độ sản xuất của cải, giá trị đồng tiền sẽ sụp đổ (Siêu lạm phát)."
          ]
        },
        quiz: [
          {
            id: "econ-q2-1",
            question: "Nếu một quốc gia thiếu hụt của cải nhưng quyết định in thêm 10 lần lượng tiền mặt để phân phát, điều gì sẽ xảy ra?",
            options: [
              "Mọi người dân đều giàu lên gấp 10 lần thực tế.",
              "Giá trị đồng nội tệ tăng vọt so với đô la Mỹ.",
              "Xảy ra siêu lạm phát dữ dội, đồng tiền mất giá trị mua sắm gốc.",
              "Nước đó trở thành cường quốc kinh tế số 1."
            ],
            correctAnswer: 2,
            explanation: "In thêm tiền không làm tăng sản lượng hàng hóa thực tế. Nó chỉ làm pha loãng giá trị tiền tệ, dẫn tới việc mọi người tranh nhau dùng nhiều tiền hơn để mua một lượng của cải không đổi, gây mất giá đồng tiền thảm hại."
          },
          {
            id: "econ-q2-2",
            question: "Đâu là ví dụ điển hình của 'Lạm phát do chi phí đẩy'?",
            options: [
              "Dân chúng đổ xô đi mua bánh trung thu khiến bánh tăng giá.",
              "Giá xăng dầu thế giới tăng vọt làm giá cước vận chuyển, đồ ăn, rau củ đồng loạt tăng theo.",
              "Nhà nước giảm lãi suất cho vay mua sắm cá nhân.",
              "Doanh nghiệp khuyến mãi mua 1 tặng 1 giảm giá sốc."
            ],
            correctAnswer: 1,
            explanation: "Xăng dầu tăng là nguyên liệu đầu vào (chi phí vận hành/sản xuất). Khi chi phí đầu vào tăng, nhà sản xuất bắt buộc phải đẩy giá bán ra cao hơn để không bị lỗ vốn."
          }
        ]
      }
    ]
  },
  {
    id: "finance-101",
    title: "Finance Core: Chủ Động Đồng Tiền",
    slug: "chu-dong-dong-tien",
    description: "Nhận thức sớm về tư duy quản lý tài chính cá nhân, thiết lập ngân sách chi tiêu tối ưu và hiểu cặn kẽ cách vận hành của lãi suất ngân hàng.",
    category: "finance",
    duration: "60 phút",
    icon: "PiggyBank",
    accentColor: "blue",
    lessons: [
      {
        id: "fin-l1",
        title: "Bài 1: Công Thức 50/30/20 - Quản Lý Tiền Đỉnh Cao",
        shortDescription: "Bạn nhận thức được tiền túi bay đi đâu hết cuối tháng chưa? Áp dụng ngay công thức chia ví thần thánh của triệu phú.",
        duration: "18 phút",
        youtubeId: "dQw4w9WgXcQ",
        pointsReward: 50,
        videoScript: [
          {
            role: "Youtuber",
            text: "Chào mừng các bạn đến với góc 'Làm giàu không khó nhưng giữ tiền thì cực khó'! Bạn đã bao giờ rơi vào cảnh đầu tháng ăn bò né, cuối tháng húp mì tôm chưa?",
            action: "Hình ảnh chú heo đất trống rỗng vang lên tiếng lách cách"
          },
          {
            role: "Học sinh",
            text: "Dạ em đây ạ! Đầu tháng bố mẹ cho tiền tiêu vặt em liền nạp game, mua trà sữa sang chảnh. Đến ngày 20 là em phải ăn bám bạn bè rồi sếp ơi...",
            action: "Gãi đầu gãi tai cười trừ bẽ bàng"
          },
          {
            role: "Youtuber",
            text: "Đó là vì bạn chưa biết chia tiền vào các 'hộp tài chính'. Hãy nhớ công thức vàng cứu cánh: 50/30/20!",
            action: "Hiện bánh xe tỷ lệ 50%, 30%, 20% lấp lánh neon"
          },
          {
            role: "Youtuber",
            text: "50% dành cho Thiết Yếu (Needs): Tiền ăn trưa, tiền xăng, giáo trình, tiền đóng học. Những thứ KHÔNG CÓ LÀ KHÔNG SỐNG ĐƯỢC.",
            action: "Biểu tượng bát cơm và quyển sách học tập"
          },
          {
            role: "Youtuber",
            text: "30% dành cho Sở Thích (Wants): Nạp game, mua album idol, đi trà sữa chém gió. Những thứ CÓ THÌ VUI, KHÔNG CÓ CŨNG KHÔNG SAO.",
            action: "Biểu tượng máy chơi game và vé xem concert nhạc"
          },
          {
            role: "Youtuber",
            text: "Và quan trọng nhất: 20% còn lại cất ngay vào lợn đất để Tiết Kiệm & Đầu Tư (Savings). Đây chính là tấm khiên hộ mệnh bảo vệ bạn khỏi những cơn sốc ví đột xuất!"
          }
        ],
        summary: {
          title: "Tóm Tắt: Quy Luật Sắp Xếp Ngân Sách 50/30/20",
          points: [
            "Needs (50%): Các chi phí sống còn bắt buộc phải chi trả hàng tháng.",
            "Wants (30%): Phục vụ đam mê, sở thích, giải trí cá nhân để cuộc sống bớt nhàm chán.",
            "Savings (20%): Quỹ dự phòng khẩn cấp, tiết kiệm mua đồ lớn hoặc đầu tư sinh lời trong tương lai.",
            "Tác dụng cốt lõi: Giúp bạn luôn kiểm soát được dòng tiền, không bao giờ rơi vào nợ nần và tự tạo ra thói quen tích lũy tài sản từ rất sớm."
          ]
        },
        quiz: [
          {
            id: "fin-q1-1",
            question: "Nếu bạn có 1,000,000 VND tiền tiêu vặt một tháng, theo công thức 50/30/20, số tiền tối thiểu bạn cần trích lập lập tức để Tiết Kiệm (Savings) là bao nhiêu?",
            options: [
              "500,000 VND",
              "300,000 VND",
              "200,000 VND",
              "0 VND, tiêu hết rồi tính tiếp."
            ],
            correctAnswer: 2,
            explanation: "20% của 1,000,000 VND là 200,000 VND. Trích lập tiết kiệm ngay từ đầu tháng giúp bạn tránh cám dỗ tiêu lạm vào quỹ dự phòng."
          },
          {
            id: "fin-q1-2",
            question: "Khoản tiền trả nợ học phí hoặc tiền đong gạo ăn hàng ngày xếp vào nhóm nào?",
            options: [
              "Sở thích (Wants)",
              "Thiết yếu (Needs)",
              "Tiết kiệm (Savings)",
              "Chi tiêu lãng phí"
            ],
            correctAnswer: 1,
            explanation: "Ăn học và sinh hoạt tối thiểu là những nhu cầu bắt buộc phải đáp ứng để duy trì cuộc sống khỏe mạnh và học tập cơ bản, do đó thuộc nhóm Thiết yếu (Needs)."
          }
        ]
      },
      {
        id: "fin-l2",
        title: "Bài 2: Sức Mạnh Kỳ Diệu Của Lãi Kép",
        shortDescription: "Albert Einstein từng gọi đây là kỳ quan thứ 8 của nhân loại. Tìm hiểu cách một khoản tiền nhỏ hóa khổng lồ theo thời gian.",
        duration: "20 phút",
        youtubeId: "dQw4w9WgXcQ",
        pointsReward: 70,
        videoScript: [
          {
            role: "Youtuber",
            text: "Nếu mình cho bạn lựa chọn: Nhận ngay 1 tỷ VND hôm nay HOẶC nhận 1 đồng xu tự động nhân đôi giá trị mỗi ngày trong vòng 30 ngày. Bạn chọn cái nào?",
            action: "Cân đong đo đếm hai bên tay"
          },
          {
            role: "Meme",
            text: "Ối dời ơi, 1 tỷ sờ sờ ra đó em hốt liền đi mua xe máy với flex liền chứ lựa tiền xu làm chi cho mệt mỏi anh ơi!",
            action: "Mắt lấp lánh tiền đô"
          },
          {
            role: "Youtuber",
            text: "Sai lầm chí mạng nha! Đồng xu nhân đôi mỗi ngày sau 30 ngày sẽ biến thành hơn... 5 TỶ VND đó! Thần kỳ đúng không? Đó chính là phép màu của LÃI KÉP!",
            action: "Một bảng đồ thị dựng đứng xuất hiện vèo vèo"
          },
          {
            role: "Thầy giáo",
            text: "Lãi kép (Compound Interest) là phần lãi phát sinh khi tiền lãi cũ được cộng dồn trực tiếp vào vốn gốc ban đầu để tiếp tục sinh ra lãi mới cho kỳ tiếp theo. Hay dân gian gọi là 'Lãi mẹ đẻ lãi con'."
          },
          {
            role: "Youtuber",
            text: "Hai yếu tố cốt lõi giúp lãi kép bùng nổ là: KIÊN TRÌ và THỜI GIAN. Bạn đầu tư càng sớm, vòng quay lãi mẹ đẻ lãi con càng nhiều, số tiền tích lũy càng phình to khủng khiếp về sau."
          }
        ],
        summary: {
          title: "Tóm Tắt: Sức Mạnh Lãi Kép",
          points: [
            "Công thức lãi kép: Tiền tích luỹ kỳ sau = Tiền gốc + Lãi kỳ trước, liên tục tái đầu tư.",
            "Bí quyết cốt lõi: Bắt đầu tiết kiệm và đầu tư càng sớm càng tốt, dù là số tiền cực nhỏ.",
            "Tác nhân thời gian: Biểu đồ lãi kép luôn dốc đứng ở giai đoạn sau nhờ tích luỹ dồn dập.",
            "Không rút giữa chừng: Sự ngắt quãng sẽ phá hủy chu kỳ nhân cấp của dòng vốn."
          ]
        },
        quiz: [
          {
            id: "fin-q2-1",
            question: "Lãi kép (Compound Interest) được hiểu đúng nhất là gì?",
            options: [
              "Khoản tiền lãi cố định nhận từ ngân hàng mỗi năm.",
              "Hình thức vay tiền lãi siêu cao bên ngoài xã hội đen.",
              "Hiện tượng tiền lãi nhận được tiếp tục cộng dồn vào gốc để tính lãi cho chu kỳ sau.",
              "Đọc cuốn sách tài chính 2 lần một ngày."
            ],
            correctAnswer: 2,
            explanation: "Tái tục đầu tư tiền lãi vào vốn gốc chính là cơ chế 'lãi mẹ đẻ lãi con' tạo nên lãi kép."
          }
        ]
      }
    ]
  }
];

export const SHOP_ITEMS: PetAccessory[] = [
  // Glasses
  {
    id: "acc-g1",
    name: "Kính râm Ngầu lòi",
    category: "glasses",
    price: 30,
    unlocked: false,
    svgItem: "ThugLifeGlasses",
    description: "Kính râm đen phong cách hiphop cực ngầu cho Pet.",
    cssStyle: "scale-110 translate-y-2 opacity-95"
  },
  {
    id: "acc-g2",
    name: "Kính Cận Trí Thức",
    category: "glasses",
    price: 50,
    unlocked: false,
    svgItem: "NerdGlasses",
    description: "Kính gọng tròn giúp Pet trông thông thái học rộng tài cao.",
    cssStyle: "scale-105 translate-y-2"
  },
  {
    id: "acc-g3",
    name: "Kính Trọng Lực Cyberpunk",
    category: "glasses",
    price: 90,
    unlocked: false,
    svgItem: "CyberGlasses",
    description: "Kính Hologram tương lai phát sáng xanh neon siêu sành điệu.",
    cssStyle: "scale-110 translate-y-2"
  },

  // Hats
  {
    id: "acc-h1",
    name: "Mũ Snapback Rapper",
    category: "hat",
    price: 40,
    unlocked: false,
    svgItem: "SnapbackHat",
    description: "Mũ lưỡi trai đội ngược cho chú Pet cá tính.",
    cssStyle: "scale-100 -translate-y-1"
  },
  {
    id: "acc-h2",
    name: "Mũ Tốt Nghiệp Thủ Khoa",
    category: "hat",
    price: 80,
    unlocked: false,
    svgItem: "GraduationCap",
    description: "Mũ trạng nguyên danh giá chứng nhận học bá kinh tế học.",
    cssStyle: "scale-110 -translate-y-3"
  },
  {
    id: "acc-h3",
    name: "Mũ Thám Tử Sherlock",
    category: "hat",
    price: 110,
    unlocked: false,
    svgItem: "DetectiveHat",
    description: "Mũ dạ thám tử tài ba săn lùng cơ hội đầu tư hời nhất.",
    cssStyle: "scale-105 -translate-y-2"
  },

  // Clothing
  {
    id: "acc-c1",
    name: "Áo Choàng Hoàng Gia",
    category: "clothing",
    price: 60,
    unlocked: false,
    svgItem: "RoyalCloak",
    description: "Áo choàng đỏ sang chảnh tôn vinh quý tộc tài chính.",
    cssStyle: "scale-100"
  },
  {
    id: "acc-c2",
    name: "Vest Tổng Tài Đô La",
    category: "clothing",
    price: 130,
    unlocked: false,
    svgItem: "DollarSuit",
    description: "Bộ vest đen lịch lãm in chìm biểu tượng đô-la may mắn.",
    cssStyle: "scale-105"
  },

  // Background
  {
    id: "acc-b1",
    name: "Nền Sàn Giao Dịch Phố Wall",
    category: "background",
    price: 50,
    unlocked: false,
    svgItem: "WallStreetBg",
    description: "Phông nền biểu đồ tài chính xanh đỏ nhảy múa sôi động.",
    cssStyle: "bg-radial from-slate-800 to-indigo-950"
  },
  {
    id: "acc-b2",
    name: "Nền Kho Tiền Vàng Khổng Lồ",
    category: "background",
    price: 100,
    unlocked: false,
    svgItem: "GoldVaultBg",
    description: "Góc phòng chứa đầy thỏi vàng lấp lánh như vua Scrooge McDuck.",
    cssStyle: "bg-radial from-amber-900 to-slate-950"
  }
];

export const MOCK_SOCIAL_POSTS: SocialPost[] = [
  {
    id: "sp-1",
    platform: "instagram",
    type: "meme",
    title: "[MEME] Nỗi sầu ví tiền rỗng tuếch ngày 15",
    content: "Nửa đời hương phấn đầu tháng ăn Buffet bò Kobe, nay giữa tháng nhìn gói mì tôm tặc lưỡi: 'Ăn mì gói cho nó thanh đạm tốt cho sức khỏe!' 🤡 \n\nHãy vào ngay web để học quy tắc 50/30/20 cứu vớt túi tiền của mình trước khi quá muộn các bạn ơi! Link bio đang đợi bồ đó nha!",
    likes: 1250,
    comments: 89,
    date: "Hôm qua",
    tags: ["MemeKinhTe", "HocSinhTHPT", "503020Rule", "ECONVERSE"]
  },
  {
    id: "sp-2",
    platform: "instagram",
    type: "infographic",
    title: "[INFOGRAPHIC] 4 Bước Khởi Động Siêu Lực Lãi Kép",
    content: "Các bạn trẻ nghe danh Lãi Kép là kỳ quan thứ 8 đúng không? Nhưng làm sao để Gen Z bắt đầu với số vốn lẻ tẻ từ tiền tiết kiệm ăn sáng? \n👉 Bước 1: Trích lập cố định 10% tiền tiêu vặt mỗi tuần.\n👉 Bước 2: Bỏ ống heo đất hoặc gửi tiết kiệm tích lũy.\n👉 Bước 3: Tuyệt đối không xén bớt tiền tiết kiệm nửa chừng.\n👉 Bước 4: Kiên trì duy trì tối thiểu 1 năm trở lên để nhìn thấy quả chín ngọt!",
    likes: 2400,
    comments: 142,
    date: "3 ngày trước",
    tags: ["TaiChinhCaNhan", "MeoTietKiem", "LaiKep", "ECONVERSEGenZ"]
  },
  {
    id: "sp-3",
    platform: "facebook",
    type: "depth",
    title: "[BÀI VIẾT CHUYÊN SÂU] Bản Chất Thật Sự Của Lạm Phát: Tại Sao In Nhiều Tiền Không Giải Quyết Được Sự Nghèo Khó?",
    content: "Chúng ta thường thắc mắc: 'Tại sao ngân hàng nhà nước không in thật nhiều tiền rồi phát cho mỗi người nghèo vài chục triệu để xóa nghèo?'. Để trả lời câu hỏi trực diện này, chúng ta cần hiểu bản chất của Tiền tệ.\n\nTiền thực chất chỉ là một 'vật ngang giá chung' – một tờ giấy đại diện cho công sức lao động và của cải thực tế trong xã hội (như gạo, quần áo, xăng dầu, tivi). Nếu ngày mai, tổng số hàng hoá của quốc gia không đổi, nhưng số tiền lưu thông thình lình tăng gấp 10 lần, thì lập tức, người bán sẽ bán đắt hơn gấp 10 lần vì lượng cầu tranh mua quá lớn. Tiền mặt bấy giờ rơi vào tình trạng mất giá thảm hại.\n\nĐọc bài viết chi tiết để hiểu sâu về Siêu Lạm Phát tại Zimbabwe và cách nền kinh tế cân đối sức khỏe tiền mặt tại website của dự án ngay hôm nay!",
    likes: 450,
    comments: 63,
    shares: 88,
    date: "4 ngày trước",
    tags: ["KinhTeHocViMo", "LamPhat", "HocKinhTeThucTe", "DuAnGiaoDuc"]
  },
  {
    id: "sp-4",
    platform: "facebook",
    type: "bts",
    title: "[BEHIND THE SCENES] Một ngày làm Youtuber giảng giải Kinh Tế phong cách giải trí cực hài",
    content: "Đằng sau những video bài giảng ngắn 15 phút cười ra nước mắt trên website của tụi mình là: \n- 3 ngày ròng rã viết kịch bản chế meme, lôi sách giáo khoa vĩ mô ra 'dịch' thành ngôn ngữ trà sữa teen.\n- 5 tiếng ghi hình cười bể bụng vì YouTuber bí từ ríu cả lưỡi.\n- Đội ngũ Designer thức thâu đêm vẽ tay hơn 50 asset biểu cảm meme cực nhộn để chèn vào video.\n\nTất cả vì một mục tiêu duy nhất: Đưa kiến thức tài chính kinh tế khô khan trở nên ngon nghẻ, dễ nuốt nhất cho các bạn học sinh! Đăng ký tài khoản học miễn phí ngay hôm nay nhé!",
    likes: 310,
    comments: 42,
    shares: 25,
    date: "1 tuần trước",
    tags: ["ChuyeHauKy", "ECONVERSETeam", "PheKinhTe", "HieuUngMemes"]
  }
];
