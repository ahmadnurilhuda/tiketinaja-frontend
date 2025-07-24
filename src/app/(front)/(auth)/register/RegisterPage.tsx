"use client";
import React from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { User, Mail, Lock, Smartphone, UserSquare, Ticket } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";

function RegisterPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const validationSchema = Yup.object().shape({
    fullName: Yup.string().trim().required("Fullname is required"),
    nickName: Yup.string().trim().required("Nickname is required"),
    email: Yup.string()
      .trim()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    phoneNumber: Yup.string()
      .trim()
      .matches(/^[0-9]+$/, "Phone number must be digits only")
      .min(10, "Phone number seems too short")
      .required("Phone number is required"),
  });

  const initialValues = {
    fullName: "",
    nickName: "",
    email: "",
    password: "",
    phoneNumber: "",
  };

  const handleRegister = async (
    values: typeof initialValues,
    formikHelpers: FormikHelpers<typeof initialValues>
  ) => {
    if (
      !values.fullName ||
      !values.nickName ||
      !values.email ||
      !values.password ||
      !values.phoneNumber
    ) {
      toast.error("Please fill in all the fields.");
      return;
    }
    const form = new FormData();
    form.append("fullName", values.fullName);
    form.append("nickName", values.nickName);
    form.append("email", values.email);
    form.append("password", values.password);
    form.append("phoneNumber", values.phoneNumber);

    try {
      const response = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        body: form,
      });

      const data = await response.json();

      if (response.status !== 200) {
        throw new Error(data.message);
      }

      toast.success(
        `${data.message} please check your email for verification link`
      );
      formikHelpers.resetForm();
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
              Create Your Account
            </h1>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={async (values, formikHelpers) => {
                await handleRegister(values, formikHelpers);
              }}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-4 md:space-y-6">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      Nama Lengkap
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                      <Field
                        type="text"
                        name="fullName"
                        id="fullName"
                        className={`bg-gray-50 border ${
                          errors.fullName && touched.fullName
                            ? "border-red-500"
                            : "border-gray-300"
                        } text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 transition-colors`}
                        placeholder="John Doe"
                      />
                    </div>
                    <ErrorMessage
                      name="fullName"
                      component="div"
                      className="text-red-600 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="nickName"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      Nama Panggilan
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <UserSquare className="w-5 h-5 text-gray-400" />
                      </div>
                      <Field
                        type="text"
                        name="nickName"
                        id="nickName"
                        className={`bg-gray-50 border ${
                          errors.nickName && touched.nickName
                            ? "border-red-500"
                            : "border-gray-300"
                        } text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 transition-colors`}
                        placeholder="john.d"
                      />
                    </div>
                    <ErrorMessage
                      name="nickName"
                      component="div"
                      className="text-red-600 text-xs mt-1"
                    />
                  </div>

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

                  <div>
                    <label
                      htmlFor="phone"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      Nomor Telepon
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Smartphone className="w-5 h-5 text-gray-400" />
                      </div>
                      <Field
                        type="text"
                        name="phoneNumber"
                        id="phone"
                        className={`bg-gray-50 border ${
                          errors.phoneNumber && touched.phoneNumber
                            ? "border-red-500"
                            : "border-gray-300"
                        } text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 transition-colors`}
                        placeholder="081234567890"
                      />
                    </div>
                    <ErrorMessage
                      name="phone"
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

export default RegisterPage;
