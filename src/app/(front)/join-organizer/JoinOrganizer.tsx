"use client";
import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import {
  UserSquare,
  Mail,
  Phone,
  Globe,
  NotebookText,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import repository from "@/app/config/AxiosClientConfig";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

function JoinOrganizer() {
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();
  const {data: session, status, update} = useSession();

  const [isReadyToNavigate, setIsReadyToNavigate] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required("Name Organizer is required"),
    email: Yup.string()
      .trim()
      .email("Invalid email format")
      .required("Email Organizer is required"),
    phoneNumber: Yup.string()
      .trim()
      .matches(/^[0-9]+$/, "Phone number must be digits only")
      .min(10, "Phone number seems too short")
      .required("Phone number is required"),
    profilePicture: Yup.mixed()
      .required("Profile picture is required")
      .test(
        "fileSize",
        "File size must be less than 5MB",
        (value) => value instanceof File && value.size <= 5 * 1024 * 1024 // 5MB
      )
      .test(
        "fileType",
        "Invalid file type. Only JPEG, PNG, and JPG are allowed",
        (value) =>
          value instanceof File &&
          ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
      ),
    biography: Yup.string()
      .trim()
      .min(10, "Biography must be at least 10 characters")
      .max(1000, "Biography must be at most 1000 characters"),
    websiteUrl: Yup.string().url("Invalid website URL").optional(),
  });

  const initialValues = {
    name: "",
    email: "",
    phoneNumber: "",
    profilePicture: null,
    websiteUrl: "",
    biography: "",
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    if (isReadyToNavigate && session?.user?.organizer === true) {
      toast.info("Redirecting to Organizer Dashboard");
      router.push("/organizer");
    }
  }, [session, isReadyToNavigate, router, status]);

  const handleSubmit = async (
    values: typeof initialValues,
    formikHelpers: FormikHelpers<typeof initialValues>
  ) => {
    const { setSubmitting, resetForm } = formikHelpers;
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("phoneNumber", values.phoneNumber);
    if (values.profilePicture) {
      formData.append("profilePicture", values.profilePicture);
    }
    formData.append("websiteUrl", values.websiteUrl);
    formData.append("biography", values.biography);
    try {
      const response = await repository.post("/organizer/register", formData);
      if (response.status !== 200) {
        throw new Error(response.data.message);
      }
      toast.success(response.data.message);
      await update();
      // resetForm();
      setIsReadyToNavigate(true);
    } catch (error) {
      console.error(error);
      toast.error((error as Error).message);
    }
    setSubmitting(false);
  };

  return (
    <main className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Become an Organizer
            </h1>
            <p className="text-gray-500 mt-2">
              Daftarkan diri Anda untuk mulai membuat event.
            </p>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values, formikHelpers) => {
              await handleSubmit(values, formikHelpers);
            }}
          >
            {({ isSubmitting, setFieldValue, errors, touched }) => (
              <Form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Picture
                  </label>
                  <div className="mt-2 flex items-center gap-x-4">
                    {preview ? (
                      <Image
                        src={preview}
                        alt="Profile Preview"
                        width={96}
                        height={96}
                        style={{ objectFit: "cover" }}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <label
                      htmlFor="profilePicture"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500 border border-gray-300 px-4 py-2 text-sm shadow-sm"
                    >
                      <span>Unggah File</span>
                      <input
                        id="profilePicture"
                        name="profilePicture"
                        type="file"
                        className="sr-only"
                        onChange={(event) => {
                          const files = event.currentTarget.files;
                          if (files && files[0]) {
                            setFieldValue("profilePicture", files[0]);
                            if (preview) {
                              URL.revokeObjectURL(preview);
                            }
                            setPreview(URL.createObjectURL(files[0]));
                          }
                        }}
                      />
                    </label>
                  </div>
                  <ErrorMessage
                    name="profilePicture"
                    component="div"
                    className="text-red-600 text-xs mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name Organizer
                  </label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <UserSquare className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      type="text"
                      id="name"
                      name="name"
                      className={`block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 ring-1 ring-inset ${
                        errors.name && touched.name
                          ? "ring-red-500"
                          : "ring-gray-300"
                      } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm`}
                      placeholder="Nama Brand Event Anda"
                    />
                  </div>
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-600 text-xs mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Organizer
                  </label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className={`block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 ring-1 ring-inset ${
                        errors.email && touched.email
                          ? "ring-red-500"
                          : "ring-gray-300"
                      } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm`}
                      placeholder="email@organizer.com"
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
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone
                  </label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      type="text"
                      id="phoneNumber"
                      name="phoneNumber"
                      className={`block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 ring-1 ring-inset ${
                        errors.phoneNumber && touched.phoneNumber
                          ? "ring-red-500"
                          : "ring-gray-300"
                      } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm`}
                      placeholder="081234567890"
                    />
                  </div>
                  <ErrorMessage
                    name="phoneNumber"
                    component="div"
                    className="text-red-600 text-xs mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="websiteUrl"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Website (Opsional)
                  </label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Globe className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      type="text"
                      id="websiteUrl"
                      name="websiteUrl"
                      className="block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                      placeholder="https://websiteanda.com"
                    />
                  </div>
                  <ErrorMessage
                    name="websiteUrl"
                    component="div"
                    className="text-red-600 text-xs mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="biography"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Biography (Opsional)
                  </label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute left-3 top-3.5">
                      <NotebookText className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      as="textarea"
                      id="biography"
                      name="biography"
                      rows="4"
                      className="block w-full rounded-md border-0 py-2.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                      placeholder="Ceritakan tentang organizer Anda..."
                    />
                  </div>

                  <ErrorMessage
                    name="biography"
                    component="div"
                    className="text-red-600 text-xs mt-1"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Mengirim..." : "Daftar sebagai Organizer"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </main>
  );
}

export default JoinOrganizer;
