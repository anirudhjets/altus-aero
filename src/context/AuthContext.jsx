import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [plan, setPlan] = useState('free')
  const [hasOnboarded, setHasOnboarded] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId) => {
    if (!userId) {
      setPlan('free')
      setHasOnboarded(false)
      return
    }
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('plan, has_onboarded')
        .eq('id', userId)
        .single()
      if (error || !data) {
        setPlan('free')
        setHasOnboarded(false)
      } else {
        setPlan(data.plan || 'free')
        setHasOnboarded(data.has_onboarded ?? false)
      }
    } catch {
      setPlan('free')
      setHasOnboarded(false)
    }
  }

  const refreshPlan = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user?.id) {
      await fetchProfile(session.user.id)
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null
      setUser(u)
      fetchProfile(u?.id).finally(() => setLoading(false))
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      fetchProfile(u?.id)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = (email, password, options) =>
    supabase.auth.signUp({ email, password, options })
  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })
  const signOut = () => supabase.auth.signOut()

  return (
    <AuthContext.Provider
      value={{
        user,
        plan,
        hasOnboarded,
        setHasOnboarded,
        loading,
        refreshPlan,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}