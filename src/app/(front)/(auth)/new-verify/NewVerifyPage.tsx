"use client"
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {Mail, Ticket, } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";

function NewVerifyPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .trim()
      .email("Invalid email format")
      .required("Email is required"),
  });

  const initialValues = {
    email: "",
  };

  const handleRegister = async (values: { email: string }) => {
    if (!values.email) {
      toast.error("Please fill in all the fields.");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/auth/new-verify`, {
        method: "POST",
        body: JSON.stringify(values.email),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.status !== 200) {
        throw new Error(data.message);
      }
      toast.success(`${data.message} please check your email for verification link`);
    } catch (error) {
      console.error(error);
      toast.error((error as Error).message);
    }
  };
  return (
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
              New Code Verification
            </h1>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleRegister}
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

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {isSubmitting ? "Loading..." : "Sign Up"}
                  </button>
                  <p className="text-sm font-light text-center text-gray-500">
                    Do you already have an account?{" "}
                    <Link
                      href="/login"
                      className="font-medium text-blue-600 hover:underline"
                    >
                      Login
                    </Link>
                  </p>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NewVerifyPage;
