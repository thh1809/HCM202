import { NextRequest, NextResponse } from 'next/server'
import { generateContent, GeminiMessage } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // System prompt cho AI về Tư tưởng Hồ Chí Minh
    const systemPrompt = `Bạn là một AI hỗ trợ học tập chuyên về môn Tư tưởng Hồ Chí Minh. Nhiệm vụ của bạn:

1. Trả lời các câu hỏi về tư tưởng Hồ Chí Minh một cách chính xác và có căn cứ
2. Giải thích các khái niệm, nguyên lý một cách dễ hiểu
3. Hỗ trợ sinh viên ôn tập và chuẩn bị thi
4. Luôn trả lời bằng tiếng Việt
5. Nếu không chắc chắn về câu trả lời, hãy đề xuất sinh viên hỏi giáo viên

Các chủ đề chính bạn có thể hỗ trợ:
- Tư tưởng về độc lập dân tộc và chủ nghĩa xã hội
- Tư tưởng về Đảng Cộng sản Việt Nam
- Tư tưởng về đại đoàn kết dân tộc
- Tư tưởng về đạo đức cách mạng
- Tư tưởng về văn hóa, giáo dục
- Tư tưởng về con người và phát triển con người

Hãy trả lời một cách nhiệt tình, chính xác và hữu ích.`

    // Tạo messages cho Gemini API
    const messages: GeminiMessage[] = [
      {
        role: 'user',
        parts: [{ text: `${systemPrompt}\n\nCâu hỏi của sinh viên: ${message}` }]
      }
    ]

    const response = await generateContent(messages)

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Gemini API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Có lỗi xảy ra khi xử lý câu hỏi' },
      { status: 500 }
    )
  }
}
