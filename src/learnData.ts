import type { CourseCategoryCard, CourseModule } from "./types";

export const COURSE_CATEGORY_CARDS: CourseCategoryCard[] = [
  {
    category: "economics",
    title: "Kinh tế cơ bản",
    description:
      "Đi từ các quy luật nền tảng đến cách thị trường phản ứng trong đời sống hằng ngày.",
    icon: "TrendingUp",
    accentColor: "lime",
  },
  {
    category: "finance",
    title: "Tài chính cá nhân",
    description:
      "Học cách quản lý tiền, tích lũy thông minh và đặt mục tiêu tài chính rõ ràng hơn.",
    icon: "PiggyBank",
    accentColor: "purple",
  },
];

export const COURSE_MODULES: CourseModule[] = [
  {
    id: "module-1",
    title: "Unit 1: Cung và Cầu",
    description:
      "Đi từ quy luật cầu, quy luật cung đến điểm cân bằng và các ngoại lệ để hiểu vì sao giá cả thị trường luôn biến động.",
    category: "economics",
    icon: "TrendingUp",
    lessons: [
      {
        id: "lesson-1",
        order: "1A",
        title: "Quy luật Cầu",
        shortDescription:
          "Càng đắt càng chê, càng rẻ càng mê: hiểu vì sao giá và lượng cầu luôn đi ngược chiều.",
        duration: "08 phút",
        videoUrl: "placeholder",
        overview:
          "Tập 1A giải thích quy luật cầu bằng những ví dụ rất gần với học sinh: giá càng cao thì người mua càng chùn tay, giá càng thấp thì lượng cầu càng tăng.",
        mainContentTitle: "Quy luật cầu hoạt động ra sao?",
        mainContent: [
          "Trong điều kiện các yếu tố khác không đổi, khi giá tăng thì lượng cầu giảm; ngược lại, khi giá giảm thì lượng cầu tăng. Đây là mối quan hệ nghịch biến cơ bản giữa giá cả và hành vi mua của người tiêu dùng.",
          "Quy luật cầu được chi phối bởi hai cơ chế quen thuộc. Hiệu ứng thay thế khiến người mua chuyển sang món rẻ hơn khi một món đồ trở nên quá đắt. Hiệu ứng thu nhập khiến sức mua thực tế giảm xuống, tạo cảm giác như túi tiền bị teo lại dù thu nhập danh nghĩa không đổi.",
          "Vì vậy đường cầu thường dốc xuống từ trái sang phải. Chỉ cần nhìn vào những ví dụ như sneaker giảm giá, vé concert khan hiếm hay đồ ăn hot trend, người học có thể thấy lượng cầu phản ứng rất nhanh trước thay đổi về giá.",
        ],
        objectives: [
          "Phát biểu được quy luật cầu bằng ngôn ngữ đời thường.",
          "Phân biệt hiệu ứng thay thế và hiệu ứng thu nhập.",
          "Nhận ra hình dạng dốc xuống của đường cầu trên đồ thị.",
        ],
        pointsReward: 40,
        summary: {
          title: "Tóm tắt Tập 1A: Quy luật Cầu",
          points: [
            "Khi giá tăng thì lượng cầu giảm, khi giá giảm thì lượng cầu tăng nếu các yếu tố khác giữ nguyên.",
            "Hiệu ứng thay thế khiến người mua chuyển sang món rẻ hơn khi giá mặt hàng hiện tại tăng.",
            "Hiệu ứng thu nhập làm sức mua thực tế giảm xuống, khiến người tiêu dùng cảm thấy nghèo đi.",
            "Đường cầu thông thường dốc xuống từ trái sang phải trên đồ thị.",
          ],
        },
        quiz: [
          {
            id: "lesson-1-q1",
            question:
              "Khi một đôi giày sneaker giảm giá mạnh từ 2 triệu xuống còn 200k, hiện tượng nào dễ xảy ra nhất?",
            options: [
              "Học sinh quay xe đi thẳng không thèm ngó",
              "Cả trăm người lao vào tranh nhau mua",
              "Người bán đóng cửa cửa hàng",
              "Lượng cầu giảm về mức bằng không",
            ],
            correctAnswer: 1,
            explanation:
              "Đây là ví dụ trực quan cho quy luật cầu: giá giảm sâu thường kéo lượng cầu tăng vọt.",
          },
          {
            id: "lesson-1-q2",
            question:
              "Trong điều kiện các yếu tố khác không đổi, mối quan hệ giữa giá và lượng cầu được phát biểu đúng là gì?",
            options: [
              "Khi giá tăng, lượng cầu tăng theo",
              "Khi giá giảm, lượng cầu cũng giảm theo",
              "Khi giá tăng, lượng cầu giảm xuống và ngược lại",
              "Giá cả và lượng cầu không có mối quan hệ gì",
            ],
            correctAnswer: 2,
            explanation:
              "Quy luật cầu chỉ ra mối quan hệ nghịch biến giữa giá cả và lượng cầu.",
          },
          {
            id: "lesson-1-q3",
            question:
              "Hiệu ứng thay thế tác động thế nào khi một món đồ trở nên đắt hơn?",
            options: [
              "Người mua dồn hết tiền để mua bằng được",
              "Người mua chuyển sang lựa chọn khác rẻ hơn",
              "Người mua ngừng tiêu dùng mọi hàng hóa",
              "Người mua cảm thấy mình giàu lên",
            ],
            correctAnswer: 1,
            explanation:
              "Khi giá một mặt hàng tăng, các lựa chọn thay thế rẻ hơn trở nên hấp dẫn hơn.",
          },
          {
            id: "lesson-1-q4",
            question:
              "Theo hiệu ứng thu nhập, điều gì khiến người mua phải cắt giảm chi tiêu khi giá hàng hóa tăng?",
            options: [
              "Thu nhập danh nghĩa tự động tăng",
              "Sức mua thực tế giảm, khiến họ cảm thấy nghèo đi",
              "Người mua được thưởng thêm tiền lương",
              "Mọi hàng hóa đều biến mất khỏi thị trường",
            ],
            correctAnswer: 1,
            explanation:
              "Giá tăng làm cùng một số tiền mua được ít đồ hơn, nên người tiêu dùng phải thắt chặt chi tiêu.",
          },
        ],
      },
      {
        id: "lesson-2",
        order: "1B",
        title: "Quy luật Cung",
        shortDescription:
          "Được giá thì bán, rẻ mạt thì nghỉ: hiểu vì sao người bán phản ứng mạnh với mức giá thị trường.",
        duration: "08 phút",
        videoUrl: "placeholder",
        overview:
          "Tập 1B chuyển góc nhìn sang phía người bán để giải thích vì sao giá càng cao thì lượng cung thường càng tăng.",
        mainContentTitle: "Quy luật cung vận hành thế nào?",
        mainContent: [
          "Quy luật cung nói rằng mối quan hệ giữa giá và lượng cung là đồng biến. Giá càng cao, người bán càng muốn sản xuất hoặc bày bán nhiều hơn để tận dụng lợi nhuận tốt hơn.",
          "Ngược lại, nếu giá quá thấp và không đủ bù vốn, người bán sẽ giảm sản lượng hoặc rời khỏi thị trường. Vì thế đường cung thường dốc lên từ trái sang phải, phản ánh động lực gia tăng cung khi giá tăng.",
          "Động lực cốt lõi đứng sau quy luật cung là lợi nhuận. Từ quán trà sữa đến nhà sản xuất lớn, ai cũng phản ứng trước tín hiệu giá theo cách rất thực tế: nơi nào có cơ hội lời hơn thì nguồn lực sẽ đổ về đó.",
        ],
        objectives: [
          "Phát biểu được quy luật cung bằng ví dụ gần gũi.",
          "Nhận ra đường cung dốc lên trên đồ thị.",
          "Hiểu lợi nhuận là động lực chính của người bán.",
        ],
        pointsReward: 40,
        summary: {
          title: "Tóm tắt Tập 1B: Quy luật Cung",
          points: [
            "Khi giá tăng thì lượng cung thường tăng, khi giá giảm quá thấp thì lượng cung giảm.",
            "Đường cung thông thường dốc lên từ trái sang phải trên đồ thị.",
            "Lợi nhuận là động lực cốt lõi khiến người bán tăng hay giảm sản lượng.",
            "Giá quá thấp không đủ bù vốn sẽ khiến người bán thu hẹp hoặc ngừng bán.",
          ],
        },
        quiz: [
          {
            id: "lesson-2-q1",
            question:
              "Khi giá thị trường của một ly trà sữa tăng vọt từ 30k lên 90k, phản ứng nào hợp với quy luật cung nhất?",
            options: [
              "Đóng cửa quán và đi ngủ ngay",
              "Giữ nguyên công suất như cũ",
              "Đẩy mạnh sản xuất hết công suất để bán nhiều hơn",
              "Giảm số ly làm ra mỗi ngày",
            ],
            correctAnswer: 2,
            explanation:
              "Khi giá tăng cao, người bán có động lực tăng lượng cung để tận dụng doanh thu và lợi nhuận.",
          },
          {
            id: "lesson-2-q2",
            question:
              "Đường cung trên đồ thị kinh tế học có đặc điểm nào?",
            options: [
              "Dốc xuống từ trái sang phải",
              "Dốc lên từ trái sang phải",
              "Nằm ngang song song với trục lượng",
              "Đứng thẳng song song với trục giá",
            ],
            correctAnswer: 1,
            explanation:
              "Đường cung dốc lên thể hiện mối quan hệ đồng biến giữa giá cả và lượng cung.",
          },
          {
            id: "lesson-2-q3",
            question:
              "Động lực lớn nhất chi phối hành vi của người bán trong quy luật cung là gì?",
            options: [
              "Sự đồng cảm với khó khăn của người mua",
              "Lợi nhuận kiếm được nhiều hơn trên mỗi sản phẩm",
              "Việc cắt giảm tối đa số lượng nhân viên",
              "Đam mê làm việc không cần tiền bạc",
            ],
            correctAnswer: 1,
            explanation:
              "Giá bán cao giúp biên lợi nhuận mở rộng, đó là lý do người bán muốn cung ứng nhiều hơn.",
          },
          {
            id: "lesson-2-q4",
            question:
              "Nếu giá hàng hóa trở nên quá rẻ và không đủ bù vốn, chuyện gì dễ xảy ra nhất?",
            options: [
              "Người bán càng hào hứng sản xuất gấp đôi",
              "Người bán giảm sản lượng hoặc ngừng bán",
              "Lượng cung tăng vọt ngoài thị trường",
              "Người bán chuyển sang tặng miễn phí sản phẩm",
            ],
            correctAnswer: 1,
            explanation:
              "Khi giá quá thấp, người bán không còn động lực duy trì lượng cung như trước.",
          },
        ],
      },
      {
        id: "lesson-1c",
        order: "1C",
        title: "Cung và Cầu đại chiến – Điểm cân bằng",
        shortDescription:
          "Khi cung gặp cầu, thị trường tự tìm về một mức giá cân bằng để hàng hóa bán hết và người mua chấp nhận trả.",
        duration: "09 phút",
        videoUrl: "https://www.youtube.com/embed/elHTLmaghlU",
        youtubeId: "elHTLmaghlU",
        overview:
          "Tập 1C cho thấy cung và cầu không đứng riêng lẻ mà luôn kéo nhau về điểm cân bằng của thị trường.",
        mainContentTitle: "Điểm cân bằng, dư thừa và thiếu hụt",
        mainContent: [
          "Điểm cân bằng là nơi đường cung cắt đường cầu. Tại mức giá này, lượng người bán muốn bán vừa khớp với lượng người mua muốn mua, nên hàng hóa được tiêu thụ trọn vẹn mà không bị ế cũng không bị thiếu.",
          "Nếu giá bị đẩy cao hơn điểm cân bằng, lượng cung sẽ lớn hơn lượng cầu. Thị trường rơi vào trạng thái dư thừa: hàng hóa tồn kho nhiều, người bán buộc phải hạ giá để kéo khách quay lại.",
          "Nếu giá bị kéo thấp hơn điểm cân bằng, lượng cầu sẽ vượt lượng cung. Khi đó xuất hiện thiếu hụt: người mua tranh nhau mua, sẵn sàng trả cao hơn, và chính áp lực đó kéo giá tăng trở lại gần điểm cân bằng.",
        ],
        objectives: [
          "Xác định được điểm cân bằng trên đồ thị cung cầu.",
          "Phân biệt trạng thái dư thừa và thiếu hụt.",
          "Hiểu cơ chế tự điều chỉnh của giá trên thị trường.",
        ],
        pointsReward: 45,
        summary: {
          title: "Tóm tắt Tập 1C: Điểm cân bằng",
          points: [
            "Điểm cân bằng là giao điểm của đường cung và đường cầu, nơi lượng cung bằng lượng cầu.",
            "Giá cao hơn điểm cân bằng thường gây dư thừa vì cung lớn hơn cầu.",
            "Giá thấp hơn điểm cân bằng thường gây thiếu hụt vì cầu lớn hơn cung.",
            "Thị trường có xu hướng tự điều chỉnh để quay lại gần điểm cân bằng.",
          ],
        },
        quiz: [
          {
            id: "lesson-1c-q1",
            question:
              "Điểm cân bằng xuất hiện trên đồ thị kinh tế học khi nào?",
            options: [
              "Khi đường cầu nằm hoàn toàn phía trên đường cung",
              "Khi đường cung và đường cầu cắt nhau",
              "Khi người bán ép được giá cao nhất",
              "Khi người mua ép được giá thấp nhất",
            ],
            correctAnswer: 1,
            explanation:
              "Điểm cân bằng chính là giao điểm của đường cung và đường cầu.",
          },
          {
            id: "lesson-1c-q2",
            question:
              "Tại điểm cân bằng, trạng thái thị trường diễn ra như thế nào?",
            options: [
              "Hàng hóa ế ẩm đầy kho",
              "Thiếu hụt hàng hóa trầm trọng",
              "Giá người bán muốn bán khớp với giá người mua muốn trả",
              "Thị trường đóng băng hoàn toàn",
            ],
            correctAnswer: 2,
            explanation:
              "Ở mức giá cân bằng, lượng cung bằng lượng cầu nên giao dịch diễn ra trơn tru.",
          },
          {
            id: "lesson-1c-q3",
            question: "Hiện tượng dư thừa xảy ra khi nào?",
            options: [
              "Lượng cầu lớn hơn lượng cung",
              "Lượng cung lớn hơn lượng cầu do giá cao hơn điểm cân bằng",
              "Cả người bán và người mua đều ngừng giao dịch",
              "Thị trường không có giá nào được công bố",
            ],
            correctAnswer: 1,
            explanation:
              "Giá cao kích thích cung tăng nhưng lại làm cầu giảm, từ đó tạo ra hàng hóa dư thừa.",
          },
          {
            id: "lesson-1c-q4",
            question:
              "Khi thị trường thiếu hụt vì giá quá rẻ, cơ chế tự điều chỉnh thường là gì?",
            options: [
              "Người bán tiếp tục hạ giá hơn nữa",
              "Người mua ngừng mua hoàn toàn",
              "Người mua tranh nhau và chấp nhận trả giá cao hơn",
              "Toàn bộ hàng hóa bị tịch thu",
            ],
            correctAnswer: 2,
            explanation:
              "Thiếu hụt khiến người mua cạnh tranh với nhau, từ đó đẩy giá tăng dần trở lại mức cân bằng.",
          },
        ],
      },
      {
        id: "lesson-1d",
        order: "1D",
        title: "Ngoại lệ của Cung Cầu",
        shortDescription:
          "Không phải lúc nào giá tăng cũng làm người ta mua ít hơn: Veblen và Giffen là hai ngoại lệ rất nổi tiếng.",
        duration: "02 phút",
        videoUrl: "https://www.youtube.com/embed/YKJaAgNbNq4",
        youtubeId: "YKJaAgNbNq4",
        overview:
          "Tập 1D mở rộng quy luật cung cầu bằng hai trường hợp đặc biệt, nơi tâm lý và hoàn cảnh làm hành vi mua đi ngược trực giác thông thường.",
        mainContentTitle: "Khi cung cầu gặp ngoại lệ",
        mainContent: [
          "Hàng hóa Veblen là những món đồ xa xỉ mà giá đắt lại chính là một phần sức hút của chúng. Người mua tìm đến không chỉ vì công dụng mà còn vì giá trị thể hiện đẳng cấp, nên giá càng cao đôi khi lượng cầu lại càng tăng.",
          "Hàng hóa Giffen thường là nhu yếu phẩm giá rẻ trong bối cảnh người tiêu dùng quá hạn hẹp ngân sách. Khi giá tăng, họ không đủ tiền chuyển sang món tốt hơn nên lại buộc phải mua nhiều hàng hóa rẻ đó hơn để duy trì cuộc sống.",
          "Hai ngoại lệ này cho thấy kinh tế học không chỉ là đồ thị và con số. Tâm lý, vị thế xã hội và hoàn cảnh sống thực tế đều có thể khiến hành vi con người khác đi so với mô hình thông thường.",
        ],
        objectives: [
          "Phân biệt ngoại lệ Veblen và Giffen.",
          "Hiểu vai trò của tâm lý và hoàn cảnh trong hành vi mua.",
          "Nhận ra vì sao đường cầu đôi khi không dốc xuống như bình thường.",
        ],
        pointsReward: 45,
        summary: {
          title: "Tóm tắt Tập 1D: Ngoại lệ của Cung Cầu",
          points: [
            "Hàng hóa Veblen có thể được mua nhiều hơn khi giá tăng vì nó gắn với việc thể hiện đẳng cấp.",
            "Hàng hóa Giffen là ngoại lệ khi người mua quá nghèo buộc phải mua nhiều nhu yếu phẩm rẻ hơn dù giá tăng.",
            "Tâm lý và hoàn cảnh sống thực tế có thể làm hành vi mua đi ngược quy luật cầu thông thường.",
            "Ngoại lệ cung cầu cho thấy kinh tế học gắn chặt với hành vi con người.",
          ],
        },
        quiz: [
          {
            id: "lesson-1d-q1",
            question:
              "Đặc điểm cốt lõi của đường cầu đối với hàng hóa Veblen là gì?",
            options: [
              "Dốc xuống như hàng hóa thông thường",
              "Nằm ngang ở mọi mức giá",
              "Dốc lên vì giá càng tăng thì lượng cầu càng tăng",
              "Biến mất hoàn toàn khi giá thay đổi",
            ],
            correctAnswer: 2,
            explanation:
              "Hàng hóa Veblen đi ngược quy luật cầu thông thường vì mức giá cao lại làm tăng sức hút xã hội của sản phẩm.",
          },
          {
            id: "lesson-1d-q2",
            question:
              "Vì sao người tiêu dùng vẫn thích mua hàng hóa Veblen khi giá của nó càng đắt?",
            options: [
              "Vì công dụng của nó tốt gấp hàng trăm lần",
              "Vì họ muốn thể hiện đẳng cấp và sự giàu có",
              "Vì đây là nhu yếu phẩm bắt buộc phải dùng mỗi ngày",
              "Vì người bán bắt buộc họ phải mua",
            ],
            correctAnswer: 1,
            explanation:
              "Giá trị của hàng hóa Veblen nằm nhiều ở tín hiệu vị thế xã hội mà nó tạo ra.",
          },
          {
            id: "lesson-1d-q3",
            question:
              "Đối với hàng hóa Giffen như mì tôm trong hoàn cảnh quá nghèo, điều gì có thể xảy ra khi giá tăng?",
            options: [
              "Người ta bớt mua mì tôm để chuyển sang ăn thịt",
              "Người ta vẫn phải mua nhiều mì tôm hơn vì không còn tiền cho món khác",
              "Người ta ngừng mua mọi thứ",
              "Lượng mua giảm ngay về bằng không",
            ],
            correctAnswer: 1,
            explanation:
              "Khi ngân sách quá eo hẹp, người mua có thể bị buộc phải dồn tiền vào nhu yếu phẩm rẻ dù giá của nó tăng.",
          },
          {
            id: "lesson-1d-q4",
            question:
              "Yếu tố vô hình nào khiến kinh tế học có những ngoại lệ thú vị như Veblen và Giffen?",
            options: [
              "Máy móc công nghệ cao",
              "Đồ thị toán học phức tạp",
              "Tâm lý và hành vi của con người",
              "Các quy định giá cứng nhắc",
            ],
            correctAnswer: 2,
            explanation:
              "Kinh tế học luôn bị chi phối mạnh bởi tâm lý, cảm xúc và hoàn cảnh thực tế của con người.",
          },
        ],
      },
    ],
  },
  {
    id: "module-2",
    title: "Unit 2: Độ co giãn",
    description:
      "Hiểu cách cầu và cung phản ứng mạnh hay yếu trước thay đổi về giá, thu nhập và mối quan hệ giữa các hàng hóa.",
    category: "economics",
    icon: "LineChart",
    lessons: [
      {
        id: "lesson-2a",
        order: "2A",
        title: "Độ co giãn của cầu theo giá (PED)",
        shortDescription:
          "Sợi dây thun hay thanh sắt: hiểu vì sao có món chỉ đổi giá một chút là lượng cầu đổi rất mạnh, còn có món gần như không nhúc nhích.",
        duration: "08 phút",
        videoUrl: "https://www.youtube.com/embed/fO4tKHj3_lA",
        youtubeId: "fO4tKHj3_lA",
        overview:
          "Tập 2A giải thích Độ co giãn của Cầu theo Giá (PED) - thước đo sự nhạy cảm của người mua trước các biến động giá cả trên thị trường.",
        mainContentTitle: "PED là gì và đường cầu phản ứng ra sao?",
        mainContent: [
          "Độ co giãn của cầu theo giá (Price Elasticity of Demand - PED) đo lường mức độ thay đổi của lượng cầu khi giá của chính hàng hóa đó thay đổi. Đây là công cụ đo lường mức độ nhạy cảm của người tiêu dùng trước các biến động giá cả.",
          "Cầu co giãn (Elastic Demand) được ví như sợi dây thun đàn hồi: giá chỉ thay đổi một chút nhưng lượng cầu có thể phản ứng rất mạnh (tỷ lệ % thay đổi của lượng cầu lớn hơn tỷ lệ % thay đổi của giá). Những món có nhiều hàng thay thế thường có cầu co giãn.",
          "Cầu kém co giãn (Inelastic Demand) giống như thanh sắt cứng: dù giá có thay đổi nhiều, lượng cầu chỉ thay đổi tương đối nhỏ. Người học thường gặp điều này ở các hàng hóa thiết yếu hoặc khó thay thế.",
          "Trên đồ thị, đường cầu co giãn thường tương đối phẳng (lài), trong khi đường cầu kém co giãn lại tương đối dốc (đứng). Nếu người bán tăng giá một mặt hàng có cầu co giãn cao, khách hàng sẽ bỏ đi rất nhiều khiến tổng doanh thu sụt giảm.",
        ],
        objectives: [
          "Định nghĩa và giải thích ý nghĩa của chỉ số PED.",
          "Phân biệt cầu co giãn (sợi dây thun) và cầu kém co giãn (thanh sắt).",
          "Nhận ra hình dạng phẳng (lài) và dốc (đứng) của đường cầu trên đồ thị.",
          "Hiểu mối quan hệ giữa thay đổi giá, PED và doanh thu của người bán.",
        ],
        pointsReward: 45,
        summary: {
          title: "Tóm tắt Tập 2A: Độ co giãn của cầu theo giá (PED)",
          points: [
            "PED đo lường mức độ phản ứng của lượng cầu khi giá hàng hóa thay đổi.",
            "Cầu co giãn: Lượng cầu đổi mạnh khi giá đổi nhẹ; đường cầu tương đối phẳng/lài.",
            "Cầu kém co giãn: Lượng cầu đổi rất ít dù giá đổi nhiều; đường cầu tương đối dốc/đứng.",
            "Biết PED giúp người bán ra quyết định định giá thông minh để tối ưu doanh thu.",
          ],
        },
        quiz: [
          {
            id: "lesson-2a-q1",
            question: "Độ co giãn của cầu theo giá (PED) dùng để đo lường điều gì?",
            options: [
              "Mức độ phản ứng của lượng cầu khi giá của chính hàng hóa đó thay đổi",
              "Tổng số tiền chi tiêu của người mua trong một năm",
              "Tốc độ sản xuất hàng hóa của các nhà máy",
              "Mức độ thay đổi của thu nhập người tiêu dùng",
            ],
            correctAnswer: 0,
            explanation:
              "PED (Price Elasticity of Demand) phản ánh mức độ nhạy cảm hay tỷ lệ phần trăm thay đổi của lượng cầu trước sự thay đổi về giá của hàng hóa đó.",
          },
          {
            id: "lesson-2a-q2",
            question:
              "Một hàng hóa có cầu co giãn (Elastic Demand) được ví như 'sợi dây thun' vì lý do gì?",
            options: [
              "Giá thay đổi nhưng lượng cầu đứng yên không đổi",
              "Giá chỉ thay đổi một chút nhưng lượng cầu phản ứng rất mạnh",
              "Người bán luôn tặng kèm quà khi bán sản phẩm",
              "Thu nhập người mua tăng gấp đôi ngay lập tức",
            ],
            correctAnswer: 1,
            explanation:
              "Cầu co giãn cho thấy người mua rất nhạy cảm với giá; khi giá biến động nhẹ, lượng cầu sẽ co giãn rất nhiều như sợi dây thun.",
          },
          {
            id: "lesson-2a-q3",
            question:
              "Trên đồ thị kinh tế học, hình dạng của đường cầu co giãn và đường cầu kém co giãn khác nhau như thế nào?",
            options: [
              "Đường cầu co giãn dốc đứng hơn, đường cầu kém co giãn phẳng hơn",
              "Đường cầu co giãn tương đối phẳng (lài), đường cầu kém co giãn tương đối dốc (đứng)",
              "Cả hai đường đều là đường thẳng nằm ngang",
              "Cả hai đường đều là đường thẳng đứng song song trục giá",
            ],
            correctAnswer: 1,
            explanation:
              "Đường cầu co giãn tương đối phẳng (lài) vì một thay đổi nhỏ của giá tạo ra thay đổi lớn ở trục lượng; ngược lại, đường cầu kém co giãn tương đối dốc (đứng).",
          },
          {
            id: "lesson-2a-q4",
            question:
              "Nếu một chủ shop tăng giá một mặt hàng có cầu co giãn cao (nhiều hàng thay thế), kết quả nào dễ xảy ra nhất?",
            options: [
              "Khách hàng mua nhiều hơn trước",
              "Lượng khách mua giảm mạnh và tổng doanh thu sụt giảm",
              "Tổng doanh thu chắc chắn tăng gấp đôi",
              "Không có khách hàng nào quan tâm đến việc tăng giá",
            ],
            correctAnswer: 1,
            explanation:
              "Với hàng có cầu co giãn, việc tăng giá khiến lượng cầu giảm với tỷ lệ lớn hơn mức tăng giá, dẫn đến tổng doanh thu của người bán bị sụt giảm.",
          },
        ],
      },
      {
        id: "lesson-2b",
        order: "2B",
        title: "Các yếu tố ảnh hưởng PED",
        shortDescription:
          "Tại sao xăng tăng bạn vẫn phải đổ: phân tích 3 yếu tố quyết định độ nhạy của cầu gồm hàng thay thế, hàng thiết yếu và thời gian.",
        duration: "08 phút",
        videoUrl: "https://www.youtube.com/embed/uLCxTHQL3ic",
        youtubeId: "uLCxTHQL3ic",
        overview:
          "Tập 2B giải thích ba yếu tố then chốt quyết định PED: hàng thay thế, mức độ thiết yếu và thời gian thích ứng của người tiêu dùng.",
        mainContentTitle: "3 nhân tố then chốt chi phối PED",
        mainContent: [
          "Số lượng hàng thay thế (Substitutes): Càng có nhiều hàng thay thế tương đương trên thị trường, cầu của mặt hàng đó càng co giãn. Ví dụ: nếu một quán trà sữa tăng giá, bạn có thể dễ dàng chuyển sang quán trà sữa bên cạnh hoặc uống nước ép, cà phê.",
          "Mức độ thiết yếu (Necessities vs Luxuries): Hàng hóa càng thiết yếu với đời sống thì cầu càng kém co giãn. Xăng xe là ví dụ điển hình: dù giá xăng tăng cao, học sinh và người đi làm vẫn bắt buộc phải đổ xăng để di chuyển mỗi ngày.",
          "Yếu tố thời gian (Time Horizon): Trong ngắn hạn, người mua khó đổi thói quen ngay nên cầu kém co giãn. Nhưng về dài hạn, họ có thời gian tìm phương tiện khác (như xe bus, xe điện) hoặc sắp xếp lại sinh hoạt, khiến cầu trở nên co giãn hơn.",
        ],
        objectives: [
          "Giải thích vai trò của hàng thay thế đối với PED.",
          "Phân biệt mức độ co giãn giữa hàng thiết yếu và hàng xa xỉ.",
          "Hiểu thời gian làm thay đổi phản ứng tiêu dùng từ ngắn hạn sang dài hạn.",
        ],
        pointsReward: 45,
        summary: {
          title: "Tóm tắt Tập 2B: Các yếu tố ảnh hưởng PED",
          points: [
            "Hàng thay thế: Càng nhiều lựa chọn thay thế, cầu càng co giãn.",
            "Hàng thiết yếu: Rất cần thiết cho cuộc sống nên cầu kém co giãn (ví dụ: xăng, muối ăn).",
            "Thời gian: Cầu trong dài hạn luôn co giãn hơn trong ngắn hạn do người mua có thời gian thích ứng.",
            "Hiểu 3 yếu tố này giúp giải thích hành vi chi tiêu hằng ngày của người tiêu dùng.",
          ],
        },
        quiz: [
          {
            id: "lesson-2b-q1",
            question:
              "Yếu tố nào sau đây thường làm cho cầu của một hàng hóa trở nên co giãn hơn?",
            options: [
              "Hàng hóa có rất nhiều sản phẩm thay thế dễ tìm trên thị trường",
              "Hàng hóa là nhu yếu phẩm sống còn không thể thiếu",
              "Người mua không có thời gian tìm kiếm món khác",
              "Sản phẩm độc quyền duy nhất trên thị trường",
            ],
            correctAnswer: 0,
            explanation:
              "Khi có nhiều sản phẩm thay thế, người mua dễ dàng chuyển sang món khác nếu sản phẩm hiện tại tăng giá, khiến cầu co giãn hơn.",
          },
          {
            id: "lesson-2b-q2",
            question:
              "Tại sao khi giá xăng tăng cao, đa số mọi người vẫn phải tiếp tục đổ xăng hàng ngày?",
            options: [
              "Vì xăng là hàng xa xỉ phẩm",
              "Vì xăng là hàng thiết yếu phục vụ di chuyển và khó thay thế ngay lập tức",
              "Vì người mua không quan tâm đến chi tiêu cá nhân",
              "Vì giá xăng không bao giờ ảnh hưởng đến ngân sách",
            ],
            correctAnswer: 1,
            explanation:
              "Hàng thiết yếu cho nhu cầu đi lại hàng ngày thường có cầu kém co giãn trong ngắn hạn vì người tiêu dùng khó cắt giảm ngay.",
          },
          {
            id: "lesson-2b-q3",
            question:
              "Yếu tố thời gian tác động như thế nào đến độ co giãn của cầu theo giá (PED)?",
            options: [
              "Thời gian càng dài thì cầu càng kém co giãn",
              "Trong dài hạn, cầu có xu hướng co giãn hơn vì người mua có thời gian tìm giải pháp thay thế",
              "Thời gian không có bất kỳ ảnh hưởng nào đến PED",
              "Trong ngắn hạn cầu luôn co giãn tuyệt đối",
            ],
            correctAnswer: 1,
            explanation:
              "Về lâu dài, người tiêu dùng có thể đổi xe, đi phương tiện công cộng hoặc đổi thói quen di chuyển, khiến lượng cầu phản ứng mạnh hơn với giá.",
          },
          {
            id: "lesson-2b-q4",
            question:
              "So sánh giữa một cốc trà sữa thương hiệu cụ thể và muối ăn hàng ngày, nhận định nào đúng về PED?",
            options: [
              "Trà sữa có cầu co giãn hơn muối ăn vì có nhiều món thay thế và không phải hàng thiết yếu",
              "Muối ăn có cầu co giãn hơn trà sữa",
              "Cả hai đều có cầu co giãn hoàn toàn như nhau",
              "Muối ăn có cầu co giãn vô hạn",
            ],
            correctAnswer: 0,
            explanation:
              "Trà sữa dễ thay thế bởi các đồ uống khác và không bắt buộc phải dùng, trong khi muối ăn là nhu yếu phẩm thiết yếu và chi phí nhỏ nên cầu rất kém co giãn.",
          },
        ],
      },
      {
        id: "lesson-2c",
        order: "2C",
        title: "Độ co giãn theo thu nhập (YED)",
        shortDescription:
          "Giàu rồi thì ăn gì: phân biệt Normal Goods và Inferior Goods qua cách lượng cầu phản ứng khi thu nhập thay đổi.",
        duration: "08 phút",
        videoUrl: "https://www.youtube.com/embed/M6b7QVOctn8",
        youtubeId: "M6b7QVOctn8",
        overview:
          "Tập 2C giới thiệu YED, Normal Goods và Inferior Goods để giải thích sự thay đổi trong lựa chọn tiêu dùng khi thu nhập tăng hoặc giảm.",
        mainContentTitle: "YED cho biết thu nhập làm cầu đổi thế nào?",
        mainContent: [
          "Độ co giãn của cầu theo thu nhập (Income Elasticity of Demand - YED) cho biết mức độ thay đổi của lượng cầu khi thu nhập của người tiêu dùng thay đổi.",
          "Hàng hóa thông thường (Normal Goods) có YED > 0 (dương). Khi thu nhập tăng lên, người mua thường muốn mua nhiều hơn hoặc nâng cấp lên các lựa chọn tốt hơn, như đi du lịch, mua iPhone, ăn bít tết.",
          "Hàng hóa thứ cấp / cấp thấp (Inferior Goods) có YED < 0 (âm). Khi thu nhập tăng, người mua có xu hướng giảm dùng các món giá rẻ trước đây (như mì tôm ăn liền, xe buýt công cộng, đồ cũ second-hand) để chuyển sang hàng hóa chất lượng cao hơn.",
        ],
        objectives: [
          "Hiểu YED đo phản ứng của lượng cầu trước thay đổi về thu nhập.",
          "Phân biệt Normal Goods (YED > 0) và Inferior Goods (YED < 0).",
          "Áp dụng vào các ví dụ thực tế: du lịch, iPhone, bít tết, mì tôm, xe buýt, đồ second-hand.",
        ],
        pointsReward: 45,
        summary: {
          title: "Tóm tắt Tập 2C: Độ co giãn theo thu nhập (YED)",
          points: [
            "YED đo lường phản ứng của lượng cầu trước sự thay đổi của thu nhập.",
            "Normal Goods (Hàng thông thường): YED > 0, thu nhập tăng -> cầu tăng (du lịch, iPhone, steak).",
            "Inferior Goods (Hàng thứ cấp): YED < 0, thu nhập tăng -> cầu giảm (mì tôm, xe buýt, đồ cũ).",
            "Dấu của YED là cơ sở quan trọng để phân loại nhóm hàng hóa.",
          ],
        },
        quiz: [
          {
            id: "lesson-2c-q1",
            question:
              "Độ co giãn của cầu theo thu nhập (YED) đo lường mối quan hệ giữa hai yếu tố nào?",
            options: [
              "Giá bán của hàng hóa và lượng cung của nhà sản xuất",
              "Thu nhập của người tiêu dùng và lượng cầu đối với hàng hóa",
              "Giá hàng thay thế và giá hàng bổ sung",
              "Chi phí sản xuất và lợi nhuận của doanh nghiệp",
            ],
            correctAnswer: 1,
            explanation:
              "YED phản ánh mức độ thay đổi của lượng cầu khi thu nhập của người tiêu dùng thay đổi.",
          },
          {
            id: "lesson-2c-q2",
            question:
              "Hàng hóa thông thường (Normal Goods) có dấu YED và đặc điểm tiêu dùng như thế nào?",
            options: [
              "YED > 0, khi thu nhập tăng thì lượng cầu đối với hàng hóa tăng",
              "YED < 0, khi thu nhập tăng thì lượng cầu đối với hàng hóa giảm",
              "YED = 0, thu nhập thay đổi không ảnh hưởng đến lượng cầu",
              "YED luôn là số âm vô cùng",
            ],
            correctAnswer: 0,
            explanation:
              "Với Normal Goods, người tiêu dùng sẽ mua nhiều hơn khi có thu nhập cao hơn (YED dương, lớn hơn 0).",
          },
          {
            id: "lesson-2c-q3",
            question:
              "Khi thu nhập tăng lên và bạn bớt ăn mì tôm để chuyển sang ăn bít tết, mì tôm trong trường hợp này được phân loại là gì?",
            options: [
              "Hàng hóa xa xỉ cao cấp",
              "Hàng hóa thứ cấp (Inferior Goods) với YED < 0",
              "Hàng hóa thông thường có YED > 0",
              "Hàng hóa bổ sung hoàn hảo",
            ],
            correctAnswer: 1,
            explanation:
              "Inferior Goods là hàng hóa mà lượng tiêu thụ giảm đi khi thu nhập của người mua tăng lên (YED < 0).",
          },
          {
            id: "lesson-2c-q4",
            question:
              "Ví dụ nào sau đây minh họa chính xác cho hàng hóa thông thường (Normal Goods) trong đời sống?",
            options: [
              "Thu nhập tăng khiến người ta giảm hẳn việc mua xe máy riêng",
              "Thu nhập tăng giúp gia đình có điều kiện đi du lịch và nâng cấp thiết bị công nghệ nhiều hơn",
              "Thu nhập tăng làm người dân tăng cường mua đồ cũ second-hand",
              "Thu nhập tăng làm mọi người ngừng mua sắm toàn bộ",
            ],
            correctAnswer: 1,
            explanation:
              "Du lịch và đồ công nghệ chất lượng cao là các mặt hàng thông thường/cao cấp có lượng cầu tăng khi thu nhập tăng.",
          },
        ],
      },
      {
        id: "lesson-2d",
        order: "2D",
        title: "Độ co giãn chéo (XED)",
        shortDescription:
          "Trâu bò húc nhau, ruồi muỗi có chết: phân biệt hàng thay thế và hàng bổ sung qua chỉ số XED.",
        duration: "08 phút",
        videoUrl: "placeholder",
        overview:
          "Tập 2D giải thích hiện tượng khi một mặt hàng đổi giá làm thay đổi lượng cầu của mặt hàng khác thông qua chỉ số XED.",
        mainContentTitle: "XED - Mối quan hệ giữa các cặp hàng hóa",
        mainContent: [
          "Độ co giãn chéo của cầu (Cross Elasticity of Demand - XED) đo lường mức độ thay đổi của lượng cầu hàng hóa A khi giá của hàng hóa B thay đổi.",
          "Hàng hóa thay thế (Substitutes) có XED > 0 (dương). Khi giá hàng hóa này tăng, người tiêu dùng sẽ chuyển sang mua hàng hóa kia nhiều hơn. Ví dụ kinh điển: Coca-Cola và Pepsi. Nếu Coca-Cola tăng giá mạnh, nhiều người sẽ chọn mua Pepsi thay thế, làm lượng cầu Pepsi tăng lên.",
          "Hàng hóa bổ sung (Complements) có XED < 0 (âm). Đây là những sản phẩm cần dùng kèm với nhau, như xe máy và xăng, hoặc máy in và mực in. Khi giá xe máy hoặc máy in tăng cao khiến người mua ít đi, lượng cầu đối với xăng và mực in cũng giảm theo.",
        ],
        objectives: [
          "Hiểu định nghĩa và ý nghĩa của độ co giãn chéo XED.",
          "Nhớ dấu của XED: XED > 0 với hàng thay thế, XED < 0 với hàng bổ sung.",
          "Áp dụng vào các ví dụ: Coca/Pepsi, xe máy/xăng, máy in/mực in.",
        ],
        pointsReward: 45,
        summary: {
          title: "Tóm tắt Tập 2D: Độ co giãn chéo (XED)",
          points: [
            "XED đo lường lượng cầu hàng A thay đổi thế nào khi giá hàng B thay đổi.",
            "Hàng thay thế (Substitutes): XED > 0 (Giá Coca tăng -> Cầu Pepsi tăng).",
            "Hàng bổ sung (Complements): XED < 0 (Giá xe máy tăng -> Cầu xăng giảm).",
            "Nếu XED = 0, hai hàng hóa độc lập không ảnh hưởng lẫn nhau.",
          ],
        },
        quiz: [
          {
            id: "lesson-2d-q1",
            question:
              "Độ co giãn chéo của cầu (XED) dùng để đo lường điều gì?",
            options: [
              "Mức độ thay đổi của lượng cầu hàng hóa A khi giá hàng hóa B thay đổi",
              "Tỷ lệ tăng trưởng doanh thu của hai công ty đối thủ",
              "Sự thay đổi của giá vàng theo tỷ giá đô la Mỹ",
              "Mức độ hài lòng của khách hàng sau khi dùng sản phẩm",
            ],
            correctAnswer: 0,
            explanation:
              "XED đo lường phản ứng của lượng cầu một mặt hàng trước biến động giá của một mặt hàng khác.",
          },
          {
            id: "lesson-2d-q2",
            question:
              "Nếu giá Coca-Cola tăng khiến lượng cầu đối với Pepsi tăng theo, dấu của XED giữa hai mặt hàng này là gì?",
            options: [
              "XED > 0 (dương), vì đây là hai hàng hóa thay thế cho nhau",
              "XED < 0 (âm), vì đây là hai hàng hóa bổ sung cho nhau",
              "XED luôn bằng 0",
              "Không xác định được dấu của XED",
            ],
            correctAnswer: 0,
            explanation:
              "Hàng thay thế có giá món này và lượng cầu món kia biến động cùng chiều, nên XED luôn mang dấu dương (XED > 0).",
          },
          {
            id: "lesson-2d-q3",
            question:
              "Đối với cặp hàng hóa bổ sung như xe máy và xăng, dấu của XED là gì và vì sao?",
            options: [
              "XED > 0 vì xe máy càng đắt thì người ta càng đổ nhiều xăng",
              "XED < 0 vì giá xe máy tăng làm người mua xe ít đi, kéo theo lượng cầu xăng giảm",
              "XED = 0 vì hai mặt hàng này hoàn toàn không liên quan",
              "XED luôn là số dương vô hạn",
            ],
            correctAnswer: 1,
            explanation:
              "Hàng bổ sung phải dùng cùng nhau; khi giá một món tăng, lượng tiêu dùng của cả hai món đều bị kéo giảm, nên XED mang dấu âm (XED < 0).",
          },
          {
            id: "lesson-2d-q4",
            question:
              "Nếu XED giữa hai mặt hàng như bút bi và giá gạo xấp xỉ bằng 0, điều đó thể hiện điều gì?",
            options: [
              "Bút bi và gạo là hai hàng hóa bổ sung hoàn hảo",
              "Bút bi và gạo là hai hàng hóa hoàn toàn độc lập, không ảnh hưởng đến nhau",
              "Người mua bút bi bắt buộc phải mua kèm gạo",
              "Giá gạo tăng làm lượng mua bút bi giảm mạnh",
            ],
            correctAnswer: 1,
            explanation:
              "XED = 0 chỉ ra rằng sự thay đổi giá của mặt hàng này không tác động đến lượng cầu của mặt hàng kia (hàng hóa độc lập).",
          },
        ],
      },
      {
        id: "lesson-2e",
        order: "2E",
        title: "Độ co giãn của cung (PES)",
        shortDescription:
          "Nhà máy có biến hình kịp không: tìm hiểu khả năng và tốc độ phản ứng của người bán trước tín hiệu giá thị trường.",
        duration: "08 phút",
        videoUrl: "placeholder",
        overview:
          "Tập 2E lật ngược vấn đề sang phía người bán: khi giá thị trường tăng cao, các nhà sản xuất có thể điều chỉnh sản lượng nhanh hay chậm thông qua chỉ số PES.",
        mainContentTitle: "PES và khả năng điều chỉnh sản xuất",
        mainContent: [
          "Độ co giãn của cung theo giá (Price Elasticity of Supply - PES) đo lường mức độ thay đổi của lượng cung khi giá của chính hàng hóa đó thay đổi.",
          "Cung co giãn (Elastic Supply) xảy ra khi người bán có thể nhanh chóng gia tăng sản lượng khi giá tăng. Ví dụ: trend bánh đồng xu phô mai gây sốt, người bán dễ dàng mua thêm máy làm bánh, nguyên liệu và mở tiệm chỉ trong vài ngày.",
          "Cung kém co giãn (Inelastic Supply) xảy ra khi sản lượng khó tăng ngay lập tức dù giá có tăng cao. Ví dụ: cây sầu riêng cần từ 4 đến 6 năm mới cho quả, nên dù giá sầu riêng tăng vọt, nhà vườn cũng không thể có sầu riêng mới thu hoạch ngay ngày mai.",
          "Các yếu tố chính quyết định PES bao gồm: Yếu tố thời gian (dài hạn cung co giãn hơn ngắn hạn), Khả năng tồn trữ hàng hóa trong kho, và Độ linh hoạt của quy trình sản xuất.",
        ],
        objectives: [
          "Nắm vững định nghĩa và ý nghĩa của PES từ góc độ người bán.",
          "Phân biệt cung co giãn và cung kém co giãn qua các ví dụ thực tế.",
          "Hiểu vai trò của thời gian, khả năng lưu kho và công nghệ trong việc điều chỉnh nguồn cung.",
        ],
        pointsReward: 45,
        summary: {
          title: "Tóm tắt Tập 2E: Độ co giãn của cung (PES)",
          points: [
            "PES đo phản ứng của lượng cung khi giá cả hàng hóa thay đổi.",
            "Cung co giãn: Dễ mở rộng sản xuất khi giá tăng (trend bánh đồng xu phô mai).",
            "Cung kém co giãn: Cần nhiều thời gian hoặc khó nhân rộng (trồng sầu riêng).",
            "Thời gian càng dài và kho bãi càng linh hoạt thì cung càng co giãn.",
          ],
        },
        quiz: [
          {
            id: "lesson-2e-q1",
            question:
              "Độ co giãn của cung theo giá (PES) cho biết điều gì về phía người sản xuất?",
            options: [
              "Mức độ thay đổi của lượng cung khi giá bán của hàng hóa biến động",
              "Số lượng khách hàng đến cửa hàng mỗi ngày",
              "Mức độ hài lòng của công nhân trong nhà máy",
              "Tổng số tiền vay vốn từ ngân hàng",
            ],
            correctAnswer: 0,
            explanation:
              "PES đo lường mức độ nhạy cảm và tốc độ điều chỉnh sản lượng của nhà sản xuất trước sự thay đổi về giá bán.",
          },
          {
            id: "lesson-2e-q2",
            question:
              "Vì sao khi trend 'bánh đồng xu phô mai' bùng nổ, các quán bán bánh mọc lên rất nhanh (Cung co giãn cao)?",
            options: [
              "Vì việc làm bánh đòi hỏi phải mất 10 năm nghiên cứu",
              "Vì khuôn máy làm bánh dễ mua, nguyên liệu sẵn có và quy trình sản xuất đơn giản",
              "Vì chính phủ bắt buộc mỗi người phải mở một tiệm bánh",
              "Vì bánh đồng xu không có ai muốn mua",
            ],
            correctAnswer: 1,
            explanation:
              "Công nghệ sản xuất đơn giản và rào cản thấp giúp người bán tăng nhanh lượng cung ra thị trường khi giá tăng.",
          },
          {
            id: "lesson-2e-q3",
            question:
              "Tại sao trong ngắn hạn, nguồn cung của nông sản như sầu riêng lại có độ co giãn kém (Inelastic Supply) khi giá tăng cao?",
            options: [
              "Vì cây sầu riêng cần từ 4 đến 6 năm chăm sóc mới cho thu hoạch, không thể tăng sản lượng ngay lập tức",
              "Vì người nông dân không thích kiếm thêm tiền",
              "Vì sầu riêng không chịu tác động của quy luật cung cầu",
              "Vì sầu riêng để trong kho bao lâu cũng không hỏng",
            ],
            correctAnswer: 0,
            explanation:
              "Chu kỳ sinh trưởng tự nhiên kéo dài khiến nhà vườn không thể gia tăng sản lượng sầu riêng trong thời gian ngắn.",
          },
          {
            id: "lesson-2e-q4",
            question:
              "Yếu tố nào sau đây giúp nguồn cung của một doanh nghiệp trở nên co giãn hơn (PES lớn hơn)?",
            options: [
              "Hàng hóa dễ hư hỏng và không thể lưu kho",
              "Doanh nghiệp có hệ thống kho bảo quản tốt và dây chuyền sản xuất linh hoạt",
              "Quy trình tuyển dụng và đào tạo công nhân mất nhiều năm",
              "Doanh nghiệp không có nguồn cung ứng nguyên liệu dự phòng",
            ],
            correctAnswer: 1,
            explanation:
              "Khả năng lưu kho hàng hóa và dây chuyền chuyển đổi linh hoạt giúp doanh nghiệp phản ứng nhanh khi giá thị trường biến động.",
          },
        ],
      },
    ],
  },
  {
    id: "module-3",
    title: "CHUYÊN ĐỀ 3 - TÀI CHÍNH CÁ NHÂN",
    description:
      "Thiết lập nền tảng quản lý tiền cá nhân để chi tiêu rõ ràng và bớt căng thẳng cuối tháng.",
    category: "finance",
    icon: "Wallet",
    lessons: [
      {
        id: "lesson-5",
        order: 5,
        title: "Lập ngân sách 50/30/20",
        shortDescription:
          "Chia tiền thành ba nhóm rõ ràng để vừa đáp ứng nhu cầu, vừa còn chỗ cho tiết kiệm.",
        duration: "11 phút",
        videoUrl: "placeholder",
        overview:
          "Bài học giới thiệu quy tắc 50/30/20 dưới góc nhìn học sinh, giúp dễ áp dụng với tiền tiêu vặt và các khoản chi nhỏ mỗi tháng.",
        mainContentTitle: "Tiền của bạn nên được chia ra sao?",
        mainContent: [
          "Quy tắc 50/30/20 là một cách rất dễ hiểu để quản lý tiền cá nhân. Theo cách này, khoảng 50% số tiền được dành cho nhu cầu thiết yếu như ăn uống, đi lại hoặc tài liệu học tập. Khoảng 30% dành cho những thứ bạn thích như giải trí, mua sắm nhỏ hoặc sở thích cá nhân.",
          "Phần 20% còn lại được ưu tiên cho tiết kiệm hoặc mục tiêu lâu dài. Dù số tiền chưa lớn, việc tách riêng phần này ngay từ đầu giúp bạn hình thành thói quen giữ lại tiền cho tương lai thay vì tiêu hết rồi mới nghĩ đến tiết kiệm.",
          "Điều quan trọng nhất của phương pháp này không phải là đúng từng đồng, mà là tạo cho bạn một khung rõ ràng khi chi tiêu. Khi biết tiền của mình nên đi vào nhóm nào, học sinh sẽ dễ kiểm soát ví tiền hơn và bớt rơi vào cảnh hết sạch tiền giữa tháng.",
        ],
        objectives: [
          "Phân biệt nhu cầu, mong muốn và tiết kiệm.",
          "Biết cách chia tiền ngay khi vừa nhận được.",
          "Nhìn ra các khoản chi đang lệch khỏi kế hoạch.",
        ],
        pointsReward: 50,
        quiz: [
          {
            id: "lesson-5-q1",
            question:
              "Theo quy tắc 50/30/20, phần tiết kiệm chiếm bao nhiêu phần trăm?",
            options: ["50%", "30%", "20%", "10%"],
            correctAnswer: 2,
            explanation:
              "Trong mô hình 50/30/20, 20% thu nhập được ưu tiên cho tiết kiệm và tích lũy.",
          },
          {
            id: "lesson-5-q2",
            question: "Tiền ăn trưa hằng ngày thường thuộc nhóm nào?",
            options: [
              "Thiết yếu",
              "Mong muốn",
              "Giải trí",
              "Không cần phân loại",
            ],
            correctAnswer: 0,
            explanation:
              "Ăn uống cơ bản là nhu cầu thiết yếu, nên được xếp vào nhóm chi phí bắt buộc.",
          },
        ],
      },
      {
        id: "lesson-6",
        order: 6,
        title: "Quỹ dự phòng để làm gì?",
        shortDescription:
          "Chuẩn bị một khoản tiền nhỏ nhưng sẵn sàng dùng khi có việc đột xuất.",
        duration: "08 phút",
        videoUrl: "placeholder",
        overview:
          "Quỹ dự phòng giúp bạn không bị động trước các chi phí bất ngờ như sửa xe, mua tài liệu gấp hoặc hỗ trợ gia đình.",
        mainContentTitle: "Quỹ dự phòng bảo vệ bạn như thế nào?",
        mainContent: [
          "Quỹ dự phòng là khoản tiền được để riêng cho những tình huống bất ngờ như xe hỏng, điện thoại cần sửa gấp hoặc phát sinh chi phí học tập ngoài kế hoạch. Đây không phải là tiền để tiêu cho vui, mà là lớp đệm giúp bạn không bị rối khi có việc đột xuất.",
          "Khi có quỹ dự phòng, bạn sẽ bớt phải vay mượn hoặc lấy tiền từ những mục tiêu khác để xử lý tình huống khẩn cấp. Điều này đặc biệt quan trọng với học sinh vì những khoản chi bất ngờ thường khiến kế hoạch tiền tiêu vặt bị đảo lộn rất nhanh.",
          "Không cần đợi đến khi có nhiều tiền mới bắt đầu lập quỹ dự phòng. Chỉ cần để dành đều đặn một khoản nhỏ, bạn đã tạo ra cảm giác an toàn hơn trong tài chính cá nhân. Đây là thói quen rất hữu ích cho hiện tại và cả về sau.",
        ],
        objectives: [
          "Hiểu khi nào nên dùng quỹ dự phòng.",
          "Phân biệt quỹ dự phòng với tiền chi tiêu thường ngày.",
          "Biết vì sao nên tích lũy quỹ dần dần.",
        ],
        pointsReward: 45,
        quiz: [
          {
            id: "lesson-6-q1",
            question: "Khoản tiền nào phù hợp nhất để dùng quỹ dự phòng?",
            options: [
              "Sửa điện thoại hỏng phục vụ học tập",
              "Mua phụ kiện theo trend",
              "Đặt đồ uống cuối tuần",
              "Mua skin trong game",
            ],
            correctAnswer: 0,
            explanation:
              "Quỹ dự phòng nên dùng cho các tình huống cần thiết và bất ngờ, không phải cho chi tiêu tùy hứng.",
          },
        ],
      },
    ],
  },
  {
    id: "module-4",
    title: "CHUYÊN ĐỀ 4 - TÍCH LŨY VÀ MỤC TIÊU",
    description:
      "Đi xa hơn một bước với lãi kép và cách đặt mục tiêu tài chính ngắn hạn, dài hạn.",
    category: "finance",
    icon: "LineChart",
    lessons: [
      {
        id: "lesson-7",
        order: 7,
        title: "Lãi kép hoạt động ra sao?",
        shortDescription:
          "Hiểu vì sao bắt đầu sớm và đều đặn thường quan trọng hơn bắt đầu thật lớn.",
        duration: "09 phút",
        videoUrl: "placeholder",
        overview:
          "Bài học mô tả lãi kép bằng ngôn ngữ rất đơn giản: tiền lãi tiếp tục sinh thêm lãi theo thời gian.",
        mainContentTitle: "Lãi kép giúp tiền tăng lên ra sao?",
        mainContent: [
          "Lãi kép là cách tiền tăng lên khi phần lãi kiếm được tiếp tục được cộng vào số tiền ban đầu để tạo ra lãi mới. Nói đơn giản, tiền không chỉ sinh lời một lần mà còn sinh lời trên cả phần lãi đã có trước đó.",
          "Điều khiến lãi kép trở nên mạnh là thời gian. Nếu bạn bắt đầu tiết kiệm hoặc đầu tư sớm, số tiền có nhiều cơ hội hơn để tăng dần qua từng giai đoạn. Ngay cả một khoản nhỏ nhưng đều đặn trong thời gian dài cũng có thể tạo ra kết quả đáng kể.",
          "Vì vậy, bài học quan trọng ở đây là không cần chờ có thật nhiều tiền mới bắt đầu. Quan trọng hơn là bắt đầu sớm, duy trì đều và kiên nhẫn với mục tiêu của mình. Đó chính là cách lãi kép phát huy tác dụng rõ nhất.",
        ],
        objectives: [
          "Hiểu khái niệm lãi sinh ra trên cả gốc lẫn lãi cũ.",
          "Nhận ra vai trò của thời gian trong tích lũy.",
          "Biết vì sao gửi đều quan trọng hơn chờ có thật nhiều tiền.",
        ],
        pointsReward: 55,
        quiz: [
          {
            id: "lesson-7-q1",
            question: "Điểm mạnh lớn nhất của lãi kép là gì?",
            options: [
              "Tiền lãi tiếp tục sinh thêm lãi",
              "Không cần thời gian",
              "Luôn không có rủi ro",
              "Chỉ áp dụng cho người rất giàu",
            ],
            correctAnswer: 0,
            explanation:
              "Cốt lõi của lãi kép là phần lãi được cộng lại và tiếp tục tạo ra lãi mới theo thời gian.",
          },
          {
            id: "lesson-7-q2",
            question: "Yếu tố nào giúp lãi kép phát huy hiệu quả rõ hơn?",
            options: [
              "Thời gian tích lũy dài hơn",
              "Rút tiền liên tục",
              "Chi tiêu toàn bộ ngay khi có lãi",
              "Không theo dõi mục tiêu",
            ],
            correctAnswer: 0,
            explanation:
              "Thời gian càng dài, hiệu ứng cộng dồn càng mạnh nên lãi kép càng rõ rệt.",
          },
        ],
      },
      {
        id: "lesson-8",
        order: 8,
        title: "Mục tiêu tài chính ngắn và dài hạn",
        shortDescription:
          "Biến mong muốn mơ hồ thành mục tiêu có số tiền, thời gian và kế hoạch rõ ràng.",
        duration: "07 phút",
        videoUrl: "placeholder",
        overview:
          "Bài học giúp người học tách mục tiêu gần như mua sách, học phí khóa ngắn hạn khỏi mục tiêu dài hơn như laptop hoặc quỹ du học.",
        mainContentTitle: "Đặt mục tiêu tài chính như thế nào cho rõ ràng?",
        mainContent: [
          "Một mục tiêu tài chính rõ ràng không chỉ nói rằng bạn muốn tiết kiệm, mà còn phải cho biết bạn muốn dành bao nhiêu tiền và trong khoảng thời gian nào. Khi mục tiêu có con số và thời hạn cụ thể, bạn sẽ dễ theo dõi tiến độ hơn nhiều.",
          "Mục tiêu ngắn hạn có thể là mua sách, đóng học phí cho một khóa học hoặc dành tiền cho một chuyến đi gần. Mục tiêu dài hạn thường cần nhiều thời gian hơn, như mua laptop, chuẩn bị cho đại học hoặc tích lũy cho một kế hoạch lớn hơn trong tương lai.",
          "Khi biết chia mục tiêu thành từng bước nhỏ, học sinh sẽ thấy việc tiết kiệm bớt áp lực hơn. Thay vì nghĩ đến một số tiền quá lớn, bạn chỉ cần tập trung vào khoản nhỏ cần hoàn thành trong tuần hoặc trong tháng. Cách này giúp mục tiêu trở nên thực tế và dễ làm hơn.",
        ],
        objectives: [
          "Phân biệt mục tiêu ngắn hạn và dài hạn.",
          "Gắn mục tiêu với thời gian và số tiền cụ thể.",
          "Biết chia mục tiêu lớn thành các bước nhỏ để theo dõi.",
        ],
        pointsReward: 45,
        quiz: [
          {
            id: "lesson-8-q1",
            question:
              "Một mục tiêu tài chính rõ ràng nên có yếu tố nào sau đây?",
            options: [
              "Số tiền và thời hạn cụ thể",
              "Chỉ cần cảm hứng",
              "Không cần ghi chép lại",
              "Không cần biết mình đã dành được bao nhiêu",
            ],
            correctAnswer: 0,
            explanation:
              "Mục tiêu rõ ràng cần biết bạn muốn dành bao nhiêu tiền và trong khoảng thời gian nào.",
          },
        ],
      },
    ],
  },
];
