import { Course, PetAccessory, SocialPost } from "./types";

export const INITIAL_COURSES: Course[] = [
  {
    id: "econ-101",
    title: "Unit 1: Cung và Cầu",
    slug: "unit-1-cung-va-cau",
    description: "Khám phá quy luật cầu, quy luật cung, điểm cân bằng và các ngoại lệ của cung cầu qua 4 tập mở đầu.",
    category: "economics",
    duration: "45 phút",
    icon: "TrendingUp",
    accentColor: "emerald",
    lessons: [
      {
        id: "lesson-1",
        order: "1A",
        title: "Quy luật Cầu",
        shortDescription: "Càng đắt càng chê, càng rẻ càng mê: hiểu vì sao giá và lượng cầu luôn đi ngược chiều.",
        duration: "08 phút",
        pointsReward: 40,
        videoUrl: "https://www.youtube.com/embed/0F137oc1cPQ",
        overview: "Tập 1A giải thích quy luật cầu bằng những ví dụ rất gần với học sinh: giá càng cao thì người mua càng chùn tay, giá càng thấp thì lượng cầu càng tăng.",
        mainContentTitle: "Quy luật cầu hoạt động ra sao?",
        mainContent: [
          "Trong điều kiện các yếu tố khác không đổi, khi giá tăng thì lượng cầu giảm; ngược lại, khi giá giảm thì lượng cầu tăng. Đây là mối quan hệ nghịch biến cơ bản giữa giá cả và hành vi mua của người tiêu dùng.",
          "Quy luật cầu được chi phối bởi hai cơ chế quen thuộc. Hiệu ứng thay thế khiến người mua chuyển sang món rẻ hơn khi một món đồ trở nên quá đắt. Hiệu ứng thu nhập khiến sức mua thực tế giảm xuống, tạo cảm giác như túi tiền bị teo lại dù thu nhập danh nghĩa không đổi.",
          "Vì vậy đường cầu thường dốc xuống từ trái sang phải. Chỉ cần nhìn vào những ví dụ như sneaker giảm giá, vé concert khan hiếm hay đồ ăn hot trend, người học có thể thấy lượng cầu phản ứng rất nhanh trước thay đổi về giá."
        ],
        objectives: [
          "Phát biểu được quy luật cầu bằng ngôn ngữ đời thường.",
          "Phân biệt hiệu ứng thay thế và hiệu ứng thu nhập.",
          "Nhận ra hình dạng dốc xuống của đường cầu trên đồ thị."
        ],
        summary: {
          title: "Tóm tắt Tập 1A: Quy luật Cầu",
          points: [
            "Khi giá tăng thì lượng cầu giảm, khi giá giảm thì lượng cầu tăng nếu các yếu tố khác giữ nguyên.",
            "Hiệu ứng thay thế khiến người mua chuyển sang món rẻ hơn khi giá mặt hàng hiện tại tăng.",
            "Hiệu ứng thu nhập làm sức mua thực tế giảm xuống, khiến người tiêu dùng cảm thấy nghèo đi.",
            "Đường cầu thông thường dốc xuống từ trái sang phải trên đồ thị."
          ]
        },
        quiz: [
          {
            id: "lesson-1-q1",
            question: "Khi một đôi giày sneaker giảm giá mạnh từ 2 triệu xuống còn 200k, hiện tượng gì sẽ xảy ra theo nội dung phim?",
            options: [
              "Học sinh quay xe đi thẳng không thèm ngó.",
              "Cả trăm người lao vào tranh nhau mua.",
              "Người bán đóng cửa cửa hàng.",
              "Lượng cầu của đôi giày giảm về mức bằng không."
            ],
            correctAnswer: 1,
            explanation: "Đây là minh họa thực tế cho quy luật cầu: khi giá giảm sâu, lượng cầu (số lượng người muốn mua) sẽ tăng vọt."
          },
          {
            id: "lesson-1-q2",
            question: "Trong điều kiện các yếu tố khác không đổi, mối quan hệ giữa giá ($P$) và lượng cầu ($Q$) được phát biểu như thế nào?",
            options: [
              "Khi giá (P) tăng lên, lượng cầu (Q) sẽ tăng theo.",
              "Khi giá (P) giảm xuống, lượng cầu (Q) cũng giảm theo.",
              "Khi giá (P) tăng lên, lượng cầu (Q) sẽ giảm xuống và ngược lại.",
              "Giá cả và lượng cầu không có mối quan hệ gì với nhau."
            ],
            correctAnswer: 2,
            explanation: "Quy luật cầu chỉ ra mối quan hệ nghịch biến (trái chiều) giữa giá cả và lượng cầu của một loại hàng hóa."
          },
          {
            id: "lesson-1-q3",
            question: "Hiệu ứng thay thế (Substitution Effect) tác động đến tâm lý người mua như thế nào khi một món đồ trở nên đắt hơn?",
            options: [
              "Người mua sẽ dồn hết tiền để mua món đồ đó bằng được.",
              "Người mua sẽ tự động chuyển sang lựa chọn khác rẻ hơn nhưng vẫn đáp ứng được nhu cầu.",
              "Người mua sẽ ngừng tiêu dùng tất cả các loại hàng hóa trên thị trường.",
              "Người mua cảm thấy mình trở nên giàu có hơn."
            ],
            correctAnswer: 1,
            explanation: "Hiệu ứng thay thế giải thích rằng khi giá một mặt hàng tăng, các mặt hàng thay thế tương đương trở nên hấp dẫn hơn về giá, khiến người tiêu dùng chuyển hướng lựa chọn."
          },
          {
            id: "lesson-1-q4",
            question: "Theo hiệu ứng thu nhập (Income Effect), điều gì xảy ra khiến bạn phải cắt giảm chi tiêu khi giá hàng hóa tăng lên?",
            options: [
              "Số tiền bạn có bị mất bớt đi một nửa một cách vô lý.",
              "Số tiền bạn có không đổi nhưng mua được ít đồ hơn, tạo cảm giác như bị \"nghèo đi\".",
              "Bạn nhận được nhiều tiền lương hơn từ công việc.",
              "Bạn cảm thấy dư dả và muốn mua nhiều đồ xa xỉ hơn."
            ],
            correctAnswer: 1,
            explanation: "Khi giá tăng, sức mua thực tế từ thu nhập của bạn giảm xuống, buộc bạn phải thắt chặt chi tiêu."
          }
        ]
      },
      {
        id: "lesson-2",
        order: "1B",
        title: "Quy luật Cung",
        shortDescription: "Được giá thì bán, rẻ mạt thì nghỉ: hiểu vì sao người bán phản ứng mạnh với mức giá thị trường.",
        duration: "08 phút",
        pointsReward: 40,
        videoUrl: "https://www.youtube.com/embed/B_UFQieeHbs",
        overview: "Tập 1B chuyển góc nhìn sang phía người bán để giải thích vì sao giá càng cao thì lượng cung thường càng tăng.",
        mainContentTitle: "Quy luật cung vận hành thế nào?",
        mainContent: [
          "Quy luật cung nói rằng mối quan hệ giữa giá và lượng cung là đồng biến. Giá càng cao, người bán càng muốn sản xuất hoặc bày bán nhiều hơn để tận dụng lợi nhuận tốt hơn.",
          "Ngược lại, nếu giá quá thấp và không đủ bù vốn, người bán sẽ giảm sản lượng hoặc rời khỏi thị trường. Vì thế đường cung thường dốc lên từ trái sang phải, phản ánh động lực gia tăng cung khi giá tăng.",
          "Động lực cốt lõi đứng sau quy luật cung là lợi nhuận. Từ quán trà sữa đến nhà sản xuất lớn, ai cũng phản ứng trước tín hiệu giá theo cách rất thực tế: nơi nào có cơ hội lời hơn thì nguồn lực sẽ đổ về đó."
        ],
        objectives: [
          "Phát biểu được quy luật cung bằng ví dụ gần gũi.",
          "Nhận ra đường cung dốc lên trên đồ thị.",
          "Hiểu lợi nhuận là động lực chính của người bán."
        ],
        summary: {
          title: "Tóm tắt Tập 1B: Quy luật Cung",
          points: [
            "Khi giá tăng thì lượng cung thường tăng, khi giá giảm quá thấp thì lượng cung giảm.",
            "Đường cung thông thường dốc lên từ trái sang phải trên đồ thị.",
            "Lợi nhuận là động lực cốt lõi khiến người bán tăng hay giảm sản lượng.",
            "Giá quá thấp không đủ bù vốn sẽ khiến người bán thu hẹp hoặc ngừng bán."
          ]
        },
        quiz: [
          {
            id: "lesson-2-q1",
            question: "Góc độ của người bán (chủ quán trà sữa) khi giá thị trường tăng vọt từ 30k lên 90k/ly sẽ là gì?",
            options: [
              "Đóng cửa quán và đi ngủ ngay lập tức.",
              "Giữ nguyên công suất sản xuất như cũ.",
              "Bật chế độ sản xuất hết công suất, bắt nhân viên làm xuyên đêm để vắt kiệt dòng tiền.",
              "Giảm số lượng ly trà sữa làm ra mỗi ngày."
            ],
            correctAnswer: 2,
            explanation: "Khi giá tăng cao, người bán có cơ hội thu về nguồn doanh thu lớn nên sẽ tìm mọi cách đẩy mạnh lượng cung ra thị trường."
          },
          {
            id: "lesson-2-q2",
            question: "Đường Cung ($S$) trên đồ thị kinh tế học có đặc điểm hình học như thế nào?",
            options: [
              "Là một đường dốc xuống từ trái sang phải.",
              "Là một đường dốc lên từ trái sang phải.",
              "Là một đường thẳng nằm ngang song song với trục Lượng ($Q$).",
              "Là một đường thẳng đứng song song với trục Giá ($P$)."
            ],
            correctAnswer: 1,
            explanation: "Đường cung dốc lên thể hiện mối quan hệ đồng biến giữa giá cả và lượng cung: giá càng cao thì lượng cung càng lớn."
          },
          {
            id: "lesson-2-q3",
            question: "Động lực duy nhất và lớn nhất chi phối hành vi của người bán trong quy luật cung là gì?",
            options: [
              "Sự đồng cảm với khó khăn của người tiêu dùng.",
              "Lợi nhuận kiếm được nhiều hơn trên mỗi sản phẩm.",
              "Việc cắt giảm tối đa số lượng nhân viên sản xuất.",
              "Đam mê làm việc không cần tiền bạc."
            ],
            correctAnswer: 1,
            explanation: "Giá bán cao giúp biên độ lợi nhuận mở rộng, đó là động lực cốt lõi thúc đẩy các chủ thể sản xuất kinh doanh tăng sản lượng."
          },
          {
            id: "lesson-2-q4",
            question: "Theo quy luật cung, chuyện gì xảy ra nếu giá hàng hóa trên thị trường trở nên \"rẻ mạt\"?",
            options: [
              "Người bán càng hào hứng sản xuất gấp đôi.",
              "Không đủ bù tiền vốn, người bán sẽ nghỉ khỏe, đóng cửa đi ngủ.",
              "Lượng cung sẽ tăng vọt ra ngoài thị trường.",
              "Người bán sẽ chuyển sang tặng miễn phí sản phẩm."
            ],
            correctAnswer: 1,
            explanation: "Khi giá quá thấp không bao phủ được chi phí sản xuất, người bán sẽ không có động lực và buộc phải giảm sản lượng hoặc dừng bán."
          }
        ]
      },
      {
        id: "lesson-1c",
        order: "1C",
        title: "Cung và Cầu đại chiến – Điểm cân bằng",
        shortDescription: "Khi cung gặp cầu, thị trường tự tìm về một mức giá cân bằng để hàng hóa bán hết và người mua chấp nhận trả.",
        duration: "09 phút",
        pointsReward: 45,
        overview: "Tập 1C cho thấy cung và cầu không đứng riêng lẻ mà luôn kéo nhau về điểm cân bằng của thị trường.",
        mainContentTitle: "Điểm cân bằng, dư thừa và thiếu hụt",
        mainContent: [
          "Điểm cân bằng là nơi đường cung cắt đường cầu. Tại mức giá này, lượng người bán muốn bán vừa khớp với lượng người mua muốn mua, nên hàng hóa được tiêu thụ trọn vẹn mà không bị ế cũng không bị thiếu.",
          "Nếu giá bị đẩy cao hơn điểm cân bằng, lượng cung sẽ lớn hơn lượng cầu. Thị trường rơi vào trạng thái dư thừa: hàng hóa tồn kho nhiều, người bán buộc phải hạ giá để kéo khách quay lại.",
          "Nếu giá bị kéo thấp hơn điểm cân bằng, lượng cầu sẽ vượt lượng cung. Khi đó xuất hiện thiếu hụt: người mua tranh nhau mua, sẵn sàng trả cao hơn, và chính áp lực đó kéo giá tăng trở lại gần điểm cân bằng."
        ],
        objectives: [
          "Xác định được điểm cân bằng trên đồ thị cung cầu.",
          "Phân biệt trạng thái dư thừa và thiếu hụt.",
          "Hiểu cơ chế tự điều chỉnh của giá trên thị trường."
        ],
        summary: {
          title: "Tóm tắt Tập 1C: Điểm cân bằng",
          points: [
            "Điểm cân bằng là giao điểm của đường cung và đường cầu, nơi lượng cung bằng lượng cầu.",
            "Giá cao hơn điểm cân bằng thường gây dư thừa vì cung lớn hơn cầu.",
            "Giá thấp hơn điểm cân bằng thường gây thiếu hụt vì cầu lớn hơn cung.",
            "Thị trường có xu hướng tự điều chỉnh để quay lại gần điểm cân bằng."
          ]
        },
        quiz: [
          {
            id: "lesson-1c-q1",
            question: "Điểm Cân Bằng (Equilibrium - E) xuất hiện trên đồ thị kinh tế học khi nào?",
            options: [
              "Khi đường Cầu nằm hoàn toàn phía trên đường Cung.",
              "Khi đường Cung và đường Cầu cắt nhau tại một điểm chạm.",
              "Khi người bán ép được người mua phải trả mức giá đắt nhất.",
              "Khi người mua ép được người bán phải bán mức giá rẻ nhất."
            ],
            correctAnswer: 1,
            explanation: "Điểm cân bằng là giao điểm của đường cung và đường cầu, thể hiện sự thỏa thuận tự nhiên của thị trường."
          },
          {
            id: "lesson-1c-q2",
            question: "Tại Điểm Cân Bằng, trạng thái thị trường diễn ra như thế nào?",
            options: [
              "Hàng hóa ế ẩm đầy kho, người bán khóc ròng.",
              "Thiếu hụt hàng hóa trầm trọng, người mua tranh giành nhau.",
              "Mức giá người bán muốn bán vừa khớp với mức giá người mua muốn trả, hàng bán hết sạch.",
              "Thị trường rơi vào khủng hoảng đóng cửa toàn bộ."
            ],
            correctAnswer: 2,
            explanation: "Tại mức giá cân bằng, lượng cung bằng đúng lượng cầu, không có hiện tượng thừa hay thiếu hàng hóa."
          },
          {
            id: "lesson-1c-q3",
            question: "Hiện tượng \"Dư thừa\" (Surplus) xảy ra khi người bán tham lam hét giá quá cao là do?",
            options: [
              "Lượng cầu lớn hơn lượng cung trên thị trường.",
              "Lượng cung lớn hơn lượng cầu, dẫn đến hàng hóa ế ẩm trong kho.",
              "Người mua tranh nhau trả giá cao hơn để có được món đồ.",
              "Cả người bán và người mua đều không muốn giao dịch."
            ],
            correctAnswer: 1,
            explanation: "Giá cao kích thích người bán sản xuất (Cung tăng) nhưng lại làm người mua chê đắt (Cầu giảm), gây ra dư thừa hàng hóa."
          },
          {
            id: "lesson-1c-q4",
            question: "Khi thị trường rơi vào trạng thái \"Thiếu hụt\" (Shortage) do giá quá rẻ, cơ chế tự điều chỉnh của thị trường sẽ là gì?",
            options: [
              "Người bán sẽ tiếp tục hạ giá thấp hơn nữa.",
              "Người mua sẽ ngừng mua hàng hoàn toàn.",
              "Người mua tranh nhau và tự động trả giá cao hơn, kéo mọi thứ quay về điểm E.",
              "Nhà nước bắt buộc phải tịch thu toàn bộ hàng hóa."
            ],
            correctAnswer: 2,
            explanation: "Sự khan hiếm khiến người mua sẵn sàng trả giá cao hơn để giành lấy sản phẩm, từ đó đẩy giá tăng dần trở lại mức cân bằng."
          }
        ]
      },
      {
        id: "lesson-1d",
        order: "1D",
        title: "Ngoại lệ của Cung Cầu",
        shortDescription: "Không phải lúc nào giá tăng cũng làm người ta mua ít hơn: Veblen và Giffen là hai ngoại lệ rất nổi tiếng.",
        duration: "08 phút",
        pointsReward: 45,
        overview: "Tập 1D mở rộng quy luật cung cầu bằng hai trường hợp đặc biệt, nơi tâm lý và hoàn cảnh làm hành vi mua đi ngược trực giác thông thường.",
        mainContentTitle: "Khi cung cầu gặp ngoại lệ",
        mainContent: [
          "Hàng hóa Veblen là những món đồ xa xỉ mà giá đắt lại chính là một phần sức hút của chúng. Người mua tìm đến không chỉ vì công dụng mà còn vì giá trị thể hiện đẳng cấp, nên giá càng cao đôi khi lượng cầu lại càng tăng.",
          "Hàng hóa Giffen thường là nhu yếu phẩm giá rẻ trong bối cảnh người tiêu dùng quá hạn hẹp ngân sách. Khi giá tăng, họ không đủ tiền chuyển sang món tốt hơn nên lại buộc phải mua nhiều hàng hóa rẻ đó hơn để duy trì cuộc sống.",
          "Hai ngoại lệ này cho thấy kinh tế học không chỉ là đồ thị và con số. Tâm lý, vị thế xã hội và hoàn cảnh sống thực tế đều có thể khiến hành vi con người khác đi so với mô hình thông thường."
        ],
        objectives: [
          "Phân biệt ngoại lệ Veblen và Giffen.",
          "Hiểu vai trò của tâm lý và hoàn cảnh trong hành vi mua.",
          "Nhận ra vì sao đường cầu đôi khi không dốc xuống như bình thường."
        ],
        summary: {
          title: "Tóm tắt Tập 1D: Ngoại lệ của Cung Cầu",
          points: [
            "Hàng hóa Veblen có thể được mua nhiều hơn khi giá tăng vì nó gắn với việc thể hiện đẳng cấp.",
            "Hàng hóa Giffen là ngoại lệ khi người mua quá nghèo buộc phải mua nhiều nhu yếu phẩm rẻ hơn dù giá tăng.",
            "Tâm lý và hoàn cảnh sống thực tế có thể làm hành vi mua đi ngược quy luật cầu thông thường.",
            "Ngoại lệ cung cầu cho thấy kinh tế học gắn chặt với hành vi con người."
          ]
        },
        quiz: [
          {
            id: "lesson-1d-q1",
            question: "Đặc điểm cốt lõi của đường cầu đối với Hàng hóa Veblen ($D_v$) là gì?",
            options: [
              "Dốc xuống từ trái sang phải giống như hàng hóa thông thường.",
              "Là một đường nằm ngang không đổi ở mọi mức giá.",
              "Dốc ngược lên trời từ trái sang phải, giá càng tăng thì lượng cầu càng tăng.",
              "Biến mất hoàn toàn khỏi đồ thị khi giá thay đổi."
            ],
            correctAnswer: 2,
            explanation: "Hàng hóa Veblen đi ngược lại quy luật cầu thông thường, thể hiện mối quan hệ đồng biến giữa giá cả và lượng cầu."
          },
          {
            id: "lesson-1d-q2",
            question: "Tại sao người tiêu dùng lại thích mua hàng hóa Veblen khi giá của nó càng đắt?",
            options: [
              "Vì công dụng của nó tốt gấp hàng trăm lần hàng thông thường.",
              "Vì họ mua để thể hiện đẳng cấp, phô diễn sự giàu có và \"khè\" thiên hạ.",
              "Vì đây là nhu yếu phẩm bắt buộc phải ăn hằng ngày.",
              "Vì họ muốn hỗ trợ tiền cho các tập đoàn xa xỉ."
            ],
            correctAnswer: 1,
            explanation: "Giá trị của hàng hóa Veblen nằm ở tâm lý khẳng định vị thế xã hội thông qua mức giá đắt đỏ của sản phẩm."
          },
          {
            id: "lesson-1d-q3",
            question: "Đối với Hàng hóa Giffen (như mì tôm khi bạn quá nghèo), hành vi tiêu dùng sẽ thay thế như thế nào khi mặt hàng này tăng giá?",
            options: [
              "Người ta lập tức bớt mua mì tôm để chuyển sang ăn thịt.",
              "Người ta không những không bớt mua, mà còn phải bấm bụng mua nhiều mì tôm hơn.",
              "Người ta sẽ nhịn đói hoàn toàn không chi tiêu gì nữa.",
              "Lượng mua mì tôm giảm ngay lập tức về bằng không."
            ],
            correctAnswer: 1,
            explanation: "Khi mặt hàng nhu yếu phẩm giá rẻ tăng giá, túi tiền người nghèo bị kiệt quệ, họ không còn đủ kinh phí để mua các thực phẩm cao cấp hơn (như thịt) nên đành phải dồn toàn bộ số tiền còn lại để mua nhiều nhu yếu phẩm này hơn nhằm duy trì cuộc sống."
          },
          {
            id: "lesson-1d-q4",
            question: "Yếu tố vô hình nào được nhắc đến ở cuối tập phim đã làm cho kinh tế học trở nên thú vị và khiến lý thuyết cung cầu có những ngoại lệ?",
            options: [
              "Sự can thiệp bằng máy móc công nghệ cao.",
              "Đồ thị toán học phức tạp.",
              "Tâm lý và hành vi của con người.",
              "Các quy định nghiêm ngặt về giá của thị trường."
            ],
            correctAnswer: 2,
            explanation: "Kinh tế học không chỉ là những con số khô khan mà bị chi phối mạnh mẽ bởi tâm lý, cảm xúc và những lựa chọn đa dạng của con người trong thực tế."
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
        mainContentTitle: "Quy tắc 50/30/20 hoạt động ra sao?",
        mainContent: [
          "Quy tắc 50/30/20 là một cách chia tiền đơn giản để bạn không tiêu hết sạch trước khi tháng kết thúc. Ý tưởng cốt lõi là chia thu nhập thành ba nhóm rõ ràng: phần dành cho nhu cầu thiết yếu, phần dành cho sở thích cá nhân và phần bắt buộc phải giữ lại cho tiết kiệm hoặc đầu tư.",
          "Khoảng 50% ngân sách nên dành cho những khoản khó cắt bỏ như ăn uống cơ bản, đi lại, học tập hoặc các chi phí sinh hoạt bắt buộc. Khoảng 30% còn lại là không gian cho niềm vui như giải trí, mua sắm nhỏ, trà sữa hay những thứ giúp cuộc sống bớt căng. 20% cuối cùng là phần quan trọng nhất vì đây là khoản giúp bạn tạo quỹ dự phòng và bớt bị động khi có việc bất ngờ.",
          "Điểm mạnh của quy tắc này là nó giúp bạn nhìn tiền theo mục đích thay vì tiêu theo cảm xúc. Khi biết rõ mỗi đồng thuộc nhóm nào, bạn sẽ dễ tự kiểm soát hơn, ít rơi vào cảnh cuối tháng cạn ví và dần xây được thói quen tích lũy bền vững."
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
        mainContentTitle: "Lãi kép là gì và vì sao nên bắt đầu sớm?",
        mainContent: [
          "Lãi kép là cơ chế mà tiền lãi sau mỗi kỳ không bị tách riêng, mà được nhập ngược trở lại vào vốn ban đầu để tiếp tục sinh thêm lãi. Vì vậy, ở kỳ sau bạn không chỉ kiếm tiền từ số vốn gốc, mà còn kiếm tiền từ chính phần lãi đã tích lũy trước đó.",
          "Trong giai đoạn đầu, tốc độ tăng trưởng của lãi kép có thể trông khá chậm nên nhiều người dễ nản. Nhưng càng về sau, khi số vốn tích lũy lớn dần, phần lãi sinh ra cũng lớn hơn và tạo cảm giác tăng tốc rất mạnh. Đó là lý do người bắt đầu sớm thường có lợi thế lớn hơn người đầu tư muộn, ngay cả khi mỗi tháng chỉ góp một khoản nhỏ.",
          "Bài học quan trọng nhất của lãi kép không phải là kiếm lời thật nhanh, mà là kiên trì đủ lâu để thời gian làm việc thay bạn. Càng giữ được thói quen tiết kiệm và tái đầu tư đều đặn, bạn càng tận dụng tốt sức mạnh của tăng trưởng theo cấp số nhân."
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
