import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create your account</h1>
        <p className="mt-2 text-gray-600">
          Start your productivity journey today
        </p>
      </div>
      <SignupForm />
    </>
  );
}
