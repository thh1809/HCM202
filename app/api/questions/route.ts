import { NextRequest, NextResponse } from 'next/server'

// Mock database - trong thực tế bạn sẽ sử dụng database thật
let questions: Array<{
  id: string
  question: string
  studentName: string
  studentId: string
  timestamp: Date
  answered: boolean
  answer?: string
}> = []

export async function GET() {
  try {
    return NextResponse.json({ questions })
  } catch (error) {
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi lấy danh sách câu hỏi' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { question, studentName, studentId } = await request.json()

    if (!question || !studentName || !studentId) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      )
    }

    const newQuestion = {
      id: Date.now().toString(),
      question,
      studentName,
      studentId,
      timestamp: new Date(),
      answered: false
    }

    questions.push(newQuestion)

    return NextResponse.json({
      success: true,
      question: newQuestion,
      message: 'Câu hỏi đã được gửi thành công'
    })

  } catch (error) {
    console.error('Question submission error:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi gửi câu hỏi' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, answer } = await request.json()

    if (!id || !answer) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      )
    }

    const questionIndex = questions.findIndex(q => q.id === id)
    if (questionIndex === -1) {
      return NextResponse.json(
        { error: 'Không tìm thấy câu hỏi' },
        { status: 404 }
      )
    }

    questions[questionIndex].answered = true
    questions[questionIndex].answer = answer

    return NextResponse.json({
      success: true,
      message: 'Câu hỏi đã được trả lời'
    })

  } catch (error) {
    console.error('Answer submission error:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi trả lời câu hỏi' },
      { status: 500 }
    )
  }
}
