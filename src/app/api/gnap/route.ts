// app/api/gnap/route.ts

import { NextResponse } from 'next/server'
import crypto from 'crypto'

const secretKey = process.env.GNAP_SECRET_KEY || crypto.randomBytes(32).toString('hex')

export async function GET(request: Request) {
  return NextResponse.json({ secretKey })
}

export async function POST(request: Request) {
  const body = await request.json()

  console.log('Request body:', body)

  // Check if the request has a 'grant_type' field
  if (!body.grant_type) {
    console.log('Missing grant_type field')
    return NextResponse.json({ error: 'Missing grant_type field' }, { status: 400 })
  }

  // Check if the request has a 'client_id' field
  if (!body.client_id) {
    console.log('Missing client_id field')
    return NextResponse.json({ error: 'Missing client_id field' }, { status: 400 })
  }

  // Check if the request has a 'access_token' field
  if (!body.access_token) {
    console.log('Missing access_token field')
    return NextResponse.json({ error: 'Missing access_token field' }, { status: 400 })
  }

  try {
    // Check if the access_token is a Bearer token
    const bearerToken = body.access_token.startsWith('Bearer ') ? body.access_token.slice(7) : body.access_token
    console.log('Access token:', bearerToken)

    // Validate the access_token by checking if it's a valid random string
    if (typeof bearerToken === 'string' && bearerToken.length === 64 && /^[a-f0-9]+$/.test(bearerToken)) {
      // If the validation is successful, return 'Success'
      return NextResponse.json({ status: 'Success' }, { status: 200 })
    } else {
      // If the validation fails, return 'Failure'
      return NextResponse.json({ error: 'Failure' }, { status: 401 })
    }
  } catch (err) {
    console.error('Error verifying access token:', err)
    // If the verification fails, return 'Failure'
    return NextResponse.json({ error: 'Failure' }, { status: 401 })
  }
}