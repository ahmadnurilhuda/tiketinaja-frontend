"use client";
import React, { useTransition } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { TicketType, TicketTypeRequest } from "@/types/TicketType";
import { start } from "repl";

// Skema validasi berdasarkan anotasi Java Anda
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(3, "Nama tiket minimal 3 karakter")
    .max(100, "Nama tiket maksimal 100 karakter")
    .required("Nama tiket wajib diisi"),
  description: Yup.string().trim().optional(),
  quantity: Yup.number()
    .integer("Kuantitas harus berupa angka bulat")
    .min(0, "Kuantitas tidak boleh negatif")
    .required("Kuantitas wajib diisi"),
  price: Yup.number()
    .min(0, "Harga tidak boleh negatif")
    .required("Harga wajib diisi"),
  startDate: Yup.date()
    .required('Tanggal mulai penjualan wajib diisi')
    // Tambahkan validasi .min() untuk memastikan tanggalnya hari ini atau di masa depan
    .min(new Date(), 'Tanggal mulai tidak boleh di masa lalu'),
  endDate: Yup.date()
    .required('Tanggal akhir penjualan wajib diisi')
    .min(Yup.ref('startDate'), 'Tanggal akhir harus setelah tanggal mulai'),
});

interface TicketTypeFormProps {
  onFormSubmit: (
    values: TicketTypeRequest
  ) => Promise<{ success: boolean; error?: string } | void>;
  initialData?: TicketType;
}

function TicketTypeForm({ onFormSubmit, initialData }: TicketTypeFormProps) {
  const [isPending, startTransition] = useTransition();
  const isEditMode = Boolean(initialData);

  const initialValues = {
    id: initialData?.id || "",
    name: initialData?.name || "",
    description: initialData?.description || "",
    quantity: initialData?.quantity || 0,
    price: initialData?.price || 0,
    event: initialData?.event || null,
    startDate: initialData?.startDate
      ? new Date(initialData.startDate).toISOString().slice(0, 16)
      : "",
    endDate: initialData?.endDate
      ? new Date(initialData.endDate).toISOString().slice(0, 16)
      : "",
    createdAt: initialData?.createdAt || "",
    updatedAt: initialData?.updatedAt || "",
  };

  const handleSubmit = (values: typeof initialValues, formikhelpers: FormikHelpers<typeof initialValues>) => {
    if (isPending) {
      return;
    }
    startTransition(async () => {
      const payload = {
        name: values.name,
        description: values.description,
        quantity: Number(values.quantity), 
        price: Number(values.price),
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
      };
      console.log("Payload yang dikirim:", payload);
      const result = await onFormSubmit(payload);
      if (result && result.success) {
        formikhelpers.resetForm();
      }
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, formikHelpers) => handleSubmit(values, formikHelpers)}
      enableReinitialize
    >
      {() => (
        <Form className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nama Tiket
            </label>
            <Field
              name="name"
              type="text"
              placeholder="cth: VIP"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-4 py-4 focus:border-blue-500 focus:ring-blue-500"
            />
            <ErrorMessage
              name="name"
              component="div"
              className="text-red-600 text-xs mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Harga (IDR)
              </label>
              <Field
                name="price"
                type="number"
                placeholder="50000"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-4 py-4 focus:border-blue-500 focus:ring-blue-500"
              />
              <ErrorMessage
                name="price"
                component="div"
                className="text-red-600 text-xs mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700"
              >
                Kuantitas
              </label>
              <Field
                name="quantity"
                type="number"
                placeholder="100"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-4 py-4 focus:border-blue-500 focus:ring-blue-500"
              />
              <ErrorMessage
                name="quantity"
                component="div"
                className="text-red-600 text-xs mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700"
              >
                Mulai Dijual
              </label>
              <Field
                name="startDate"
                type="datetime-local"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-4 py-4 focus:border-blue-500 focus:ring-blue-500"
              />
              <ErrorMessage
                name="startDate"
                component="div"
                className="text-red-600 text-xs mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700"
              >
                Berakhir Dijual
              </label>
              <Field
                name="endDate"
                type="datetime-local"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-4 py-4 focus:border-blue-500 focus:ring-blue-500"
              />
              <ErrorMessage
                name="endDate"
                component="div"
                className="text-red-600 text-xs mt-1"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Deskripsi (Opsional)
            </label>
            <Field
              name="description"
              as="textarea"
              rows="3"
              placeholder="Jelaskan benefit dari tiket ini..."
              className="mt-1 block w-full px-4 py-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <ErrorMessage
              name="description"
              component="div"
              className="text-red-600 text-xs mt-1"
            />
          </div>

          <div className="pt-4 flex gap-4">
            <button type="reset" className="w-full cursor-pointer flex justify-center border border-transparent rounded-lg px-4 py-4 shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Reset</button>
            <button
              type="submit"
              disabled={isPending}
              className="w-full cursor-pointer flex justify-center border border-transparent rounded-lg px-4 py-4 shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
            >
              {isPending
                ? "Menyimpan..."
                : isEditMode
                ? "Simpan Perubahan"
                : "Tambah Tiket"}
            </button>
            
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default TicketTypeForm;
