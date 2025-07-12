import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

const AuthCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the auth callback from the URL
        const { data, error } = await supabase.auth.getSession()
        
        // Also try to get session from URL hash/query params
        const { data: sessionData, error: sessionError } = await supabase.auth.getUser()
        
        if (error || sessionError) {
          console.error('Auth callback error:', error || sessionError)
          const errorMessage = error?.message || sessionError?.message || 'Authentication failed'
          navigate('/auth?error=' + encodeURIComponent(errorMessage))
          return
        }

        if (data.session || sessionData.user) {
          // Successfully authenticated, redirect to main app
          console.log('Authentication successful, redirecting to home')
          navigate('/')
        } else {
          // No session, redirect back to auth
          console.log('No session found, redirecting to auth')
          navigate('/auth')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        navigate('/auth?error=' + encodeURIComponent('Authentication callback failed'))
      }
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Completing authentication...</p>
        <p className="text-sm text-muted-foreground mt-2">This may take a few moments</p>
      </div>
    </div>
  )
}

export default AuthCallback