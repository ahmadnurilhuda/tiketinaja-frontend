"use client";
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Mail, Lock, Ticket } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";
import { signIn } from "next-auth/react";

function LoginPage() {
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .trim()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const initialValues = {
    email: "",
    password: "",
  };

  const handleLogin = async (values: { email: string; password: string }) => {
    if (!values.email || !values.password) {
      toast.error("Please fill in all the fields.");
      return;
    }
    try {
      const response = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    console.log(response);

    if(!response?.ok) {
      throw new Error(response?.error ?? "Login failed");
    }
    if(response?.status === 200) {
      toast.success("Login successful");
    }
      
    } catch (error) {
      console.error(error);
      toast.error((error as Error).message);
    }
  };
  return (
    <>
      <section className="bg-gray-50">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <Link
            href="/"
            className="flex items-center gap-2 mb-6 text-2xl font-semibold text-gray-900"
          >
            <Ticket className="w-8 h-8 text-blue-600" />
            <span className="text-gray-900">TiketinAja</span>
          </Link>
          <div className="w-full bg-white rounded-lg shadow-lg md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-center text-gray-900 md:text-2xl">
                Sign in to Your Account
              </h1>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleLogin}
              >
                {({ isSubmitting, errors, touched }) => (
                  <Form className="space-y-4 md:space-y-6">
                    <div>
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        Email Anda
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Mail className="w-5 h-5 text-gray-400" />
                        </div>
                        <Field
                          type="email"
                          name="email"
                          id="email"
                          className={`bg-gray-50 border ${
                            errors.email && touched.email
                              ? "border-red-500"
                              : "border-gray-300"
                          } text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 transition-colors`}
                          placeholder="nama@email.com"
                        />
                      </div>
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-600 text-xs mt-1"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        Kata Sandi
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                        <Field
                          type="password"
                          name="password"
                          id="password"
                          placeholder="••••••••"
                          className={`bg-gray-50 border ${
                            errors.password && touched.password
                              ? "border-red-500"
                              : "border-gray-300"
                          } text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 transition-colors`}
                        />
                      </div>
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-600 text-xs mt-1"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      {isSubmitting ? "Loading..." : "Sign Up"}
                    </button>
                    <div className="flex-col items-center justify-center gap-10">
                      <p className="text-sm font-light text-center text-gray-500">
                        Do not have an account yet?{" "}
                        <Link
                          href="/register"
                          className="font-medium text-blue-600 hover:underline"
                        >
                          Sign Up
                        </Link>
                      </p>
                      <p className="text-sm font-light text-center text-gray-500">
                        Resend verification?{" "}
                        <Link
                          href="/new-verify"
                          className="font-medium text-blue-600 hover:underline"
                        >
                          Resend
                        </Link>
                      </p>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default LoginPage;
