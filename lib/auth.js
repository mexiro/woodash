import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

function getUsers() {
  const users = []
  let i = 1
  while (process.env[`AUTH_USER_${i}_EMAIL`]) {
    users.push({
      id: String(i),
      email: process.env[`AUTH_USER_${i}_EMAIL`],
      password: process.env[`AUTH_USER_${i}_PASSWORD`],
      name: process.env[`AUTH_USER_${i}_NAME`],
      role: process.env[`AUTH_USER_${i}_ROLE`],
    })
    i++
  }
  return users
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize(credentials) {
        const users = getUsers()
        const user = users.find(
          u => u.email === credentials.email && u.password === credentials.password
        )
        if (user) return { id: user.id, email: user.email, name: user.name, role: user.role }
        return null
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = user.role
      return token
    },
    session({ session, token }) {
      if (token.role) session.user.role = token.role
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
})
