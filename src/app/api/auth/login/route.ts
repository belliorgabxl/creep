// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

// ฟังก์ชันสำหรับตรวจสอบ user กับ database
async function verifyUserCredentials(username: string, password: string) {
  try {
    const mockUsers = [
      { username: "admin", password: "admin123", role: "admin", id: "1", name: "Admin User" },
      { username: "user", password: "user123", role: "user", id: "2", name: "Regular User" },
    ];

    const user = mockUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) return null;

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
}

// สร้าง JWT token
async function createToken(payload: any) {
  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || "your-secret-key-min-32-characters-long"
  );

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("4h")
    .sign(secret);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน" },
        { status: 400 }
      );
    }

    const user = await verifyUserCredentials(username.trim(), password.trim());

    // if (!user) {
    //   return NextResponse.json(
    //     { success: false, message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" },
    //     { status: 401 }
    //   );
    // }

    // สร้าง JWT token
    // const token = await createToken({
    //   sub: user.id,
    //   username: user.username,
    //   role: user.role,
    //   name: user.name,
    // });
    const token = await createToken({
      sub: 123456,
      username: "demo",
      role: "user",
      name: "toto",
    });


    // const response = NextResponse.json({
    //   success: true,
    //   user: {
    //     id: user.id,
    //     username: user.username,
    //     name: user.name,
    //     role: user.role,
    //   },
    // });
    const response = NextResponse.json({
      success: true,
      user: {
        id: 123456,
        username: "demo",
        name: "toto",
        role: "user",
      },
    });

    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 4, // 4 hours
      path: "/",
    });

    // response.cookies.set({
    //   name: "user_role",
    //   value: user.role,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "lax",
    //   maxAge: 60 * 60 * 4,
    //   path: "/",
    // });

     response.cookies.set({
      name: "user_role",
      value: "user",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 4,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" },
      { status: 500 }
    );
  }
}