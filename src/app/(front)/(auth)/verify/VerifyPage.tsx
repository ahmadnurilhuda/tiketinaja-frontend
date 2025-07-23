"use client";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";
import { CheckCircle2 } from "lucide-react";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  type User = {
    email: string;
    fullName: string;
    nickName: string;
    phoneNumber: string;
  };

  const [user, setUser] = React.useState<User>({} as User);
  const [message, setMessage] = React.useState("");
  const [success, setSuccess] = React.useState(false);

  const handleContinue = () => {
    router.push("/login");
  };

  React.useEffect(() => {
    const getVerify = async () => {
      try {
        const res = await fetch(`${baseUrl}/auth/verify/${token}`);
        const data = await res.json();

        if (data.success === false) {
          throw new Error(data.message);
        }
        setUser(data.data);
        setMessage(data.message);
        setSuccess(data.success);
        toast.success(data.message);

        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } catch (error) {
        toast.error((error as Error).message);
      }
    };

    if (token) {
      getVerify();
    }
  }, [token]);

  return (
    <>
      {success && (
        <section className="bg-gray-50 flex items-center justify-center min-h-screen">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 m-4 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="w-20 h-20 text-blue-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">{message}</h1>
            <div>
              <p className="text-gray-500 mb-6">
                Your Account has been verified successfully
              </p>
              <div className="text-left bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {user.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {user.fullName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Nickname</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {user.nickName}
                  </p>
                </div>
              </div>
              <button
                onClick={handleContinue}
                className="w-full mt-8 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors duration-300"
              >
                Continue
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
