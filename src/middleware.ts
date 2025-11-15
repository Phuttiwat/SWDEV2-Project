import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import getUserRole from "./libs/getUserRole"

export default withAuth(
    async function middleware(req) {
        const token = req.nextauth.token as any
        const path = req.nextUrl.pathname

        // ============================================
        // 1. Routes ที่ต้อง Login (role ใดก็ได้)
        // ============================================
        const protectedRoutes = ['/request', '/myrequest']
        
        if (protectedRoutes.some(route => path.startsWith(route))) {
            // เช็คว่า login แล้วหรือยัง
            if (!token) {
                // ถ้ายังไม่ login ให้ redirect ไปหน้า signin
                return NextResponse.redirect(new URL('/api/auth/signin', req.url))
            }
        } 

        // ============================================
        // 2. Routes ที่ต้องมี Role เฉพาะ
        // ============================================
        
        // Routes ที่ต้องเป็น admin เท่านั้น
        const adminRoutes = ['/product/add']
        if (adminRoutes.some(route => path.startsWith(route))) {
            if (!token?.token) {
                return NextResponse.redirect(new URL('/api/auth/signin', req.url))
            }
            
            const userRole = await getUserRole(token?.token);
            
            if (!userRole || userRole !== 'admin') {
                // ถ้า role ไม่ใช่ admin ให้ redirect ไปหน้า unauthorized
                return NextResponse.redirect(new URL('/unauthorized', req.url))
            }
        }

        // Routes ที่ต้องเป็น staff หรือ admin
        const staffRoutes = ['/request','/myrequest']
        if (staffRoutes.some(route => path.startsWith(route))) {
            if (!token?.token) {
                return NextResponse.redirect(new URL('/api/auth/signin', req.url))
            }
            
            const userRole = await getUserRole(token?.token);
            
            if (!userRole || (userRole !== 'staff' && userRole !== 'admin')) {
                // ถ้า role ไม่ใช่ staff หรือ admin ให้ redirect ไปหน้า unauthorized
                return NextResponse.redirect(new URL('/unauthorized', req.url))
            }
        }

        // ถ้าผ่านทุกเงื่อนไข ให้ไปต่อ
        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const path = req.nextUrl.pathname
                
                // Public routes ที่ไม่ต้องเช็ค token
                const publicRoutes = [
                    '/', 
                    '/register', 
                    '/api/auth', 
                    '/product',
                    '/unauthorized'
                ]
                
                // ถ้าเป็น public route ให้ผ่านเลย
                if (publicRoutes.some(route => path.startsWith(route))) {
                    return true
                }

                // Routes อื่นๆ ต้องมี token (login แล้ว)
                return !!token
            },
        },
    }
)

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (public folder)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}

