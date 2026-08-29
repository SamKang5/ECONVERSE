-- ============================================================================
-- ECONVERSE D1 DATABASE MIGRATION 0002: SEED DATA
-- Seed data for Lessons, Quiz Questions, Pets, and Inventory Items
-- ============================================================================

-- 1. SEED LESSONS
INSERT OR IGNORE INTO lessons (id, unit_code, episode_code, title, display_order, points_reward, is_active) VALUES
('lesson-1', '1', '1A', 'Quy luật Cầu', 1, 40, 1),
('lesson-2', '1', '1B', 'Quy luật Cung', 2, 40, 1),
('lesson-1c', '1', '1C', 'Cung và Cầu đại chiến – Điểm cân bằng', 3, 45, 1),
('lesson-1d', '1', '1D', 'Ngoại lệ của Cung Cầu', 4, 45, 1),
('lesson-2a', '2', '2A', 'Độ co giãn của cầu theo giá (PED)', 5, 45, 1),
('lesson-2b', '2', '2B', 'Các yếu tố ảnh hưởng PED', 6, 45, 1),
('lesson-2c', '2', '2C', 'Độ co giãn theo thu nhập (YED)', 7, 45, 1),
('lesson-2d', '2', '2D', 'Độ co giãn chéo (XED)', 8, 45, 1),
('lesson-2e', '2', '2E', 'Độ co giãn của cung (PES)', 9, 45, 1),
('lesson-5', '3', '5', 'Lập ngân sách 50/30/20', 10, 50, 1),
('lesson-6', '3', '6', 'Quỹ dự phòng để làm gì?', 11, 45, 1),
('lesson-7', '4', '7', 'Lãi kép hoạt động ra sao?', 12, 55, 1),
('lesson-8', '4', '8', 'Mục tiêu tài chính ngắn và dài hạn', 13, 45, 1);

-- 2. SEED QUIZ QUESTIONS (Backend Answer Keys)
-- Lesson 1 (1A)
INSERT OR IGNORE INTO quiz_questions (id, lesson_id, question_order, question_text, options_json, correct_option, explanation, is_active) VALUES
('lesson-1-q1', 'lesson-1', 1, 'Khi một đôi giày sneaker giảm giá mạnh từ 2 triệu xuống còn 200k, hiện tượng nào dễ xảy ra nhất?', '["Học sinh quay xe đi thẳng không thèm ngó","Cả trăm người lao vào tranh nhau mua","Người bán đóng cửa cửa hàng","Lượng cầu giảm về mức bằng không"]', 1, 'Đây là ví dụ trực quan cho quy luật cầu: giá giảm sâu thường kéo lượng cầu tăng vọt.', 1),
('lesson-1-q2', 'lesson-1', 2, 'Trong điều kiện các yếu tố khác không đổi, mối quan hệ giữa giá và lượng cầu được phát biểu đúng là gì?', '["Khi giá tăng, lượng cầu tăng theo","Khi giá giảm, lượng cầu cũng giảm theo","Khi giá tăng, lượng cầu giảm xuống và ngược lại","Giá cả và lượng cầu không có mối quan hệ gì"]', 2, 'Quy luật cầu chỉ ra mối quan hệ nghịch biến giữa giá cả và lượng cầu.', 1),
('lesson-1-q3', 'lesson-1', 3, 'Hiệu ứng thay thế tác động thế nào khi một món đồ trở nên đắt hơn?', '["Người mua dồn hết tiền để mua bằng được","Người mua chuyển sang lựa chọn khác rẻ hơn","Người mua ngừng tiêu dùng mọi hàng hóa","Người mua cảm thấy mình giàu lên"]', 1, 'Khi giá một mặt hàng tăng, các lựa chọn thay thế rẻ hơn trở nên hấp dẫn hơn.', 1),
('lesson-1-q4', 'lesson-1', 4, 'Theo hiệu ứng thu nhập, điều gì khiến người mua phải cắt giảm chi tiêu khi giá hàng hóa tăng?', '["Thu nhập danh nghĩa tự động tăng","Sức mua thực tế giảm, khiến họ cảm thấy nghèo đi","Người mua được thưởng thêm tiền lương","Mọi hàng hóa đều biến mất khỏi thị trường"]', 1, 'Giá tăng làm cùng một số tiền mua được ít đồ hơn, nên người tiêu dùng phải thắt chặt chi tiêu.', 1);

-- Lesson 2 (1B)
INSERT OR IGNORE INTO quiz_questions (id, lesson_id, question_order, question_text, options_json, correct_option, explanation, is_active) VALUES
('lesson-2-q1', 'lesson-2', 1, 'Khi giá thị trường của một ly trà sữa tăng vọt từ 30k lên 90k, phản ứng nào hợp với quy luật cung nhất?', '["Đóng cửa quán và đi ngủ ngay","Giữ nguyên công suất như cũ","Đẩy mạnh sản xuất hết công suất để bán nhiều hơn","Giảm số ly làm ra mỗi ngày"]', 2, 'Khi giá tăng cao, người bán có động lực tăng lượng cung để tận dụng doanh thu và lợi nhuận.', 1),
('lesson-2-q2', 'lesson-2', 2, 'Đường cung trên đồ thị kinh tế học có đặc điểm nào?', '["Dốc xuống từ trái sang phải","Dốc lên từ trái sang phải","Nằm ngang song song với trục lượng","Đứng thẳng song song với trục giá"]', 1, 'Đường cung dốc lên thể hiện mối quan hệ đồng biến giữa giá cả và lượng cung.', 1),
('lesson-2-q3', 'lesson-2', 3, 'Động lực lớn nhất chi phối hành vi của người bán trong quy luật cung là gì?', '["Sự đồng cảm với khó khăn của người mua","Lợi nhuận kiếm được nhiều hơn trên mỗi sản phẩm","Việc cắt giảm tối đa số lượng nhân viên","Đam mê làm việc không cần tiền bạc"]', 1, 'Giá bán cao giúp biên lợi nhuận mở rộng, đó là lý do người bán muốn cung ứng nhiều hơn.', 1),
('lesson-2-q4', 'lesson-2', 4, 'Nếu giá hàng hóa trở nên quá rẻ và không đủ bù vốn, chuyện gì dễ xảy ra nhất?', '["Người bán càng hào hứng sản xuất gấp đôi","Người bán giảm sản lượng hoặc ngừng bán","Lượng cung tăng vọt ngoài thị trường","Người bán chuyển sang tặng miễn phí sản phẩm"]', 1, 'Khi giá quá thấp, người bán không còn động lực duy trì lượng cung như trước.', 1);

-- Lesson 1C
INSERT OR IGNORE INTO quiz_questions (id, lesson_id, question_order, question_text, options_json, correct_option, explanation, is_active) VALUES
('lesson-1c-q1', 'lesson-1c', 1, 'Điểm cân bằng xuất hiện trên đồ thị kinh tế học khi nào?', '["Khi đường cầu nằm hoàn toàn phía trên đường cung","Khi đường cung và đường cầu cắt nhau","Khi người bán ép được giá cao nhất","Khi người mua ép được giá thấp nhất"]', 1, 'Điểm cân bằng chính là giao điểm của đường cung và đường cầu.', 1),
('lesson-1c-q2', 'lesson-1c', 2, 'Tại điểm cân bằng, trạng thái thị trường diễn ra như thế nào?', '["Hàng hóa ế ẩm đầy kho","Thiếu hụt hàng hóa trầm trọng","Giá người bán muốn bán khớp với giá người mua muốn trả","Thị trường đóng băng hoàn toàn"]', 2, 'Ở mức giá cân bằng, lượng cung bằng lượng cầu nên giao dịch diễn ra trơn tru.', 1),
('lesson-1c-q3', 'lesson-1c', 3, 'Hiện tượng dư thừa xảy ra khi nào?', '["Lượng cầu lớn hơn lượng cung","Lượng cung lớn hơn lượng cầu do giá cao hơn điểm cân bằng","Cả người bán và người mua đều ngừng giao dịch","Thị trường không có giá nào được công bố"]', 1, 'Giá cao kích thích cung tăng nhưng lại làm cầu giảm, từ đó tạo ra hàng hóa dư thừa.', 1),
('lesson-1c-q4', 'lesson-1c', 4, 'Khi thị trường thiếu hụt vì giá quá rẻ, cơ chế tự điều chỉnh thường là gì?', '["Người bán tiếp tục hạ giá hơn nữa","Người mua ngừng mua hoàn toàn","Người mua tranh nhau và chấp nhận trả giá cao hơn","Toàn bộ hàng hóa bị tịch thu"]', 2, 'Thiếu hụt khiến người mua cạnh tranh với nhau, từ đó đẩy giá tăng dần trở lại mức cân bằng.', 1);

-- Lesson 1D
INSERT OR IGNORE INTO quiz_questions (id, lesson_id, question_order, question_text, options_json, correct_option, explanation, is_active) VALUES
('lesson-1d-q1', 'lesson-1d', 1, 'Đặc điểm cốt lõi của đường cầu đối với hàng hóa Veblen là gì?', '["Dốc xuống như hàng hóa thông thường","Nằm ngang ở mọi mức giá","Dốc lên vì giá càng tăng thì lượng cầu càng tăng","Biến mất hoàn toàn khi giá thay đổi"]', 2, 'Hàng hóa Veblen đi ngược quy luật cầu thông thường vì mức giá cao lại làm tăng sức hút xã hội của sản phẩm.', 1),
('lesson-1d-q2', 'lesson-1d', 2, 'Vì sao người tiêu dùng vẫn thích mua hàng hóa Veblen khi giá của nó càng đắt?', '["Vì công dụng của nó tốt gấp hàng trăm lần","Vì họ muốn thể hiện đẳng cấp và sự giàu có","Vì đây là nhu yếu phẩm bắt buộc phải dùng mỗi ngày","Vì người bán bắt buộc họ phải mua"]', 1, 'Giá trị của hàng hóa Veblen nằm nhiều ở tín hiệu vị thế xã hội mà nó tạo ra.', 1),
('lesson-1d-q3', 'lesson-1d', 3, 'Đối với hàng hóa Giffen như mì tôm trong hoàn cảnh quá nghèo, điều gì có thể xảy ra khi giá tăng?', '["Người ta bớt mua mì tôm để chuyển sang ăn thịt","Người ta vẫn phải mua nhiều mì tôm hơn vì không còn tiền cho món khác","Người ta ngừng mua mọi thứ","Lượng mua giảm ngay về bằng không"]', 1, 'Khi ngân sách quá eo hẹp, người mua có thể bị buộc phải dồn tiền vào nhu yếu phẩm rẻ dù giá của nó tăng.', 1),
('lesson-1d-q4', 'lesson-1d', 4, 'Yếu tố vô hình nào khiến kinh tế học có những ngoại lệ thú vị như Veblen và Giffen?', '["Máy móc công nghệ cao","Đồ thị toán học phức tạp","Tâm lý và hành vi của con người","Các quy định giá cứng nhắc"]', 2, 'Kinh tế học luôn bị chi phối mạnh bởi tâm lý, cảm xúc và hoàn cảnh thực tế của con người.', 1);

-- Lesson 2A
INSERT OR IGNORE INTO quiz_questions (id, lesson_id, question_order, question_text, options_json, correct_option, explanation, is_active) VALUES
('lesson-2a-q1', 'lesson-2a', 1, 'Độ co giãn của cầu theo giá (PED) dùng để đo lường điều gì?', '["Mức độ phản ứng của lượng cầu khi giá của chính hàng hóa đó thay đổi","Tổng số tiền chi tiêu của người mua trong một năm","Tốc độ sản xuất hàng hóa của các nhà máy","Mức độ thay đổi của thu nhập người tiêu dùng"]', 0, 'PED (Price Elasticity of Demand) phản ánh mức độ nhạy cảm hay tỷ lệ phần trăm thay đổi của lượng cầu trước sự thay đổi về giá của hàng hóa đó.', 1),
('lesson-2a-q2', 'lesson-2a', 2, 'Một hàng hóa có cầu co giãn (Elastic Demand) được ví như ''sợi dây thun'' vì lý do gì?', '["Giá thay đổi nhưng lượng cầu đứng yên không đổi","Giá chỉ thay đổi một chút nhưng lượng cầu phản ứng rất mạnh","Người bán luôn tặng kèm quà khi bán sản phẩm","Thu nhập người mua tăng gấp đôi ngay lập tức"]', 1, 'Cầu co giãn cho thấy người mua rất nhạy cảm với giá; khi giá biến động nhẹ, lượng cầu sẽ co giãn rất nhiều như sợi dây thun.', 1),
('lesson-2a-q3', 'lesson-2a', 3, 'Trên đồ thị kinh tế học, hình dạng của đường cầu co giãn và đường cầu kém co giãn khác nhau như thế nào?', '["Đường cầu co giãn dốc đứng hơn, đường cầu kém co giãn phẳng hơn","Đường cầu co giãn tương đối phẳng (lài), đường cầu kém co giãn tương đối dốc (đứng)","Cả hai đường đều là đường thẳng nằm ngang","Cả hai đường đều là đường thẳng đứng song song trục giá"]', 1, 'Đường cầu co giãn tương đối phẳng (lài) vì một thay đổi nhỏ của giá tạo ra thay đổi lớn ở trục lượng; ngược lại, đường cầu kém co giãn tương đối dốc (đứng).', 1),
('lesson-2a-q4', 'lesson-2a', 4, 'Nếu một chủ shop tăng giá một mặt hàng có cầu co giãn cao (nhiều hàng thay thế), kết quả nào dễ xảy ra nhất?', '["Khách hàng mua nhiều hơn trước","Lượng khách mua giảm mạnh và tổng doanh thu sụt giảm","Tổng doanh thu chắc chắn tăng gấp đôi","Không có khách hàng nào quan tâm đến việc tăng giá"]', 1, 'Với hàng có cầu co giãn, việc tăng giá khiến lượng cầu giảm với tỷ lệ lớn hơn mức tăng giá, dẫn đến tổng doanh thu của người bán bị sụt giảm.', 1);

-- Lesson 2B
INSERT OR IGNORE INTO quiz_questions (id, lesson_id, question_order, question_text, options_json, correct_option, explanation, is_active) VALUES
('lesson-2b-q1', 'lesson-2b', 1, 'Yếu tố nào sau đây thường làm cho cầu của một hàng hóa trở nên co giãn hơn?', '["Hàng hóa có rất nhiều sản phẩm thay thế dễ tìm trên thị trường","Hàng hóa là nhu yếu phẩm sống còn không thể thiếu","Người mua không có thời gian tìm kiếm món khác","Sản phẩm độc quyền duy nhất trên thị trường"]', 0, 'Khi có nhiều sản phẩm thay thế, người mua dễ dàng chuyển sang món khác nếu sản phẩm hiện tại tăng giá, khiến cầu co giãn hơn.', 1),
('lesson-2b-q2', 'lesson-2b', 2, 'Tại sao khi giá xăng tăng cao, đa số mọi người vẫn phải tiếp tục đổ xăng hàng ngày?', '["Vì xăng là hàng xa xỉ phẩm","Vì xăng là hàng thiết yếu phục vụ di chuyển và khó thay thế ngay lập tức","Vì người mua không quan tâm đến chi tiêu cá nhân","Vì giá xăng không bao giờ ảnh hưởng đến ngân sách"]', 1, 'Hàng thiết yếu cho nhu cầu đi lại hàng ngày thường có cầu kém co giãn trong ngắn hạn vì người tiêu dùng khó cắt giảm ngay.', 1),
('lesson-2b-q3', 'lesson-2b', 3, 'Yếu tố thời gian tác động như thế nào đến độ co giãn của cầu theo giá (PED)?', '["Thời gian càng dài thì cầu càng kém co giãn","Trong dài hạn, cầu có xu hướng co giãn hơn vì người mua có thời gian tìm giải pháp thay thế","Thời gian không có bất kỳ ảnh hưởng nào đến PED","Trong ngắn hạn cầu luôn co giãn tuyệt đối"]', 1, 'Về lâu dài, người tiêu dùng có thể đổi xe, đi phương tiện công cộng hoặc đổi thói quen di chuyển, khiến lượng cầu phản ứng mạnh hơn với giá.', 1),
('lesson-2b-q4', 'lesson-2b', 4, 'So sánh giữa một cốc trà sữa thương hiệu cụ thể và muối ăn hàng ngày, nhận định nào đúng về PED?', '["Trà sữa có cầu co giãn hơn muối ăn vì có nhiều món thay thế và không phải hàng thiết yếu","Muối ăn có cầu co giãn hơn trà sữa","Cả hai đều có cầu co giãn hoàn toàn như nhau","Muối ăn có cầu co giãn vô hạn"]', 0, 'Trà sữa dễ thay thế bởi các đồ uống khác và không bắt buộc phải dùng, trong khi muối ăn là nhu yếu phẩm thiết yếu và chi phí nhỏ nên cầu rất kém co giãn.', 1);

-- Lesson 2C
INSERT OR IGNORE INTO quiz_questions (id, lesson_id, question_order, question_text, options_json, correct_option, explanation, is_active) VALUES
('lesson-2c-q1', 'lesson-2c', 1, 'Độ co giãn của cầu theo thu nhập (YED) đo lường mối quan hệ giữa hai yếu tố nào?', '["Giá bán của hàng hóa và lượng cung của nhà sản xuất","Thu nhập của người tiêu dùng và lượng cầu đối với hàng hóa","Giá hàng thay thế và giá hàng bổ sung","Chi phí sản xuất và lợi nhuận của doanh nghiệp"]', 1, 'YED phản ánh mức độ thay đổi của lượng cầu khi thu nhập của người tiêu dùng thay đổi.', 1),
('lesson-2c-q2', 'lesson-2c', 2, 'Hàng hóa thông thường (Normal Goods) có dấu YED và đặc điểm tiêu dùng như thế nào?', '["YED > 0, khi thu nhập tăng thì lượng cầu đối với hàng hóa tăng","YED < 0, khi thu nhập tăng thì lượng cầu đối với hàng hóa giảm","YED = 0, thu nhập thay đổi không ảnh hưởng đến lượng cầu","YED luôn là số âm vô cùng"]', 0, 'Với Normal Goods, người tiêu dùng sẽ mua nhiều hơn khi có thu nhập cao hơn (YED dương, lớn hơn 0).', 1),
('lesson-2c-q3', 'lesson-2c', 3, 'Khi thu nhập tăng lên và bạn bớt ăn mì tôm để chuyển sang ăn bít tết, mì tôm trong trường hợp này được phân loại là gì?', '["Hàng hóa xa xỉ cao cấp","Hàng hóa thứ cấp (Inferior Goods) với YED < 0","Hàng hóa thông thường có YED > 0","Hàng hóa bổ sung hoàn hảo"]', 1, 'Inferior Goods là hàng hóa mà lượng tiêu thụ giảm đi khi thu nhập của người mua tăng lên (YED < 0).', 1),
('lesson-2c-q4', 'lesson-2c', 4, 'Ví dụ nào sau đây minh họa chính xác cho hàng hóa thông thường (Normal Goods) trong đời sống?', '["Thu nhập tăng khiến người ta giảm hẳn việc mua xe máy riêng","Thu nhập tăng giúp gia đình có điều kiện đi du lịch và nâng cấp thiết bị công nghệ nhiều hơn","Thu nhập tăng làm người dân tăng cường mua đồ cũ second-hand","Thu nhập tăng làm mọi người ngừng mua sắm toàn bộ"]', 1, 'Du lịch và đồ công nghệ chất lượng cao là các mặt hàng thông thường/cao cấp có lượng cầu tăng khi thu nhập tăng.', 1);

-- Lesson 2D
INSERT OR IGNORE INTO quiz_questions (id, lesson_id, question_order, question_text, options_json, correct_option, explanation, is_active) VALUES
('lesson-2d-q1', 'lesson-2d', 1, 'Độ co giãn chéo của cầu (XED) dùng để đo lường điều gì?', '["Mức độ thay đổi của lượng cầu hàng hóa A khi giá hàng hóa B thay đổi","Tỷ lệ tăng trưởng doanh thu của hai công ty đối thủ","Sự thay đổi của giá vàng theo tỷ giá đô la Mỹ","Mức độ hài lòng của khách hàng sau khi dùng sản phẩm"]', 0, 'XED đo lường phản ứng của lượng cầu một mặt hàng trước biến động giá của một mặt hàng khác.', 1),
('lesson-2d-q2', 'lesson-2d', 2, 'Nếu giá Coca-Cola tăng khiến lượng cầu đối với Pepsi tăng theo, dấu của XED giữa hai mặt hàng này là gì?', '["XED > 0 (dương), vì đây là hai hàng hóa thay thế cho nhau","XED < 0 (âm), vì đây là hai hàng hóa bổ sung cho nhau","XED luôn bằng 0","Không xác định được dấu của XED"]', 0, 'Hàng thay thế có giá món này và lượng cầu món kia biến động cùng chiều, nên XED luôn mang dấu dương (XED > 0).', 1),
('lesson-2d-q3', 'lesson-2d', 3, 'Đối với cặp hàng hóa bổ sung như xe máy và xăng, dấu của XED là gì và vì sao?', '["XED > 0 vì xe máy càng đắt thì người ta càng đổ nhiều xăng","XED < 0 vì giá xe máy tăng làm người mua xe ít đi, kéo theo lượng cầu xăng giảm","XED = 0 vì hai mặt hàng này hoàn toàn không liên quan","XED luôn là số dương vô hạn"]', 1, 'Hàng bổ sung phải dùng cùng nhau; khi giá một món tăng, lượng tiêu dùng của cả hai món đều bị kéo giảm, nên XED mang dấu âm (XED < 0).', 1),
('lesson-2d-q4', 'lesson-2d', 4, 'Nếu XED giữa hai mặt hàng như bút bi và giá gạo xấp xỉ bằng 0, điều đó thể hiện điều gì?', '["Bút bi và gạo là hai hàng hóa bổ sung hoàn hảo","Bút bi và gạo là hai hàng hóa hoàn toàn độc lập, không ảnh hưởng đến nhau","Người mua bút bi bắt buộc phải mua kèm gạo","Giá gạo tăng làm lượng mua bút bi giảm mạnh"]', 1, 'XED = 0 chỉ ra rằng sự thay đổi giá của mặt hàng này không tác động đến lượng cầu của mặt hàng kia (hàng hóa độc lập).', 1);

-- Lesson 2E
INSERT OR IGNORE INTO quiz_questions (id, lesson_id, question_order, question_text, options_json, correct_option, explanation, is_active) VALUES
('lesson-2e-q1', 'lesson-2e', 1, 'Độ co giãn của cung theo giá (PES) dùng để đo lường điều gì?', '["Mức độ phản ứng và tốc độ điều chỉnh sản lượng của người bán khi giá thay đổi","Số lượng khách hàng đến cửa hàng mỗi ngày","Mức độ hài lòng của công nhân trong nhà máy","Tổng số tiền vay vốn từ ngân hàng"]', 0, 'PES đo lường mức độ nhạy cảm và tốc độ điều chỉnh sản lượng của nhà sản xuất trước sự thay đổi về giá bán.', 1),
('lesson-2e-q2', 'lesson-2e', 2, 'Vì sao khi trend ''bánh đồng xu phô mai'' bùng nổ, các quán bán bánh mọc lên rất nhanh (Cung co giãn cao)?', '["Vì việc làm bánh đòi hỏi phải mất 10 năm nghiên cứu","Vì khuôn máy làm bánh dễ mua, nguyên liệu sẵn có và quy trình sản xuất đơn giản","Vì chính phủ bắt buộc mỗi người phải mở một tiệm bánh","Vì bánh đồng xu không có ai muốn mua"]', 1, 'Công nghệ sản xuất đơn giản và rào cản thấp giúp người bán tăng nhanh lượng cung ra thị trường khi giá tăng.', 1),
('lesson-2e-q3', 'lesson-2e', 3, 'Tại sao trong ngắn hạn, nguồn cung của nông sản như sầu riêng lại có độ co giãn kém (Inelastic Supply) khi giá tăng cao?', '["Vì cây sầu riêng cần từ 4 đến 6 năm chăm sóc mới cho thu hoạch, không thể tăng sản lượng ngay lập tức","Vì người nông dân không thích kiếm thêm tiền","Vì sầu riêng không chịu tác động của quy luật cung cầu","Vì sầu riêng để trong kho bao lâu cũng không hỏng"]', 0, 'Chu kỳ sinh trưởng tự nhiên kéo dài khiến nhà vườn không thể gia tăng sản lượng sầu riêng trong thời gian ngắn.', 1),
('lesson-2e-q4', 'lesson-2e', 4, 'Yếu tố nào sau đây giúp nguồn cung của một doanh nghiệp trở nên co giãn hơn (PES lớn hơn)?', '["Hàng hóa dễ hư hỏng và không thể lưu kho","Doanh nghiệp có hệ thống kho bảo quản tốt và dây chuyền sản xuất linh hoạt","Quy trình tuyển dụng và đào tạo công nhân mất nhiều năm","Doanh nghiệp không có nguồn cung ứng nguyên liệu dự phòng"]', 1, 'Khả năng lưu kho hàng hóa và dây chuyền chuyển đổi linh hoạt giúp doanh nghiệp phản ứng nhanh khi giá thị trường biến động.', 1);

-- Lesson 5
INSERT OR IGNORE INTO quiz_questions (id, lesson_id, question_order, question_text, options_json, correct_option, explanation, is_active) VALUES
('lesson-5-q1', 'lesson-5', 1, 'Theo quy tắc 50/30/20, phần tiết kiệm chiếm bao nhiêu phần trăm?', '["50%","30%","20%","10%"]', 2, 'Trong mô hình 50/30/20, 20% thu nhập được ưu tiên cho tiết kiệm và tích lũy.', 1),
('lesson-5-q2', 'lesson-5', 2, 'Tiền ăn trưa hằng ngày thường thuộc nhóm nào?', '["Thiết yếu","Mong muốn","Giải trí","Không cần phân loại"]', 0, 'Ăn uống cơ bản là nhu cầu thiết yếu, nên được xếp vào nhóm chi phí bắt buộc.', 1);

-- Lesson 6
INSERT OR IGNORE INTO quiz_questions (id, lesson_id, question_order, question_text, options_json, correct_option, explanation, is_active) VALUES
('lesson-6-q1', 'lesson-6', 1, 'Khoản tiền nào phù hợp nhất để dùng quỹ dự phòng?', '["Sửa điện thoại hỏng phục vụ học tập","Mua phụ kiện theo trend","Đặt đồ uống cuối tuần","Mua skin trong game"]', 0, 'Quỹ dự phòng nên dùng cho các tình huống cần thiết và bất ngờ, không phải cho chi tiêu tùy hứng.', 1);

-- Lesson 7
INSERT OR IGNORE INTO quiz_questions (id, lesson_id, question_order, question_text, options_json, correct_option, explanation, is_active) VALUES
('lesson-7-q1', 'lesson-7', 1, 'Điểm mạnh lớn nhất của lãi kép là gì?', '["Tiền lãi tiếp tục sinh thêm lãi","Không cần thời gian","Luôn không có rủi ro","Chỉ áp dụng cho người rất giàu"]', 0, 'Cốt lõi của lãi kép là phần lãi được cộng lại và tiếp tục tạo ra lãi mới theo thời gian.', 1),
('lesson-7-q2', 'lesson-7', 2, 'Yếu tố nào giúp lãi kép phát huy hiệu quả rõ hơn?', '["Thời gian tích lũy dài hơn","Rút tiền liên tục","Chi tiêu toàn bộ ngay khi có lãi","Không theo dõi mục tiêu"]', 0, 'Thời gian càng dài, hiệu ứng cộng dồn càng mạnh nên lãi kép càng rõ rệt.', 1);

-- Lesson 8
INSERT OR IGNORE INTO quiz_questions (id, lesson_id, question_order, question_text, options_json, correct_option, explanation, is_active) VALUES
('lesson-8-q1', 'lesson-8', 1, 'Một mục tiêu tài chính rõ ràng nên có yếu tố nào sau đây?', '["Số tiền và thời hạn cụ thể","Chỉ cần cảm hứng","Không cần ghi chép lại","Không cần biết mình đã dành được bao nhiêu"]', 0, 'Mục tiêu rõ ràng cần biết bạn muốn dành bao nhiêu tiền và trong khoảng thời gian nào.', 1);

-- 3. SEED PETS CATALOG
INSERT OR IGNORE INTO pets (id, name, stage, required_xp, metadata_json, is_active) VALUES
('pet-bear', 'Gấu Heo Đất', 1, 0, '{"species":"gấu","description":"Chú gấu tiết kiệm chăm chỉ"}', 1),
('pet-cat', 'Mèo Thần Tài', 1, 0, '{"species":"mèo","description":"Chú mèo chiêu tài thông minh"}', 1),
('pet-dino', 'Khủng Long Xanh', 1, 0, '{"species":"khủng long","description":"Khủng long kiên cường học hỏi"}', 1);

-- 4. SEED INVENTORY ITEMS
INSERT OR IGNORE INTO inventory_items (id, name, item_type, cost_xp, metadata_json, is_active) VALUES
('acc-g1', 'Kính râm Ngầu lòi', 'glasses', 30, '{"svgItem":"ThugLifeGlasses","cssStyle":"scale-110 translate-y-2 opacity-95"}', 1),
('acc-g2', 'Kính Cận Trí Thức', 'glasses', 50, '{"svgItem":"NerdGlasses","cssStyle":"scale-105 translate-y-2"}', 1),
('acc-g3', 'Kính Trọng Lực Cyberpunk', 'glasses', 90, '{"svgItem":"CyberGlasses","cssStyle":"scale-110 translate-y-2"}', 1),
('acc-h1', 'Mũ Snapback Rapper', 'hat', 40, '{"svgItem":"SnapbackHat","cssStyle":"scale-100 -translate-y-1"}', 1),
('acc-h2', 'Mũ Tốt Nghiệp Thủ Khoa', 'hat', 80, '{"svgItem":"GraduationCap","cssStyle":"scale-110 -translate-y-3"}', 1),
('acc-h3', 'Mũ Thám Tử Sherlock', 'hat', 110, '{"svgItem":"DetectiveHat","cssStyle":"scale-105 -translate-y-2"}', 1),
('acc-c1', 'Áo Choàng Hoàng Gia', 'clothing', 60, '{"svgItem":"RoyalCloak","cssStyle":"scale-100"}', 1),
('acc-c2', 'Vest Tổng Tài Đô La', 'clothing', 130, '{"svgItem":"DollarSuit","cssStyle":"scale-105"}', 1),
('acc-b1', 'Nền Sàn Giao Dịch Phố Wall', 'background', 50, '{"svgItem":"WallStreetBg","cssStyle":"bg-radial from-slate-800 to-indigo-950"}', 1),
('acc-b2', 'Nền Kho Tiền Vàng Khổng Lồ', 'background', 100, '{"svgItem":"GoldVaultBg","cssStyle":"bg-radial from-amber-900 to-slate-950"}', 1);
