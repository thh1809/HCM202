import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

// Mock database - trong thực tế sẽ sử dụng database thật
let documents: Array<{
  id: string
  name: string
  originalName: string
  size: number
  type: string
  uploadDate: Date
  filePath: string
  textContent?: string
}> = []

export async function GET() {
  try {
    return NextResponse.json({ documents })
  } catch (error) {
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi lấy danh sách tài liệu' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'Không có file được tải lên' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Chỉ hỗ trợ file PDF và Word' },
        { status: 400 }
      )
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File quá lớn. Kích thước tối đa là 10MB' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }

    // Save file
    const fileName = `${Date.now()}-${file.name}`
    const filePath = join(uploadsDir, fileName)
    await writeFile(filePath, buffer)

    // Extract text content
    let textContent = ''
    let pages = 0

    if (file.type === 'application/pdf') {
      try {
        const pdf = require('pdf-parse')
        const pdfData = await pdf(buffer)
        textContent = pdfData.text
        pages = pdfData.numpages
      } catch (error) {
        console.error('PDF parsing error:', error)
        return NextResponse.json(
          { error: 'Không thể đọc file PDF' },
          { status: 400 }
        )
      }
    } else if (file.type.includes('word')) {
      try {
        const mammoth = require('mammoth')
        const result = await mammoth.extractRawText({ buffer })
        textContent = result.value
        pages = Math.ceil(textContent.length / 2000) // Estimate pages
      } catch (error) {
        console.error('Word parsing error:', error)
        return NextResponse.json(
          { error: 'Không thể đọc file Word' },
          { status: 400 }
        )
      }
    }

    // Save extracted text to a separate file for AI to use
    const textFileName = `${fileName}.txt`
    const textFilePath = join(uploadsDir, textFileName)
    await writeFile(textFilePath, textContent, 'utf-8')

    // Add to documents list
    const newDocument = {
      id: Date.now().toString(),
      name: file.name,
      originalName: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date(),
      filePath: fileName,
      textContent: textContent.substring(0, 1000) // Store first 1000 chars for preview
    }

    documents.push(newDocument)

    return NextResponse.json({
      success: true,
      document: newDocument,
      pages,
      textLength: textContent.length,
      message: 'File đã được tải lên và xử lý thành công'
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi tải lên file' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Thiếu ID tài liệu' },
        { status: 400 }
      )
    }

    const documentIndex = documents.findIndex(doc => doc.id === id)
    if (documentIndex === -1) {
      return NextResponse.json(
        { error: 'Không tìm thấy tài liệu' },
        { status: 404 }
      )
    }

    const document = documents[documentIndex]
    
    // Remove from list
    documents.splice(documentIndex, 1)

    // In a real app, you would also delete the physical files
    // await unlink(join(process.cwd(), 'uploads', document.filePath))
    // await unlink(join(process.cwd(), 'uploads', `${document.filePath}.txt`))

    return NextResponse.json({
      success: true,
      message: 'Tài liệu đã được xóa thành công'
    })

  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi xóa tài liệu' },
      { status: 500 }
    )
  }
}
