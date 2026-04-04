import { Navbar } from '@/components/navbar';
import { AuthForm } from '@/components/auth-form';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex items-center justify-center py-12 px-4">
        <AuthForm type="register" />
      </main>
    </div>
  );
}
