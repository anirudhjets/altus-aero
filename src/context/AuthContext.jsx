import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [plan, setPlan] = useState('free')
  const [loading, setLoading] = useState(true)

  const fetchPlan = async (userId) => {
    if (!userId) {
      setPlan('free')
      return
    }
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', userId)
        .single()
      if (error || !data) {
        setPlan('free')
      } else {
        setPlan(data.plan || 'free')
      }
    } catch {
      setPlan('free')
    }
  }

  const refreshPlan = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user?.id) {
      await fetchPlan(session.user.id)
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null
      setUser(u)
      fetchPlan(u?.id).finally(() => setLoading(false))
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      fetchPlan(u?.id)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = (email, password) => supabase.auth.signUp({ email, password })
  const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password })
  const signOut = () => supabase.auth.signOut()

  return (
    <AuthContext.Provider value={{ user, plan, loading, refreshPlan, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}