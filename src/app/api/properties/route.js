import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Build query params for backend API
    const params = new URLSearchParams()
    
    // Add all search params to backend request
    searchParams.forEach((value, key) => {
      params.append(key, value)
    })

    console.log('Fetching properties from backend with params:', params.toString())

    // Call backend API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/properties?${params.toString()}`,
      {
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY || 'dd-property-api-key-2025'
        }
      }
    )

    if (!response.ok) {
      console.error('Backend API error:', response.status, response.statusText)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch properties' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    console.log('Backend API response:', {
      success: data.success,
      total: data.total,
      dataLength: data.data?.length
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in properties API route:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
