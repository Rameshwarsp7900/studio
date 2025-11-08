import Link from "next/link";
import { Logo } from "@/components/logo";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="container z-40 bg-background">
                <div className="flex h-20 items-center justify-between py-6">
                    <Link href="/">
                        <Logo />
                    </Link>
                </div>
            </header>
            <main className="flex-1 flex items-center justify-center py-12">
                {children}
            </main>
        </div>
    );
}
