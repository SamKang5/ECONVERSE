-- 0005: Preserve all 13 historical lesson IDs; move original written content into D1.
-- No learner records or legacy quiz rows are modified. Videos awaiting sources remain explicit.
-- Answer keys are read from the existing database, preserving owner edits to legacy quizzes.

INSERT OR IGNORE INTO lesson_revisions
  (id, lesson_id, version, lock_version, status, content_json, created_by, created_at, updated_at, feedback)
SELECT 'seed:lesson-1:1', l.id, 1, 1, 'published',
  json_set('{"order":"1A","title":"Quy luật Cầu","shortDescription":"Càng đắt càng chê, càng rẻ càng mê: hiểu vì sao giá và lượng cầu luôn đi ngược chiều.","duration":"08 phút","videoUrl":"","overview":"Tập 1A giải thích quy luật cầu bằng những ví dụ rất gần với học sinh: giá càng cao thì người mua càng chùn tay, giá càng thấp thì lượng cầu càng tăng.","mainContentTitle":"Quy luật cầu hoạt động ra sao?","mainContent":["Trong điều kiện các yếu tố khác không đổi, khi giá tăng thì lượng cầu giảm; ngược lại, khi giá giảm thì lượng cầu tăng. Đây là mối quan hệ nghịch biến cơ bản giữa giá cả và hành vi mua của người tiêu dùng.","Quy luật cầu được chi phối bởi hai cơ chế quen thuộc. Hiệu ứng thay thế khiến người mua chuyển sang món rẻ hơn khi một món đồ trở nên quá đắt. Hiệu ứng thu nhập khiến sức mua thực tế giảm xuống, tạo cảm giác như túi tiền bị teo lại dù thu nhập danh nghĩa không đổi.","Vì vậy đường cầu thường dốc xuống từ trái sang phải. Chỉ cần nhìn vào những ví dụ như sneaker giảm giá, vé concert khan hiếm hay đồ ăn hot trend, người học có thể thấy lượng cầu phản ứng rất nhanh trước thay đổi về giá."],"objectives":["Phát biểu được quy luật cầu bằng ngôn ngữ đời thường.","Phân biệt hiệu ứng thay thế và hiệu ứng thu nhập.","Nhận ra hình dạng dốc xuống của đường cầu trên đồ thị."],"pointsReward":40,"summary":{"title":"Tóm tắt Tập 1A: Quy luật Cầu","points":["Khi giá tăng thì lượng cầu giảm, khi giá giảm thì lượng cầu tăng nếu các yếu tố khác giữ nguyên.","Hiệu ứng thay thế khiến người mua chuyển sang món rẻ hơn khi giá mặt hàng hiện tại tăng.","Hiệu ứng thu nhập làm sức mua thực tế giảm xuống, khiến người tiêu dùng cảm thấy nghèo đi.","Đường cầu thông thường dốc xuống từ trái sang phải trên đồ thị."]},"moduleId":"module-1","moduleTitle":"Unit 1: Cung và Cầu","moduleDescription":"Đi từ quy luật cầu, quy luật cung đến điểm cân bằng và các ngoại lệ để hiểu vì sao giá cả thị trường luôn biến động.","category":"economics","unitCode":"1","episodeCode":"1A","quiz":[]}', '$.title', l.title, '$.pointsReward', l.points_reward,
    '$.quiz', json(COALESCE((SELECT json_group_array(json_object(
      'id', q.id, 'question', q.question_text, 'options', json(q.options_json),
      'correctAnswer', q.correct_option, 'explanation', q.explanation))
      FROM (SELECT * FROM quiz_questions WHERE lesson_id = l.id AND is_active = 1 ORDER BY question_order) q), '[]'))),
  NULL, strftime('%Y-%m-%dT%H:%M:%fZ','now'), strftime('%Y-%m-%dT%H:%M:%fZ','now'), ''
FROM lessons l WHERE l.id = 'lesson-1' AND l.published_revision_id IS NULL
  AND NOT EXISTS (SELECT 1 FROM lesson_revisions r WHERE r.lesson_id = l.id);
UPDATE lessons SET published_revision_id = 'seed:lesson-1:1'
WHERE id = 'lesson-1' AND published_revision_id IS NULL AND is_active = 1
  AND EXISTS (SELECT 1 FROM lesson_revisions WHERE id = 'seed:lesson-1:1' AND status = 'published');


INSERT OR IGNORE INTO lesson_revisions
  (id, lesson_id, version, lock_version, status, content_json, created_by, created_at, updated_at, feedback)
SELECT 'seed:lesson-2:1', l.id, 1, 1, 'published',
  json_set('{"order":"1B","title":"Quy luật Cung","shortDescription":"Được giá thì bán, rẻ mạt thì nghỉ: hiểu vì sao người bán phản ứng mạnh với mức giá thị trường.","duration":"08 phút","videoUrl":"","overview":"Tập 1B chuyển góc nhìn sang phía người bán để giải thích vì sao giá càng cao thì lượng cung thường càng tăng.","mainContentTitle":"Quy luật cung vận hành thế nào?","mainContent":["Quy luật cung nói rằng mối quan hệ giữa giá và lượng cung là đồng biến. Giá càng cao, người bán càng muốn sản xuất hoặc bày bán nhiều hơn để tận dụng lợi nhuận tốt hơn.","Ngược lại, nếu giá quá thấp và không đủ bù vốn, người bán sẽ giảm sản lượng hoặc rời khỏi thị trường. Vì thế đường cung thường dốc lên từ trái sang phải, phản ánh động lực gia tăng cung khi giá tăng.","Động lực cốt lõi đứng sau quy luật cung là lợi nhuận. Từ quán trà sữa đến nhà sản xuất lớn, ai cũng phản ứng trước tín hiệu giá theo cách rất thực tế: nơi nào có cơ hội lời hơn thì nguồn lực sẽ đổ về đó."],"objectives":["Phát biểu được quy luật cung bằng ví dụ gần gũi.","Nhận ra đường cung dốc lên trên đồ thị.","Hiểu lợi nhuận là động lực chính của người bán."],"pointsReward":40,"summary":{"title":"Tóm tắt Tập 1B: Quy luật Cung","points":["Khi giá tăng thì lượng cung thường tăng, khi giá giảm quá thấp thì lượng cung giảm.","Đường cung thông thường dốc lên từ trái sang phải trên đồ thị.","Lợi nhuận là động lực cốt lõi khiến người bán tăng hay giảm sản lượng.","Giá quá thấp không đủ bù vốn sẽ khiến người bán thu hẹp hoặc ngừng bán."]},"moduleId":"module-1","moduleTitle":"Unit 1: Cung và Cầu","moduleDescription":"Đi từ quy luật cầu, quy luật cung đến điểm cân bằng và các ngoại lệ để hiểu vì sao giá cả thị trường luôn biến động.","category":"economics","unitCode":"1","episodeCode":"1B","quiz":[]}', '$.title', l.title, '$.pointsReward', l.points_reward,
    '$.quiz', json(COALESCE((SELECT json_group_array(json_object(
      'id', q.id, 'question', q.question_text, 'options', json(q.options_json),
      'correctAnswer', q.correct_option, 'explanation', q.explanation))
      FROM (SELECT * FROM quiz_questions WHERE lesson_id = l.id AND is_active = 1 ORDER BY question_order) q), '[]'))),
  NULL, strftime('%Y-%m-%dT%H:%M:%fZ','now'), strftime('%Y-%m-%dT%H:%M:%fZ','now'), ''
FROM lessons l WHERE l.id = 'lesson-2' AND l.published_revision_id IS NULL
  AND NOT EXISTS (SELECT 1 FROM lesson_revisions r WHERE r.lesson_id = l.id);
UPDATE lessons SET published_revision_id = 'seed:lesson-2:1'
WHERE id = 'lesson-2' AND published_revision_id IS NULL AND is_active = 1
  AND EXISTS (SELECT 1 FROM lesson_revisions WHERE id = 'seed:lesson-2:1' AND status = 'published');


INSERT OR IGNORE INTO lesson_revisions
  (id, lesson_id, version, lock_version, status, content_json, created_by, created_at, updated_at, feedback)
SELECT 'seed:lesson-1c:1', l.id, 1, 1, 'published',
  json_set('{"order":"1C","title":"Cung và Cầu đại chiến – Điểm cân bằng","shortDescription":"Khi cung gặp cầu, thị trường tự tìm về một mức giá cân bằng để hàng hóa bán hết và người mua chấp nhận trả.","duration":"09 phút","videoUrl":"https://www.youtube.com/embed/elHTLmaghlU","youtubeId":"elHTLmaghlU","overview":"Tập 1C cho thấy cung và cầu không đứng riêng lẻ mà luôn kéo nhau về điểm cân bằng của thị trường.","mainContentTitle":"Điểm cân bằng, dư thừa và thiếu hụt","mainContent":["Điểm cân bằng là nơi đường cung cắt đường cầu. Tại mức giá này, lượng người bán muốn bán vừa khớp với lượng người mua muốn mua, nên hàng hóa được tiêu thụ trọn vẹn mà không bị ế cũng không bị thiếu.","Nếu giá bị đẩy cao hơn điểm cân bằng, lượng cung sẽ lớn hơn lượng cầu. Thị trường rơi vào trạng thái dư thừa: hàng hóa tồn kho nhiều, người bán buộc phải hạ giá để kéo khách quay lại.","Nếu giá bị kéo thấp hơn điểm cân bằng, lượng cầu sẽ vượt lượng cung. Khi đó xuất hiện thiếu hụt: người mua tranh nhau mua, sẵn sàng trả cao hơn, và chính áp lực đó kéo giá tăng trở lại gần điểm cân bằng."],"objectives":["Xác định được điểm cân bằng trên đồ thị cung cầu.","Phân biệt trạng thái dư thừa và thiếu hụt.","Hiểu cơ chế tự điều chỉnh của giá trên thị trường."],"pointsReward":45,"summary":{"title":"Tóm tắt Tập 1C: Điểm cân bằng","points":["Điểm cân bằng là giao điểm của đường cung và đường cầu, nơi lượng cung bằng lượng cầu.","Giá cao hơn điểm cân bằng thường gây dư thừa vì cung lớn hơn cầu.","Giá thấp hơn điểm cân bằng thường gây thiếu hụt vì cầu lớn hơn cung.","Thị trường có xu hướng tự điều chỉnh để quay lại gần điểm cân bằng."]},"moduleId":"module-1","moduleTitle":"Unit 1: Cung và Cầu","moduleDescription":"Đi từ quy luật cầu, quy luật cung đến điểm cân bằng và các ngoại lệ để hiểu vì sao giá cả thị trường luôn biến động.","category":"economics","unitCode":"1","episodeCode":"1C","quiz":[]}', '$.title', l.title, '$.pointsReward', l.points_reward,
    '$.quiz', json(COALESCE((SELECT json_group_array(json_object(
      'id', q.id, 'question', q.question_text, 'options', json(q.options_json),
      'correctAnswer', q.correct_option, 'explanation', q.explanation))
      FROM (SELECT * FROM quiz_questions WHERE lesson_id = l.id AND is_active = 1 ORDER BY question_order) q), '[]'))),
  NULL, strftime('%Y-%m-%dT%H:%M:%fZ','now'), strftime('%Y-%m-%dT%H:%M:%fZ','now'), ''
FROM lessons l WHERE l.id = 'lesson-1c' AND l.published_revision_id IS NULL
  AND NOT EXISTS (SELECT 1 FROM lesson_revisions r WHERE r.lesson_id = l.id);
UPDATE lessons SET published_revision_id = 'seed:lesson-1c:1'
WHERE id = 'lesson-1c' AND published_revision_id IS NULL AND is_active = 1
  AND EXISTS (SELECT 1 FROM lesson_revisions WHERE id = 'seed:lesson-1c:1' AND status = 'published');


INSERT OR IGNORE INTO lesson_revisions
  (id, lesson_id, version, lock_version, status, content_json, created_by, created_at, updated_at, feedback)
SELECT 'seed:lesson-1d:1', l.id, 1, 1, 'published',
  json_set('{"order":"1D","title":"Ngoại lệ của Cung Cầu","shortDescription":"Không phải lúc nào giá tăng cũng làm người ta mua ít hơn: Veblen và Giffen là hai ngoại lệ rất nổi tiếng.","duration":"02 phút","videoUrl":"https://www.youtube.com/embed/YKJaAgNbNq4","youtubeId":"YKJaAgNbNq4","overview":"Tập 1D mở rộng quy luật cung cầu bằng hai trường hợp đặc biệt, nơi tâm lý và hoàn cảnh làm hành vi mua đi ngược trực giác thông thường.","mainContentTitle":"Khi cung cầu gặp ngoại lệ","mainContent":["Hàng hóa Veblen là những món đồ xa xỉ mà giá đắt lại chính là một phần sức hút của chúng. Người mua tìm đến không chỉ vì công dụng mà còn vì giá trị thể hiện đẳng cấp, nên giá càng cao đôi khi lượng cầu lại càng tăng.","Hàng hóa Giffen thường là nhu yếu phẩm giá rẻ trong bối cảnh người tiêu dùng quá hạn hẹp ngân sách. Khi giá tăng, họ không đủ tiền chuyển sang món tốt hơn nên lại buộc phải mua nhiều hàng hóa rẻ đó hơn để duy trì cuộc sống.","Hai ngoại lệ này cho thấy kinh tế học không chỉ là đồ thị và con số. Tâm lý, vị thế xã hội và hoàn cảnh sống thực tế đều có thể khiến hành vi con người khác đi so với mô hình thông thường."],"objectives":["Phân biệt ngoại lệ Veblen và Giffen.","Hiểu vai trò của tâm lý và hoàn cảnh trong hành vi mua.","Nhận ra vì sao đường cầu đôi khi không dốc xuống như bình thường."],"pointsReward":45,"summary":{"title":"Tóm tắt Tập 1D: Ngoại lệ của Cung Cầu","points":["Hàng hóa Veblen có thể được mua nhiều hơn khi giá tăng vì nó gắn với việc thể hiện đẳng cấp.","Hàng hóa Giffen là ngoại lệ khi người mua quá nghèo buộc phải mua nhiều nhu yếu phẩm rẻ hơn dù giá tăng.","Tâm lý và hoàn cảnh sống thực tế có thể làm hành vi mua đi ngược quy luật cầu thông thường.","Ngoại lệ cung cầu cho thấy kinh tế học gắn chặt với hành vi con người."]},"moduleId":"module-1","moduleTitle":"Unit 1: Cung và Cầu","moduleDescription":"Đi từ quy luật cầu, quy luật cung đến điểm cân bằng và các ngoại lệ để hiểu vì sao giá cả thị trường luôn biến động.","category":"economics","unitCode":"1","episodeCode":"1D","quiz":[]}', '$.title', l.title, '$.pointsReward', l.points_reward,
    '$.quiz', json(COALESCE((SELECT json_group_array(json_object(
      'id', q.id, 'question', q.question_text, 'options', json(q.options_json),
      'correctAnswer', q.correct_option, 'explanation', q.explanation))
      FROM (SELECT * FROM quiz_questions WHERE lesson_id = l.id AND is_active = 1 ORDER BY question_order) q), '[]'))),
  NULL, strftime('%Y-%m-%dT%H:%M:%fZ','now'), strftime('%Y-%m-%dT%H:%M:%fZ','now'), ''
FROM lessons l WHERE l.id = 'lesson-1d' AND l.published_revision_id IS NULL
  AND NOT EXISTS (SELECT 1 FROM lesson_revisions r WHERE r.lesson_id = l.id);
UPDATE lessons SET published_revision_id = 'seed:lesson-1d:1'
WHERE id = 'lesson-1d' AND published_revision_id IS NULL AND is_active = 1
  AND EXISTS (SELECT 1 FROM lesson_revisions WHERE id = 'seed:lesson-1d:1' AND status = 'published');


INSERT OR IGNORE INTO lesson_revisions
  (id, lesson_id, version, lock_version, status, content_json, created_by, created_at, updated_at, feedback)
SELECT 'seed:lesson-2a:1', l.id, 1, 1, 'published',
  json_set('{"order":"2A","title":"Độ co giãn của cầu theo giá (PED)","shortDescription":"Sợi dây thun hay thanh sắt: hiểu vì sao có món chỉ đổi giá một chút là lượng cầu đổi rất mạnh, còn có món gần như không nhúc nhích.","duration":"08 phút","videoUrl":"https://www.youtube.com/embed/fO4tKHj3_lA","youtubeId":"fO4tKHj3_lA","overview":"Tập 2A giải thích Độ co giãn của Cầu theo Giá (PED) - thước đo sự nhạy cảm của người mua trước các biến động giá cả trên thị trường.","mainContentTitle":"PED là gì và đường cầu phản ứng ra sao?","mainContent":["Độ co giãn của cầu theo giá (Price Elasticity of Demand - PED) đo lường mức độ thay đổi của lượng cầu khi giá của chính hàng hóa đó thay đổi. Đây là công cụ đo lường mức độ nhạy cảm của người tiêu dùng trước các biến động giá cả.","Cầu co giãn (Elastic Demand) được ví như sợi dây thun đàn hồi: giá chỉ thay đổi một chút nhưng lượng cầu có thể phản ứng rất mạnh (tỷ lệ % thay đổi của lượng cầu lớn hơn tỷ lệ % thay đổi của giá). Những món có nhiều hàng thay thế thường có cầu co giãn.","Cầu kém co giãn (Inelastic Demand) giống như thanh sắt cứng: dù giá có thay đổi nhiều, lượng cầu chỉ thay đổi tương đối nhỏ. Người học thường gặp điều này ở các hàng hóa thiết yếu hoặc khó thay thế.","Trên đồ thị, đường cầu co giãn thường tương đối phẳng (lài), trong khi đường cầu kém co giãn lại tương đối dốc (đứng). Nếu người bán tăng giá một mặt hàng có cầu co giãn cao, khách hàng sẽ bỏ đi rất nhiều khiến tổng doanh thu sụt giảm."],"objectives":["Định nghĩa và giải thích ý nghĩa của chỉ số PED.","Phân biệt cầu co giãn (sợi dây thun) và cầu kém co giãn (thanh sắt).","Nhận ra hình dạng phẳng (lài) và dốc (đứng) của đường cầu trên đồ thị.","Hiểu mối quan hệ giữa thay đổi giá, PED và doanh thu của người bán."],"pointsReward":45,"summary":{"title":"Tóm tắt Tập 2A: Độ co giãn của cầu theo giá (PED)","points":["PED đo lường mức độ phản ứng của lượng cầu khi giá hàng hóa thay đổi.","Cầu co giãn: Lượng cầu đổi mạnh khi giá đổi nhẹ; đường cầu tương đối phẳng/lài.","Cầu kém co giãn: Lượng cầu đổi rất ít dù giá đổi nhiều; đường cầu tương đối dốc/đứng.","Biết PED giúp người bán ra quyết định định giá thông minh để tối ưu doanh thu."]},"moduleId":"module-2","moduleTitle":"Unit 2: Độ co giãn","moduleDescription":"Hiểu cách cầu và cung phản ứng mạnh hay yếu trước thay đổi về giá, thu nhập và mối quan hệ giữa các hàng hóa.","category":"economics","unitCode":"2","episodeCode":"2A","quiz":[]}', '$.title', l.title, '$.pointsReward', l.points_reward,
    '$.quiz', json(COALESCE((SELECT json_group_array(json_object(
      'id', q.id, 'question', q.question_text, 'options', json(q.options_json),
      'correctAnswer', q.correct_option, 'explanation', q.explanation))
      FROM (SELECT * FROM quiz_questions WHERE lesson_id = l.id AND is_active = 1 ORDER BY question_order) q), '[]'))),
  NULL, strftime('%Y-%m-%dT%H:%M:%fZ','now'), strftime('%Y-%m-%dT%H:%M:%fZ','now'), ''
FROM lessons l WHERE l.id = 'lesson-2a' AND l.published_revision_id IS NULL
  AND NOT EXISTS (SELECT 1 FROM lesson_revisions r WHERE r.lesson_id = l.id);
UPDATE lessons SET published_revision_id = 'seed:lesson-2a:1'
WHERE id = 'lesson-2a' AND published_revision_id IS NULL AND is_active = 1
  AND EXISTS (SELECT 1 FROM lesson_revisions WHERE id = 'seed:lesson-2a:1' AND status = 'published');


INSERT OR IGNORE INTO lesson_revisions
  (id, lesson_id, version, lock_version, status, content_json, created_by, created_at, updated_at, feedback)
SELECT 'seed:lesson-2b:1', l.id, 1, 1, 'published',
  json_set('{"order":"2B","title":"Các yếu tố ảnh hưởng PED","shortDescription":"Tại sao xăng tăng bạn vẫn phải đổ: phân tích 3 yếu tố quyết định độ nhạy của cầu gồm hàng thay thế, hàng thiết yếu và thời gian.","duration":"08 phút","videoUrl":"https://www.youtube.com/embed/uLCxTHQL3ic","youtubeId":"uLCxTHQL3ic","overview":"Tập 2B giải thích ba yếu tố then chốt quyết định PED: hàng thay thế, mức độ thiết yếu và thời gian thích ứng của người tiêu dùng.","mainContentTitle":"3 nhân tố then chốt chi phối PED","mainContent":["Số lượng hàng thay thế (Substitutes): Càng có nhiều hàng thay thế tương đương trên thị trường, cầu của mặt hàng đó càng co giãn. Ví dụ: nếu một quán trà sữa tăng giá, bạn có thể dễ dàng chuyển sang quán trà sữa bên cạnh hoặc uống nước ép, cà phê.","Mức độ thiết yếu (Necessities vs Luxuries): Hàng hóa càng thiết yếu với đời sống thì cầu càng kém co giãn. Xăng xe là ví dụ điển hình: dù giá xăng tăng cao, học sinh và người đi làm vẫn bắt buộc phải đổ xăng để di chuyển mỗi ngày.","Yếu tố thời gian (Time Horizon): Trong ngắn hạn, người mua khó đổi thói quen ngay nên cầu kém co giãn. Nhưng về dài hạn, họ có thời gian tìm phương tiện khác (như xe bus, xe điện) hoặc sắp xếp lại sinh hoạt, khiến cầu trở nên co giãn hơn."],"objectives":["Giải thích vai trò của hàng thay thế đối với PED.","Phân biệt mức độ co giãn giữa hàng thiết yếu và hàng xa xỉ.","Hiểu thời gian làm thay đổi phản ứng tiêu dùng từ ngắn hạn sang dài hạn."],"pointsReward":45,"summary":{"title":"Tóm tắt Tập 2B: Các yếu tố ảnh hưởng PED","points":["Hàng thay thế: Càng nhiều lựa chọn thay thế, cầu càng co giãn.","Hàng thiết yếu: Rất cần thiết cho cuộc sống nên cầu kém co giãn (ví dụ: xăng, muối ăn).","Thời gian: Cầu trong dài hạn luôn co giãn hơn trong ngắn hạn do người mua có thời gian thích ứng.","Hiểu 3 yếu tố này giúp giải thích hành vi chi tiêu hằng ngày của người tiêu dùng."]},"moduleId":"module-2","moduleTitle":"Unit 2: Độ co giãn","moduleDescription":"Hiểu cách cầu và cung phản ứng mạnh hay yếu trước thay đổi về giá, thu nhập và mối quan hệ giữa các hàng hóa.","category":"economics","unitCode":"2","episodeCode":"2B","quiz":[]}', '$.title', l.title, '$.pointsReward', l.points_reward,
    '$.quiz', json(COALESCE((SELECT json_group_array(json_object(
      'id', q.id, 'question', q.question_text, 'options', json(q.options_json),
      'correctAnswer', q.correct_option, 'explanation', q.explanation))
      FROM (SELECT * FROM quiz_questions WHERE lesson_id = l.id AND is_active = 1 ORDER BY question_order) q), '[]'))),
  NULL, strftime('%Y-%m-%dT%H:%M:%fZ','now'), strftime('%Y-%m-%dT%H:%M:%fZ','now'), ''
FROM lessons l WHERE l.id = 'lesson-2b' AND l.published_revision_id IS NULL
  AND NOT EXISTS (SELECT 1 FROM lesson_revisions r WHERE r.lesson_id = l.id);
UPDATE lessons SET published_revision_id = 'seed:lesson-2b:1'
WHERE id = 'lesson-2b' AND published_revision_id IS NULL AND is_active = 1
  AND EXISTS (SELECT 1 FROM lesson_revisions WHERE id = 'seed:lesson-2b:1' AND status = 'published');


INSERT OR IGNORE INTO lesson_revisions
  (id, lesson_id, version, lock_version, status, content_json, created_by, created_at, updated_at, feedback)
SELECT 'seed:lesson-2c:1', l.id, 1, 1, 'published',
  json_set('{"order":"2C","title":"Độ co giãn theo thu nhập (YED)","shortDescription":"Giàu rồi thì ăn gì: phân biệt Normal Goods và Inferior Goods qua cách lượng cầu phản ứng khi thu nhập thay đổi.","duration":"08 phút","videoUrl":"https://www.youtube.com/embed/M6b7QVOctn8","youtubeId":"M6b7QVOctn8","overview":"Tập 2C giới thiệu YED, Normal Goods và Inferior Goods để giải thích sự thay đổi trong lựa chọn tiêu dùng khi thu nhập tăng hoặc giảm.","mainContentTitle":"YED cho biết thu nhập làm cầu đổi thế nào?","mainContent":["Độ co giãn của cầu theo thu nhập (Income Elasticity of Demand - YED) cho biết mức độ thay đổi của lượng cầu khi thu nhập của người tiêu dùng thay đổi.","Hàng hóa thông thường (Normal Goods) có YED > 0 (dương). Khi thu nhập tăng lên, người mua thường muốn mua nhiều hơn hoặc nâng cấp lên các lựa chọn tốt hơn, như đi du lịch, mua iPhone, ăn bít tết.","Hàng hóa thứ cấp / cấp thấp (Inferior Goods) có YED < 0 (âm). Khi thu nhập tăng, người mua có xu hướng giảm dùng các món giá rẻ trước đây (như mì tôm ăn liền, xe buýt công cộng, đồ cũ second-hand) để chuyển sang hàng hóa chất lượng cao hơn."],"objectives":["Hiểu YED đo phản ứng của lượng cầu trước thay đổi về thu nhập.","Phân biệt Normal Goods (YED > 0) và Inferior Goods (YED < 0).","Áp dụng vào các ví dụ thực tế: du lịch, iPhone, bít tết, mì tôm, xe buýt, đồ second-hand."],"pointsReward":45,"summary":{"title":"Tóm tắt Tập 2C: Độ co giãn theo thu nhập (YED)","points":["YED đo lường phản ứng của lượng cầu trước sự thay đổi của thu nhập.","Normal Goods (Hàng thông thường): YED > 0, thu nhập tăng -> cầu tăng (du lịch, iPhone, steak).","Inferior Goods (Hàng thứ cấp): YED < 0, thu nhập tăng -> cầu giảm (mì tôm, xe buýt, đồ cũ).","Dấu của YED là cơ sở quan trọng để phân loại nhóm hàng hóa."]},"moduleId":"module-2","moduleTitle":"Unit 2: Độ co giãn","moduleDescription":"Hiểu cách cầu và cung phản ứng mạnh hay yếu trước thay đổi về giá, thu nhập và mối quan hệ giữa các hàng hóa.","category":"economics","unitCode":"2","episodeCode":"2C","quiz":[]}', '$.title', l.title, '$.pointsReward', l.points_reward,
    '$.quiz', json(COALESCE((SELECT json_group_array(json_object(
      'id', q.id, 'question', q.question_text, 'options', json(q.options_json),
      'correctAnswer', q.correct_option, 'explanation', q.explanation))
      FROM (SELECT * FROM quiz_questions WHERE lesson_id = l.id AND is_active = 1 ORDER BY question_order) q), '[]'))),
  NULL, strftime('%Y-%m-%dT%H:%M:%fZ','now'), strftime('%Y-%m-%dT%H:%M:%fZ','now'), ''
FROM lessons l WHERE l.id = 'lesson-2c' AND l.published_revision_id IS NULL
  AND NOT EXISTS (SELECT 1 FROM lesson_revisions r WHERE r.lesson_id = l.id);
UPDATE lessons SET published_revision_id = 'seed:lesson-2c:1'
WHERE id = 'lesson-2c' AND published_revision_id IS NULL AND is_active = 1
  AND EXISTS (SELECT 1 FROM lesson_revisions WHERE id = 'seed:lesson-2c:1' AND status = 'published');


INSERT OR IGNORE INTO lesson_revisions
  (id, lesson_id, version, lock_version, status, content_json, created_by, created_at, updated_at, feedback)
SELECT 'seed:lesson-2d:1', l.id, 1, 1, 'published',
  json_set('{"order":"2D","title":"Độ co giãn chéo (XED)","shortDescription":"Trâu bò húc nhau, ruồi muỗi có chết: phân biệt hàng thay thế và hàng bổ sung qua chỉ số XED.","duration":"08 phút","videoUrl":"","overview":"Tập 2D giải thích hiện tượng khi một mặt hàng đổi giá làm thay đổi lượng cầu của mặt hàng khác thông qua chỉ số XED.","mainContentTitle":"XED - Mối quan hệ giữa các cặp hàng hóa","mainContent":["Độ co giãn chéo của cầu (Cross Elasticity of Demand - XED) đo lường mức độ thay đổi của lượng cầu hàng hóa A khi giá của hàng hóa B thay đổi.","Hàng hóa thay thế (Substitutes) có XED > 0 (dương). Khi giá hàng hóa này tăng, người tiêu dùng sẽ chuyển sang mua hàng hóa kia nhiều hơn. Ví dụ kinh điển: Coca-Cola và Pepsi. Nếu Coca-Cola tăng giá mạnh, nhiều người sẽ chọn mua Pepsi thay thế, làm lượng cầu Pepsi tăng lên.","Hàng hóa bổ sung (Complements) có XED < 0 (âm). Đây là những sản phẩm cần dùng kèm với nhau, như xe máy và xăng, hoặc máy in và mực in. Khi giá xe máy hoặc máy in tăng cao khiến người mua ít đi, lượng cầu đối với xăng và mực in cũng giảm theo."],"objectives":["Hiểu định nghĩa và ý nghĩa của độ co giãn chéo XED.","Nhớ dấu của XED: XED > 0 với hàng thay thế, XED < 0 với hàng bổ sung.","Áp dụng vào các ví dụ: Coca/Pepsi, xe máy/xăng, máy in/mực in."],"pointsReward":45,"summary":{"title":"Tóm tắt Tập 2D: Độ co giãn chéo (XED)","points":["XED đo lường lượng cầu hàng A thay đổi thế nào khi giá hàng B thay đổi.","Hàng thay thế (Substitutes): XED > 0 (Giá Coca tăng -> Cầu Pepsi tăng).","Hàng bổ sung (Complements): XED < 0 (Giá xe máy tăng -> Cầu xăng giảm).","Nếu XED = 0, hai hàng hóa độc lập không ảnh hưởng lẫn nhau."]},"moduleId":"module-2","moduleTitle":"Unit 2: Độ co giãn","moduleDescription":"Hiểu cách cầu và cung phản ứng mạnh hay yếu trước thay đổi về giá, thu nhập và mối quan hệ giữa các hàng hóa.","category":"economics","unitCode":"2","episodeCode":"2D","quiz":[]}', '$.title', l.title, '$.pointsReward', l.points_reward,
    '$.quiz', json(COALESCE((SELECT json_group_array(json_object(
      'id', q.id, 'question', q.question_text, 'options', json(q.options_json),
      'correctAnswer', q.correct_option, 'explanation', q.explanation))
      FROM (SELECT * FROM quiz_questions WHERE lesson_id = l.id AND is_active = 1 ORDER BY question_order) q), '[]'))),
  NULL, strftime('%Y-%m-%dT%H:%M:%fZ','now'), strftime('%Y-%m-%dT%H:%M:%fZ','now'), ''
FROM lessons l WHERE l.id = 'lesson-2d' AND l.published_revision_id IS NULL
  AND NOT EXISTS (SELECT 1 FROM lesson_revisions r WHERE r.lesson_id = l.id);
UPDATE lessons SET published_revision_id = 'seed:lesson-2d:1'
WHERE id = 'lesson-2d' AND published_revision_id IS NULL AND is_active = 1
  AND EXISTS (SELECT 1 FROM lesson_revisions WHERE id = 'seed:lesson-2d:1' AND status = 'published');


INSERT OR IGNORE INTO lesson_revisions
  (id, lesson_id, version, lock_version, status, content_json, created_by, created_at, updated_at, feedback)
SELECT 'seed:lesson-2e:1', l.id, 1, 1, 'published',
  json_set('{"order":"2E","title":"Độ co giãn của cung (PES)","shortDescription":"Nhà máy có biến hình kịp không: tìm hiểu khả năng và tốc độ phản ứng của người bán trước tín hiệu giá thị trường.","duration":"08 phút","videoUrl":"","overview":"Tập 2E lật ngược vấn đề sang phía người bán: khi giá thị trường tăng cao, các nhà sản xuất có thể điều chỉnh sản lượng nhanh hay chậm thông qua chỉ số PES.","mainContentTitle":"PES và khả năng điều chỉnh sản xuất","mainContent":["Độ co giãn của cung theo giá (Price Elasticity of Supply - PES) đo lường mức độ thay đổi của lượng cung khi giá của chính hàng hóa đó thay đổi.","Cung co giãn (Elastic Supply) xảy ra khi người bán có thể nhanh chóng gia tăng sản lượng khi giá tăng. Ví dụ: trend bánh đồng xu phô mai gây sốt, người bán dễ dàng mua thêm máy làm bánh, nguyên liệu và mở tiệm chỉ trong vài ngày.","Cung kém co giãn (Inelastic Supply) xảy ra khi sản lượng khó tăng ngay lập tức dù giá có tăng cao. Ví dụ: cây sầu riêng cần từ 4 đến 6 năm mới cho quả, nên dù giá sầu riêng tăng vọt, nhà vườn cũng không thể có sầu riêng mới thu hoạch ngay ngày mai.","Các yếu tố chính quyết định PES bao gồm: Yếu tố thời gian (dài hạn cung co giãn hơn ngắn hạn), Khả năng tồn trữ hàng hóa trong kho, và Độ linh hoạt của quy trình sản xuất."],"objectives":["Nắm vững định nghĩa và ý nghĩa của PES từ góc độ người bán.","Phân biệt cung co giãn và cung kém co giãn qua các ví dụ thực tế.","Hiểu vai trò của thời gian, khả năng lưu kho và công nghệ trong việc điều chỉnh nguồn cung."],"pointsReward":45,"summary":{"title":"Tóm tắt Tập 2E: Độ co giãn của cung (PES)","points":["PES đo phản ứng của lượng cung khi giá cả hàng hóa thay đổi.","Cung co giãn: Dễ mở rộng sản xuất khi giá tăng (trend bánh đồng xu phô mai).","Cung kém co giãn: Cần nhiều thời gian hoặc khó nhân rộng (trồng sầu riêng).","Thời gian càng dài và kho bãi càng linh hoạt thì cung càng co giãn."]},"moduleId":"module-2","moduleTitle":"Unit 2: Độ co giãn","moduleDescription":"Hiểu cách cầu và cung phản ứng mạnh hay yếu trước thay đổi về giá, thu nhập và mối quan hệ giữa các hàng hóa.","category":"economics","unitCode":"2","episodeCode":"2E","quiz":[]}', '$.title', l.title, '$.pointsReward', l.points_reward,
    '$.quiz', json(COALESCE((SELECT json_group_array(json_object(
      'id', q.id, 'question', q.question_text, 'options', json(q.options_json),
      'correctAnswer', q.correct_option, 'explanation', q.explanation))
      FROM (SELECT * FROM quiz_questions WHERE lesson_id = l.id AND is_active = 1 ORDER BY question_order) q), '[]'))),
  NULL, strftime('%Y-%m-%dT%H:%M:%fZ','now'), strftime('%Y-%m-%dT%H:%M:%fZ','now'), ''
FROM lessons l WHERE l.id = 'lesson-2e' AND l.published_revision_id IS NULL
  AND NOT EXISTS (SELECT 1 FROM lesson_revisions r WHERE r.lesson_id = l.id);
UPDATE lessons SET published_revision_id = 'seed:lesson-2e:1'
WHERE id = 'lesson-2e' AND published_revision_id IS NULL AND is_active = 1
  AND EXISTS (SELECT 1 FROM lesson_revisions WHERE id = 'seed:lesson-2e:1' AND status = 'published');


INSERT OR IGNORE INTO lesson_revisions
  (id, lesson_id, version, lock_version, status, content_json, created_by, created_at, updated_at, feedback)
SELECT 'seed:lesson-5:1', l.id, 1, 1, 'published',
  json_set('{"order":5,"title":"Lập ngân sách 50/30/20","shortDescription":"Chia tiền thành ba nhóm rõ ràng để vừa đáp ứng nhu cầu, vừa còn chỗ cho tiết kiệm.","duration":"11 phút","videoUrl":"","overview":"Bài học giới thiệu quy tắc 50/30/20 dưới góc nhìn học sinh, giúp dễ áp dụng với tiền tiêu vặt và các khoản chi nhỏ mỗi tháng.","mainContentTitle":"Tiền của bạn nên được chia ra sao?","mainContent":["Quy tắc 50/30/20 là một cách rất dễ hiểu để quản lý tiền cá nhân. Theo cách này, khoảng 50% số tiền được dành cho nhu cầu thiết yếu như ăn uống, đi lại hoặc tài liệu học tập. Khoảng 30% dành cho những thứ bạn thích như giải trí, mua sắm nhỏ hoặc sở thích cá nhân.","Phần 20% còn lại được ưu tiên cho tiết kiệm hoặc mục tiêu lâu dài. Dù số tiền chưa lớn, việc tách riêng phần này ngay từ đầu giúp bạn hình thành thói quen giữ lại tiền cho tương lai thay vì tiêu hết rồi mới nghĩ đến tiết kiệm.","Điều quan trọng nhất của phương pháp này không phải là đúng từng đồng, mà là tạo cho bạn một khung rõ ràng khi chi tiêu. Khi biết tiền của mình nên đi vào nhóm nào, học sinh sẽ dễ kiểm soát ví tiền hơn và bớt rơi vào cảnh hết sạch tiền giữa tháng."],"objectives":["Phân biệt nhu cầu, mong muốn và tiết kiệm.","Biết cách chia tiền ngay khi vừa nhận được.","Nhìn ra các khoản chi đang lệch khỏi kế hoạch."],"pointsReward":50,"moduleId":"module-3","moduleTitle":"CHUYÊN ĐỀ 3 - TÀI CHÍNH CÁ NHÂN","moduleDescription":"Thiết lập nền tảng quản lý tiền cá nhân để chi tiêu rõ ràng và bớt căng thẳng cuối tháng.","category":"finance","unitCode":"3","episodeCode":"5","quiz":[]}', '$.title', l.title, '$.pointsReward', l.points_reward,
    '$.quiz', json(COALESCE((SELECT json_group_array(json_object(
      'id', q.id, 'question', q.question_text, 'options', json(q.options_json),
      'correctAnswer', q.correct_option, 'explanation', q.explanation))
      FROM (SELECT * FROM quiz_questions WHERE lesson_id = l.id AND is_active = 1 ORDER BY question_order) q), '[]'))),
  NULL, strftime('%Y-%m-%dT%H:%M:%fZ','now'), strftime('%Y-%m-%dT%H:%M:%fZ','now'), ''
FROM lessons l WHERE l.id = 'lesson-5' AND l.published_revision_id IS NULL
  AND NOT EXISTS (SELECT 1 FROM lesson_revisions r WHERE r.lesson_id = l.id);
UPDATE lessons SET published_revision_id = 'seed:lesson-5:1'
WHERE id = 'lesson-5' AND published_revision_id IS NULL AND is_active = 1
  AND EXISTS (SELECT 1 FROM lesson_revisions WHERE id = 'seed:lesson-5:1' AND status = 'published');


INSERT OR IGNORE INTO lesson_revisions
  (id, lesson_id, version, lock_version, status, content_json, created_by, created_at, updated_at, feedback)
SELECT 'seed:lesson-6:1', l.id, 1, 1, 'published',
  json_set('{"order":6,"title":"Quỹ dự phòng để làm gì?","shortDescription":"Chuẩn bị một khoản tiền nhỏ nhưng sẵn sàng dùng khi có việc đột xuất.","duration":"08 phút","videoUrl":"","overview":"Quỹ dự phòng giúp bạn không bị động trước các chi phí bất ngờ như sửa xe, mua tài liệu gấp hoặc hỗ trợ gia đình.","mainContentTitle":"Quỹ dự phòng bảo vệ bạn như thế nào?","mainContent":["Quỹ dự phòng là khoản tiền được để riêng cho những tình huống bất ngờ như xe hỏng, điện thoại cần sửa gấp hoặc phát sinh chi phí học tập ngoài kế hoạch. Đây không phải là tiền để tiêu cho vui, mà là lớp đệm giúp bạn không bị rối khi có việc đột xuất.","Khi có quỹ dự phòng, bạn sẽ bớt phải vay mượn hoặc lấy tiền từ những mục tiêu khác để xử lý tình huống khẩn cấp. Điều này đặc biệt quan trọng với học sinh vì những khoản chi bất ngờ thường khiến kế hoạch tiền tiêu vặt bị đảo lộn rất nhanh.","Không cần đợi đến khi có nhiều tiền mới bắt đầu lập quỹ dự phòng. Chỉ cần để dành đều đặn một khoản nhỏ, bạn đã tạo ra cảm giác an toàn hơn trong tài chính cá nhân. Đây là thói quen rất hữu ích cho hiện tại và cả về sau."],"objectives":["Hiểu khi nào nên dùng quỹ dự phòng.","Phân biệt quỹ dự phòng với tiền chi tiêu thường ngày.","Biết vì sao nên tích lũy quỹ dần dần."],"pointsReward":45,"moduleId":"module-3","moduleTitle":"CHUYÊN ĐỀ 3 - TÀI CHÍNH CÁ NHÂN","moduleDescription":"Thiết lập nền tảng quản lý tiền cá nhân để chi tiêu rõ ràng và bớt căng thẳng cuối tháng.","category":"finance","unitCode":"3","episodeCode":"6","quiz":[]}', '$.title', l.title, '$.pointsReward', l.points_reward,
    '$.quiz', json(COALESCE((SELECT json_group_array(json_object(
      'id', q.id, 'question', q.question_text, 'options', json(q.options_json),
      'correctAnswer', q.correct_option, 'explanation', q.explanation))
      FROM (SELECT * FROM quiz_questions WHERE lesson_id = l.id AND is_active = 1 ORDER BY question_order) q), '[]'))),
  NULL, strftime('%Y-%m-%dT%H:%M:%fZ','now'), strftime('%Y-%m-%dT%H:%M:%fZ','now'), ''
FROM lessons l WHERE l.id = 'lesson-6' AND l.published_revision_id IS NULL
  AND NOT EXISTS (SELECT 1 FROM lesson_revisions r WHERE r.lesson_id = l.id);
UPDATE lessons SET published_revision_id = 'seed:lesson-6:1'
WHERE id = 'lesson-6' AND published_revision_id IS NULL AND is_active = 1
  AND EXISTS (SELECT 1 FROM lesson_revisions WHERE id = 'seed:lesson-6:1' AND status = 'published');


INSERT OR IGNORE INTO lesson_revisions
  (id, lesson_id, version, lock_version, status, content_json, created_by, created_at, updated_at, feedback)
SELECT 'seed:lesson-7:1', l.id, 1, 1, 'published',
  json_set('{"order":7,"title":"Lãi kép hoạt động ra sao?","shortDescription":"Hiểu vì sao bắt đầu sớm và đều đặn thường quan trọng hơn bắt đầu thật lớn.","duration":"09 phút","videoUrl":"","overview":"Bài học mô tả lãi kép bằng ngôn ngữ rất đơn giản: tiền lãi tiếp tục sinh thêm lãi theo thời gian.","mainContentTitle":"Lãi kép giúp tiền tăng lên ra sao?","mainContent":["Lãi kép là cách tiền tăng lên khi phần lãi kiếm được tiếp tục được cộng vào số tiền ban đầu để tạo ra lãi mới. Nói đơn giản, tiền không chỉ sinh lời một lần mà còn sinh lời trên cả phần lãi đã có trước đó.","Điều khiến lãi kép trở nên mạnh là thời gian. Nếu bạn bắt đầu tiết kiệm hoặc đầu tư sớm, số tiền có nhiều cơ hội hơn để tăng dần qua từng giai đoạn. Ngay cả một khoản nhỏ nhưng đều đặn trong thời gian dài cũng có thể tạo ra kết quả đáng kể.","Vì vậy, bài học quan trọng ở đây là không cần chờ có thật nhiều tiền mới bắt đầu. Quan trọng hơn là bắt đầu sớm, duy trì đều và kiên nhẫn với mục tiêu của mình. Đó chính là cách lãi kép phát huy tác dụng rõ nhất."],"objectives":["Hiểu khái niệm lãi sinh ra trên cả gốc lẫn lãi cũ.","Nhận ra vai trò của thời gian trong tích lũy.","Biết vì sao gửi đều quan trọng hơn chờ có thật nhiều tiền."],"pointsReward":55,"moduleId":"module-4","moduleTitle":"CHUYÊN ĐỀ 4 - TÍCH LŨY VÀ MỤC TIÊU","moduleDescription":"Đi xa hơn một bước với lãi kép và cách đặt mục tiêu tài chính ngắn hạn, dài hạn.","category":"finance","unitCode":"4","episodeCode":"7","quiz":[]}', '$.title', l.title, '$.pointsReward', l.points_reward,
    '$.quiz', json(COALESCE((SELECT json_group_array(json_object(
      'id', q.id, 'question', q.question_text, 'options', json(q.options_json),
      'correctAnswer', q.correct_option, 'explanation', q.explanation))
      FROM (SELECT * FROM quiz_questions WHERE lesson_id = l.id AND is_active = 1 ORDER BY question_order) q), '[]'))),
  NULL, strftime('%Y-%m-%dT%H:%M:%fZ','now'), strftime('%Y-%m-%dT%H:%M:%fZ','now'), ''
FROM lessons l WHERE l.id = 'lesson-7' AND l.published_revision_id IS NULL
  AND NOT EXISTS (SELECT 1 FROM lesson_revisions r WHERE r.lesson_id = l.id);
UPDATE lessons SET published_revision_id = 'seed:lesson-7:1'
WHERE id = 'lesson-7' AND published_revision_id IS NULL AND is_active = 1
  AND EXISTS (SELECT 1 FROM lesson_revisions WHERE id = 'seed:lesson-7:1' AND status = 'published');


INSERT OR IGNORE INTO lesson_revisions
  (id, lesson_id, version, lock_version, status, content_json, created_by, created_at, updated_at, feedback)
SELECT 'seed:lesson-8:1', l.id, 1, 1, 'published',
  json_set('{"order":8,"title":"Mục tiêu tài chính ngắn và dài hạn","shortDescription":"Biến mong muốn mơ hồ thành mục tiêu có số tiền, thời gian và kế hoạch rõ ràng.","duration":"07 phút","videoUrl":"","overview":"Bài học giúp người học tách mục tiêu gần như mua sách, học phí khóa ngắn hạn khỏi mục tiêu dài hơn như laptop hoặc quỹ du học.","mainContentTitle":"Đặt mục tiêu tài chính như thế nào cho rõ ràng?","mainContent":["Một mục tiêu tài chính rõ ràng không chỉ nói rằng bạn muốn tiết kiệm, mà còn phải cho biết bạn muốn dành bao nhiêu tiền và trong khoảng thời gian nào. Khi mục tiêu có con số và thời hạn cụ thể, bạn sẽ dễ theo dõi tiến độ hơn nhiều.","Mục tiêu ngắn hạn có thể là mua sách, đóng học phí cho một khóa học hoặc dành tiền cho một chuyến đi gần. Mục tiêu dài hạn thường cần nhiều thời gian hơn, như mua laptop, chuẩn bị cho đại học hoặc tích lũy cho một kế hoạch lớn hơn trong tương lai.","Khi biết chia mục tiêu thành từng bước nhỏ, học sinh sẽ thấy việc tiết kiệm bớt áp lực hơn. Thay vì nghĩ đến một số tiền quá lớn, bạn chỉ cần tập trung vào khoản nhỏ cần hoàn thành trong tuần hoặc trong tháng. Cách này giúp mục tiêu trở nên thực tế và dễ làm hơn."],"objectives":["Phân biệt mục tiêu ngắn hạn và dài hạn.","Gắn mục tiêu với thời gian và số tiền cụ thể.","Biết chia mục tiêu lớn thành các bước nhỏ để theo dõi."],"pointsReward":45,"moduleId":"module-4","moduleTitle":"CHUYÊN ĐỀ 4 - TÍCH LŨY VÀ MỤC TIÊU","moduleDescription":"Đi xa hơn một bước với lãi kép và cách đặt mục tiêu tài chính ngắn hạn, dài hạn.","category":"finance","unitCode":"4","episodeCode":"8","quiz":[]}', '$.title', l.title, '$.pointsReward', l.points_reward,
    '$.quiz', json(COALESCE((SELECT json_group_array(json_object(
      'id', q.id, 'question', q.question_text, 'options', json(q.options_json),
      'correctAnswer', q.correct_option, 'explanation', q.explanation))
      FROM (SELECT * FROM quiz_questions WHERE lesson_id = l.id AND is_active = 1 ORDER BY question_order) q), '[]'))),
  NULL, strftime('%Y-%m-%dT%H:%M:%fZ','now'), strftime('%Y-%m-%dT%H:%M:%fZ','now'), ''
FROM lessons l WHERE l.id = 'lesson-8' AND l.published_revision_id IS NULL
  AND NOT EXISTS (SELECT 1 FROM lesson_revisions r WHERE r.lesson_id = l.id);
UPDATE lessons SET published_revision_id = 'seed:lesson-8:1'
WHERE id = 'lesson-8' AND published_revision_id IS NULL AND is_active = 1
  AND EXISTS (SELECT 1 FROM lesson_revisions WHERE id = 'seed:lesson-8:1' AND status = 'published');
