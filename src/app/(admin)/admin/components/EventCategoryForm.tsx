"use client";
import React, { useTransition } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

// Define the validation schema using Yup
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(3, "Nama kategori minimal 3 karakter")
    .required("Nama kategori wajib diisi"),
  description: Yup.string()
    .trim()
    .min(10, "Deskripsi minimal 10 karakter")
    .required("Deskripsi wajib diisi"),
});

interface EventCategoryFormProps {
  onFormSubmit?: (values: { name: string; description: string }) => void;
  submitting?: boolean;
  initialData?: { name: string; description: string };
}

function EventCategoryForm({
  onFormSubmit,
  initialData,
}: EventCategoryFormProps) {
  const [isPending, startTransition] = useTransition();
  const initialValues = {
    name: initialData?.name || "",
    description: initialData?.description || "",
  };

  // Handle form submission
  const handleSubmit = async (
    values: typeof initialValues,
    formikHelpers: FormikHelpers<typeof initialValues>
  ) => {
    if (isPending) {
      return;
    }
    startTransition(() => {
      try {
        console.log("Form submitted with values:", values);
        formikHelpers.setSubmitting(true);
        toast.success(
          initialData
            ? "Kategori berhasil diperbarui!"
            : "Kategori berhasil ditambahkan!"
        );

        if (onFormSubmit) {
          onFormSubmit(values);
        }
        formikHelpers.resetForm();
      } catch (error) {
        console.error("Failed to submit form:", error);
        toast.error("Gagal menyimpan kategori. Silakan coba lagi.");
      } finally {
        formikHelpers.setSubmitting(false);
      }
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {initialData ? "Edit Kategori Event" : "Buat Kategori Event Baru"}
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="space-y-6">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nama Kategori
              </label>
              <Field
                type="text"
                id="name"
                name="name"
                placeholder="cth: Konser Musik"
                className={`block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ${
                  errors.name && touched.name ? "ring-red-500" : "ring-gray-300"
                } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm`}
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-600 text-xs mt-1"
              />
            </div>

            {/* Description Field */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Deskripsi
              </label>
              <Field
                as="textarea"
                id="description"
                name="description"
                rows="4"
                placeholder="Jelaskan tentang kategori ini..."
                className={`block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ${
                  errors.description && touched.description
                    ? "ring-red-500"
                    : "ring-gray-300"
                } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm`}
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-600 text-xs mt-1"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-between gap-2">
              <button
                type="reset"
                className="flex w-full justify-center rounded-md bg-blue-200 px-3 py-2.5 text-sm font-semibold leading-6 text-blue-600 shadow-sm hover:bg-blue-300 text-blue-50 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? "Menyimpan..."
                  : initialData
                  ? "Simpan Perubahan"
                  : "Simpan Kategori"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default EventCategoryForm;
