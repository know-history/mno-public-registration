'use client'

export default function LoginModal() {
  console.log("LoginModal rendered - this means interception is working!")
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg">
        <h2>Login Modal (Intercepted Route)</h2>
        <p>URL: /login</p>
        <p>This is working! ✅</p>
      </div>
    </div>
  )
}